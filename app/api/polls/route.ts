import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '10')
  const status = searchParams.get('status') ?? 'all'
  const offset = (page - 1) * limit

  let query = supabase
    .from('polls')
    .select(`
      *,
      author:profiles!polls_user_id_fkey(id, display_name, avatar_url)
    `, { count: 'exact' })

  const now = new Date().toISOString()
  if (status === 'active') {
    query = query.or(`ends_at.gt.${now},ends_at.is.null`)
  } else if (status === 'ended') {
    query = query.lt('ends_at', now)
  }

  const { data: polls, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Calculate if polls are active
  const pollsWithStatus = polls?.map((poll) => ({
    ...poll,
    is_currently_active: !poll.ends_at || new Date(poll.ends_at) > new Date(),
  })) ?? []

  return NextResponse.json({
    polls: pollsWithStatus,
    pagination: {
      page,
      limit,
      total: count ?? 0,
      pages: Math.ceil((count ?? 0) / limit),
    },
  })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { question, options, bible_reference, duration } = body

  if (!question || !options || options.length < 2) {
    return NextResponse.json({ error: 'Question and at least 2 options are required' }, { status: 400 })
  }

  // Calculate end date
  const durationDays = parseInt(duration) || 7
  const endsAt = new Date()
  endsAt.setDate(endsAt.getDate() + durationDays)

  // Create poll with options as JSONB
  const optionsData = options.map((text: string) => ({ text, votes: 0 }))

  const { data: poll, error } = await supabase
    .from('polls')
    .insert({
      user_id: user.id,
      question,
      options: optionsData,
      bible_reference: bible_reference ?? null,
      ends_at: endsAt.toISOString(),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Award points for creating a poll
  await supabase
    .from('profiles')
    .update({ points: supabase.sql`points + 5` })
    .eq('id', user.id)

  return NextResponse.json({ poll }, { status: 201 })
}

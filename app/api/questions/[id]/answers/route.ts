import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const sort = searchParams.get('sort') ?? 'votes'

  let query = supabase
    .from('answers')
    .select(`
      *,
      author:profiles!answers_user_id_fkey(id, display_name, avatar_url, level, points)
    `)
    .eq('question_id', id)

  switch (sort) {
    case 'recent':
      query = query.order('created_at', { ascending: false })
      break
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    case 'votes':
    default:
      query = query.order('vote_count', { ascending: false }).order('created_at', { ascending: false })
  }

  const { data: answers, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ answers })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { content, bible_references } = body

  if (!content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }

  // Check if question exists
  const { data: question } = await supabase
    .from('questions')
    .select('id, user_id')
    .eq('id', id)
    .single()

  if (!question) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 })
  }

  // Create answer
  const { data: answer, error } = await supabase
    .from('answers')
    .insert({
      question_id: id,
      user_id: user.id,
      content,
      bible_references: bible_references ?? [],
    })
    .select(`
      *,
      author:profiles!answers_user_id_fkey(id, display_name, avatar_url, level, points)
    `)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Update question's answer count and mark as answered
  await supabase
    .from('questions')
    .update({ 
      answer_count: supabase.sql`answer_count + 1`,
      is_answered: true,
      status: 'answered'
    })
    .eq('id', id)

  // Update user's answers count and points
  await supabase
    .from('profiles')
    .update({ 
      answers_count: supabase.sql`answers_count + 1`,
      points: supabase.sql`points + 10`
    })
    .eq('id', user.id)

  // Notify question author
  if (question.user_id !== user.id) {
    await supabase.from('notifications').insert({
      user_id: question.user_id,
      type: 'answer',
      title: 'New answer on your question',
      message: 'Someone answered your question',
      link: `/questions/${id}`,
      actor_id: user.id,
    })
  }

  return NextResponse.json({ answer }, { status: 201 })
}

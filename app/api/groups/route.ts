import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '12')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') ?? 'popular'
  const offset = (page - 1) * limit

  let query = supabase
    .from('groups')
    .select(`
      *,
      owner:profiles!groups_owner_id_fkey(id, display_name, avatar_url)
    `, { count: 'exact' })
    .eq('is_private', false)

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  switch (sort) {
    case 'recent':
      query = query.order('created_at', { ascending: false })
      break
    case 'popular':
    default:
      query = query.order('member_count', { ascending: false })
  }

  const { data: groups, error, count } = await query
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    groups,
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
  const { name, description, is_private, tags } = body

  if (!name || !description) {
    return NextResponse.json({ error: 'Name and description are required' }, { status: 400 })
  }

  // Create group
  const { data: group, error } = await supabase
    .from('groups')
    .insert({
      name,
      description,
      is_private: is_private ?? false,
      tags: tags ?? [],
      owner_id: user.id,
      member_count: 1,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Add creator as owner member
  await supabase.from('group_members').insert({
    group_id: group.id,
    user_id: user.id,
    role: 'owner',
  })

  // Award points for creating a group
  await supabase
    .from('profiles')
    .update({ points: supabase.sql`points + 15` })
    .eq('id', user.id)

  return NextResponse.json({ group }, { status: 201 })
}

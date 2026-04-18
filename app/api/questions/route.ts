import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '10')
  const sort = searchParams.get('sort') ?? 'recent'
  const tag = searchParams.get('tag')
  const status = searchParams.get('status')
  
  const offset = (page - 1) * limit
  
  let query = supabase
    .from('questions')
    .select(`
      *,
      author:profiles!questions_user_id_fkey(id, display_name, avatar_url, level, points)
    `, { count: 'exact' })
  
  if (tag) {
    query = query.contains('tags', [tag])
  }
  
  if (status === 'answered') {
    query = query.eq('is_answered', true)
  } else if (status === 'unanswered') {
    query = query.eq('is_answered', false)
  }
  
  switch (sort) {
    case 'popular':
      query = query.order('vote_count', { ascending: false })
      break
    case 'trending':
      query = query.order('view_count', { ascending: false })
      break
    case 'unanswered':
      query = query.eq('is_answered', false).order('created_at', { ascending: false })
      break
    case 'recent':
    default:
      query = query.order('created_at', { ascending: false })
  }
  
  const { data: questions, error, count } = await query
    .range(offset, offset + limit - 1)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({
    questions,
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
  const { title, content, tags, bible_references } = body
  
  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
  }
  
  const { data: question, error } = await supabase
    .from('questions')
    .insert({
      user_id: user.id,
      title,
      content,
      tags: tags ?? [],
      bible_references: bible_references ?? [],
    })
    .select(`
      *,
      author:profiles!questions_user_id_fkey(id, display_name, avatar_url, level, points)
    `)
    .single()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  // Update user's questions count and points
  await supabase
    .from('profiles')
    .update({ 
      questions_count: supabase.sql`questions_count + 1`,
      points: supabase.sql`points + 5`
    })
    .eq('id', user.id)
  
  return NextResponse.json({ question }, { status: 201 })
}

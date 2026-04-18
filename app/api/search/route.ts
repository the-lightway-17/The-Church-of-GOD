import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const query = searchParams.get('q')
  const type = searchParams.get('type') ?? 'all'
  const limit = parseInt(searchParams.get('limit') ?? '10')

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
  }

  const results: Record<string, unknown[]> = {}

  // Search questions
  if (type === 'all' || type === 'questions') {
    const { data: questions } = await supabase
      .from('questions')
      .select(`
        id, title, content, tags, vote_count, answer_count, created_at,
        author:profiles!questions_user_id_fkey(id, display_name, avatar_url)
      `)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('vote_count', { ascending: false })
      .limit(limit)

    results.questions = questions ?? []
  }

  // Search users
  if (type === 'all' || type === 'users') {
    const { data: users } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url, bio, points, level')
      .or(`display_name.ilike.%${query}%,bio.ilike.%${query}%`)
      .order('points', { ascending: false })
      .limit(limit)

    results.users = users ?? []
  }

  // Search groups
  if (type === 'all' || type === 'groups') {
    const { data: groups } = await supabase
      .from('groups')
      .select('id, name, description, member_count, tags')
      .eq('is_private', false)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('member_count', { ascending: false })
      .limit(limit)

    results.groups = groups ?? []
  }

  // Search discussions
  if (type === 'all' || type === 'discussions') {
    const { data: discussions } = await supabase
      .from('discussions')
      .select(`
        id, title, content, reply_count, created_at,
        group:groups!discussions_group_id_fkey(id, name)
      `)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit)

    results.discussions = discussions ?? []
  }

  // Search polls
  if (type === 'all' || type === 'polls') {
    const { data: polls } = await supabase
      .from('polls')
      .select('id, question, total_votes, ends_at')
      .ilike('question', `%${query}%`)
      .order('total_votes', { ascending: false })
      .limit(limit)

    // Add isActive status
    const now = new Date()
    results.polls = (polls ?? []).map((poll) => ({
      ...poll,
      is_active: !poll.ends_at || new Date(poll.ends_at) > now,
    }))
  }

  return NextResponse.json({ results, query })
}

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET group discussions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const { searchParams } = request.nextUrl

    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    const { data, count, error } = await supabase
      .from('group_discussions')
      .select(
        `
        id,
        title,
        content,
        author_id,
        created_at,
        reply_count,
        view_count,
        is_pinned,
        author:profiles!group_discussions_author_id(id, display_name, bio)
        `,
        { count: 'exact' }
      )
      .eq('group_id', id)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create discussion
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is group member
    const { data: membership } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', id)
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json(
        { error: 'You must be a group member to start discussions' },
        { status: 403 }
      )
    }

    const { title, content, bible_passages } = await request.json()

    // Validate input
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Discussion title is required' },
        { status: 400 }
      )
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Discussion content is required' },
        { status: 400 }
      )
    }

    // Create discussion
    const { data, error } = await supabase
      .from('group_discussions')
      .insert({
        group_id: id,
        title: title.trim(),
        content: content.trim(),
        author_id: user.id,
        bible_passages: bible_passages || null,
      })
      .select(
        `
        id,
        title,
        content,
        author_id,
        created_at,
        author:profiles!group_discussions_author_id(id, display_name, bio)
        `
      )
      .single()

    if (error) {
      console.error('Discussion creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create discussion' },
        { status: 500 }
      )
    }

    // Update group discussion count
    await supabase
      .from('groups')
      .update({ discussion_count: supabase.sql`discussion_count + 1` })
      .eq('id', id)

    // Log activity
    await supabase.from('leaderboard_activities').insert({
      user_id: user.id,
      activity_type: 'discussion_started',
      points: 15,
      group_id: id,
      related_item_id: data.id,
    })

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

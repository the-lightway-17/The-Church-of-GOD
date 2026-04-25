import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET all questions with pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = request.nextUrl

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const sort = searchParams.get('sort') || 'recent'

    let query = supabase
      .from('questions')
      .select(
        `
        id,
        title,
        content,
        category,
        views_count,
        created_at,
        updated_at,
        author:profiles(id, display_name),
        answer_count,
        comment_count
        `,
        { count: 'exact' }
      )

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    switch (sort) {
      case 'popular':
        query = query.order('views_count', { ascending: false })
        break
      case 'unanswered':
        query = query.eq('answer_count', 0).order('created_at', { ascending: false })
        break
      case 'recent':
      default:
        query = query.order('created_at', { ascending: false })
    }

    const { data, count, error } = await query.range(offset, offset + limit - 1)

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

// POST create new question
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has display_name
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()

    if (!profile?.display_name) {
      return NextResponse.json(
        { error: 'Please complete your profile first' },
        { status: 403 }
      )
    }

    const { title, content, category } = await request.json()

    // Validate input
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    if (title.trim().length > 500) {
      return NextResponse.json(
        { error: 'Title must be 500 characters or less' },
        { status: 400 }
      )
    }

    // Create question
    const { data, error } = await supabase
      .from('questions')
      .insert({
        author_id: user.id,
        title: title.trim(),
        content: content.trim(),
        category: category || 'general',
      })
      .select(
        `
        id,
        title,
        content,
        category,
        created_at,
        author:profiles(id, display_name)
        `
      )
      .single()

    if (error) {
      console.error('Question creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create question' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

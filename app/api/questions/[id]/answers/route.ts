import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET answers for a question
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const { searchParams } = request.nextUrl
    const sort = searchParams.get('sort') || 'helpful'

    let query = supabase
      .from('answers')
      .select(
        `
        id,
        content,
        is_accepted,
        vote_count,
        created_at,
        updated_at,
        author:profiles(id, display_name, bio),
        comments(
          id,
          content,
          created_at,
          author:profiles(id, display_name)
        )
        `
      )
      .eq('question_id', id)

    switch (sort) {
      case 'recent':
        query = query.order('created_at', { ascending: false })
        break
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'helpful':
      default:
        query = query.order('is_accepted', { ascending: false }).order('vote_count', { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create answer
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

    // Verify question exists
    const { data: question } = await supabase
      .from('questions')
      .select('id, author_id')
      .eq('id', id)
      .single()

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { content } = body

    // Validate input
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Answer content is required' },
        { status: 400 }
      )
    }

    // Create answer
    const { data, error } = await supabase
      .from('answers')
      .insert({
        question_id: id,
        author_id: user.id,
        content: content.trim(),
      })
      .select(
        `
        id,
        content,
        is_accepted,
        created_at,
        author:profiles(id, display_name, bio)
        `
      )
      .single()

    if (error) {
      console.error('Answer creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create answer' },
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

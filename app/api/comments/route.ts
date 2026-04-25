import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST create comment
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

    const { content, question_id, answer_id } = await request.json()

    // Validate input
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

    // Validate that either question_id or answer_id is provided
    if (!question_id && !answer_id) {
      return NextResponse.json(
        { error: 'Either question_id or answer_id is required' },
        { status: 400 }
      )
    }

    // Create comment
    const { data, error } = await supabase
      .from('comments')
      .insert({
        author_id: user.id,
        question_id: question_id || null,
        answer_id: answer_id || null,
        content: content.trim(),
      })
      .select(
        `
        id,
        content,
        created_at,
        author:profiles(id, display_name)
        `
      )
      .single()

    if (error) {
      console.error('Comment creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create comment' },
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

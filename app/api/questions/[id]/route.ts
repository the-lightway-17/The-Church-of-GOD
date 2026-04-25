import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET single question
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    // Increment view count
    await supabase
      .from('questions')
      .update({ views_count: supabase.sql`views_count + 1` })
      .eq('id', id)

    // Get question with answers and comments
    const { data, error } = await supabase
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
        author:profiles(id, display_name, bio),
        answers(
          id,
          content,
          is_accepted,
          created_at,
          updated_at,
          author:profiles(id, display_name, bio),
          comments(
            id,
            content,
            created_at,
            author:profiles(id, display_name)
          )
        ),
        comments(
          id,
          content,
          created_at,
          author:profiles(id, display_name)
        )
        `
      )
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
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

// PUT update question
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user owns the question
    const { data: question } = await supabase
      .from('questions')
      .select('author_id')
      .eq('id', id)
      .single()

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    if (question.author_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own questions' },
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

    // Update question
    const { data, error } = await supabase
      .from('questions')
      .update({
        title: title.trim(),
        content: content.trim(),
        category: category || 'general',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update question' },
        { status: 500 }
      )
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

// DELETE question
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user owns the question
    const { data: question } = await supabase
      .from('questions')
      .select('author_id')
      .eq('id', id)
      .single()

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    if (question.author_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own questions' },
        { status: 403 }
      )
    }

    // Delete question (cascades to answers and comments)
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete question' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Question deleted successfully' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

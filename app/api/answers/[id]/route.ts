import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// PUT update answer
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

    // Check if user owns the answer
    const { data: answer } = await supabase
      .from('answers')
      .select('author_id')
      .eq('id', id)
      .single()

    if (!answer) {
      return NextResponse.json(
        { error: 'Answer not found' },
        { status: 404 }
      )
    }

    if (answer.author_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own answers' },
        { status: 403 }
      )
    }

    const { content } = await request.json()

    // Validate input
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Answer content is required' },
        { status: 400 }
      )
    }

    // Update answer
    const { data, error } = await supabase
      .from('answers')
      .update({
        content: content.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update answer' },
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

// DELETE answer
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

    // Check if user owns the answer
    const { data: answer } = await supabase
      .from('answers')
      .select('author_id, question_id')
      .eq('id', id)
      .single()

    if (!answer) {
      return NextResponse.json(
        { error: 'Answer not found' },
        { status: 404 }
      )
    }

    if (answer.author_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own answers' },
        { status: 403 }
      )
    }

    // Delete answer
    const { error } = await supabase
      .from('answers')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete answer' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Answer deleted successfully' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST mark answer as accepted (by question author only)
export async function POST(
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

    // Get answer with question info
    const { data: answer } = await supabase
      .from('answers')
      .select('question_id, author_id')
      .eq('id', id)
      .single()

    if (!answer) {
      return NextResponse.json(
        { error: 'Answer not found' },
        { status: 404 }
      )
    }

    // Check if user is the question author
    const { data: question } = await supabase
      .from('questions')
      .select('author_id')
      .eq('id', answer.question_id)
      .single()

    if (question?.author_id !== user.id) {
      return NextResponse.json(
        { error: 'Only the question author can mark answers as accepted' },
        { status: 403 }
      )
    }

    const { is_accepted } = await request.json()

    // Update answer
    const { data, error } = await supabase
      .from('answers')
      .update({ is_accepted })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update answer' },
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

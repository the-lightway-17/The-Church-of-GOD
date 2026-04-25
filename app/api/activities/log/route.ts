import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST log user activity for leaderboard
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

    const { activity_type, group_id, related_item_id } = await request.json()

    // Validate activity type
    const validActivityTypes = [
      'question_created',
      'answer_submitted',
      'answer_accepted',
      'comment_created',
      'discussion_started',
      'group_joined',
    ]

    if (!validActivityTypes.includes(activity_type)) {
      return NextResponse.json(
        { error: 'Invalid activity type' },
        { status: 400 }
      )
    }

    // Determine points based on activity
    const pointMap: Record<string, number> = {
      question_created: 5,
      answer_submitted: 10,
      answer_accepted: 25,
      comment_created: 2,
      discussion_started: 15,
      group_joined: 1,
    }

    const points = pointMap[activity_type] || 1

    // Log activity
    const { data, error } = await supabase
      .from('leaderboard_activities')
      .insert({
        user_id: user.id,
        activity_type,
        points,
        group_id: group_id || null,
        related_item_id: related_item_id || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Activity logging error:', error)
      return NextResponse.json(
        { error: 'Failed to log activity' },
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

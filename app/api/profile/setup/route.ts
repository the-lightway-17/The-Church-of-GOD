import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { display_name, bio } = await request.json()

    // Validate input
    if (!display_name || typeof display_name !== 'string' || display_name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Display name is required' },
        { status: 400 }
      )
    }

    if (display_name.trim().length > 100) {
      return NextResponse.json(
        { error: 'Display name must be 100 characters or less' },
        { status: 400 }
      )
    }

    // Update or insert profile with all stat defaults
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        display_name: display_name.trim(),
        bio: bio || null,
        level: 1,
        streak_days: 0,
        total_points: 0,
        questions_count: 0,
        answers_count: 0,
        comments_count: 0,
        helpful_count: 0,
        games_played: 0,
        games_won: 0,
        game_score: 0,
        badges: [],
        groups_joined: 0,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      })
      .select()
      .single()

    if (error) {
      console.error('Profile setup error:', error)
      return NextResponse.json(
        { error: 'Failed to set up profile' },
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

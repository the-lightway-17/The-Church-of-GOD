import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET specific game with full content
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST submit game answer
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { answer, time_spent_seconds } = body

    // Get the game
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .single()

    if (gameError) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    // Check if answer is correct
    const correctAnswer = game.content.correct_answer
    const isCorrect = JSON.stringify(answer) === JSON.stringify(correctAnswer)
    const pointsEarned = isCorrect ? game.points_on_complete : Math.floor(game.points_on_complete * 0.3)

    // Create attempt record
    const { data: attempt, error: attemptError } = await supabase
      .from('game_attempts')
      .insert({
        game_id: id,
        user_id: user.id,
        answer,
        is_correct: isCorrect,
        points_earned: pointsEarned,
        time_spent_seconds,
      })
      .select()
      .single()

    if (attemptError) {
      return NextResponse.json({ error: 'Failed to save attempt' }, { status: 500 })
    }

    // Update user's game stats
    if (isCorrect) {
      await supabase
        .from('profiles')
        .update({
          games_played: supabase.sql`games_played + 1`,
          games_won: supabase.sql`games_won + 1`,
          game_score: supabase.sql`game_score + ${pointsEarned}`,
          total_points: supabase.sql`total_points + ${pointsEarned}`,
        })
        .eq('id', user.id)
    } else {
      await supabase
        .from('profiles')
        .update({
          games_played: supabase.sql`games_played + 1`,
          game_score: supabase.sql`game_score + ${pointsEarned}`,
          total_points: supabase.sql`total_points + ${pointsEarned}`,
        })
        .eq('id', user.id)
    }

    return NextResponse.json({
      data: attempt,
      is_correct: isCorrect,
      points_earned: pointsEarned,
      correct_answer: correctAnswer,
      commentary: game.content.commentary,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET leaderboard rankings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = request.nextUrl

    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    const { data, count, error } = await supabase
      .from('leaderboard_stats')
      .select(
        `
        user_id,
        total_points,
        rank,
        questions_asked,
        answers_provided,
        answers_accepted,
        comments_made,
        discussions_started,
        groups_joined,
        user:profiles!leaderboard_stats_user_id(
          id,
          display_name,
          bio
        )
        `,
        { count: 'exact' }
      )
      .order('total_points', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate actual ranks based on points
    const rankedData = data?.map((entry, index) => ({
      ...entry,
      rank: offset + index + 1,
    })) || []

    return NextResponse.json({
      data: rankedData,
      pagination: {
        page,
        limit,
        total: count || 0,
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

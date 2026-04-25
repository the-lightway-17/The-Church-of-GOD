import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET games with filtering
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = request.nextUrl

    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') || ''
    const difficulty = searchParams.get('difficulty') || ''
    const daily = searchParams.get('daily') === 'true'

    let query = supabase
      .from('games')
      .select('id,type,title,description,difficulty,category,points_on_complete,points_on_perfect')
      .eq('is_active', true)

    if (type) {
      query = query.eq('type', type)
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }

    if (daily) {
      query = query.eq('daily_challenge', true)
    }

    const { data, error } = await query.limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const limit = parseInt(searchParams.get('limit') ?? '50')
  const page = parseInt(searchParams.get('page') ?? '1')
  const offset = (page - 1) * limit

  const { data: users, error, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('points', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Add rank to users
  const rankedUsers = users?.map((user, index) => ({
    ...user,
    rank: offset + index + 1,
  })) ?? []

  return NextResponse.json({
    users: rankedUsers,
    pagination: {
      page,
      limit,
      total: count ?? 0,
      pages: Math.ceil((count ?? 0) / limit),
    },
  })
}

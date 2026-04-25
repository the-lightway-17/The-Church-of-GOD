import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET group members
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { data, error } = await supabase
      .from('group_members')
      .select(
        `
        id,
        user_id,
        role,
        joined_at,
        user:profiles(id, display_name, bio)
        `
      )
      .eq('group_id', id)
      .order('joined_at', { ascending: true })

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

// POST join group
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

    // Check if group exists
    const { data: group } = await supabase
      .from('groups')
      .select('id, is_private')
      .eq('id', id)
      .single()

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      )
    }

    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', id)
      .eq('user_id', user.id)
      .single()

    if (existingMember) {
      return NextResponse.json(
        { error: 'Already a member of this group' },
        { status: 400 }
      )
    }

    // Add user to group
    const { data, error } = await supabase
      .from('group_members')
      .insert({
        group_id: id,
        user_id: user.id,
        role: 'member',
        is_approved: !group.is_private,
      })
      .select()
      .single()

    if (error) {
      console.error('Member add error:', error)
      return NextResponse.json(
        { error: 'Failed to join group' },
        { status: 500 }
      )
    }

    // Update group member count
    await supabase
      .from('groups')
      .update({ member_count: supabase.sql`member_count + 1` })
      .eq('id', id)

    // Log activity
    await supabase.from('leaderboard_activities').insert({
      user_id: user.id,
      activity_type: 'group_joined',
      points: 1,
      group_id: id,
    })

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

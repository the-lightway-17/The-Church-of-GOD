import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET group details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { data, error } = await supabase
      .from('groups')
      .select(
        `
        id,
        name,
        description,
        icon_emoji,
        category,
        member_count,
        discussion_count,
        created_by,
        created_at,
        rules,
        creator:profiles!groups_created_by(id, display_name, bio),
        members:group_members(
          id,
          user_id,
          role,
          joined_at,
          user:profiles(id, display_name, bio)
        )
        `
      )
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Group not found' },
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

// PUT update group
export async function PUT(
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

    // Check if user is group admin/creator
    const { data: group } = await supabase
      .from('groups')
      .select('created_by')
      .eq('id', id)
      .single()

    if (!group || group.created_by !== user.id) {
      return NextResponse.json(
        { error: 'Only group creators can update the group' },
        { status: 403 }
      )
    }

    const { name, description, rules, icon_emoji } = await request.json()

    const { data, error } = await supabase
      .from('groups')
      .update({
        name: name?.trim(),
        description: description?.trim(),
        rules: rules?.trim(),
        icon_emoji,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update group' },
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

// DELETE group
export async function DELETE(
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

    // Check if user is group creator
    const { data: group } = await supabase
      .from('groups')
      .select('created_by')
      .eq('id', id)
      .single()

    if (!group || group.created_by !== user.id) {
      return NextResponse.json(
        { error: 'Only group creators can delete the group' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete group' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Group deleted successfully' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

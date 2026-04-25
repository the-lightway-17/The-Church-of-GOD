import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET all groups with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = request.nextUrl

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const sort = searchParams.get('sort') || 'popular'
    const offset = (page - 1) * limit

    let query = supabase
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
        cover_image_url,
        creator:profiles!groups_created_by(id, display_name)
        `,
        { count: 'exact' }
      )
      .eq('is_private', false)

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    switch (sort) {
      case 'recent':
        query = query.order('created_at', { ascending: false })
        break
      case 'members':
        query = query.order('member_count', { ascending: false })
        break
      case 'discussions':
        query = query.order('discussion_count', { ascending: false })
        break
      case 'popular':
      default:
        query = query.order('member_count', { ascending: false })
    }

    const { data, count, error } = await query.range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count,
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

// POST create new group
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

    // Check if user has display_name
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()

    if (!profile?.display_name) {
      return NextResponse.json(
        { error: 'Please complete your profile first' },
        { status: 403 }
      )
    }

    const { name, description, category, icon_emoji, is_private } = await request.json()

    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Group name is required' },
        { status: 400 }
      )
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Group description is required' },
        { status: 400 }
      )
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      )
    }

    // Create group
    const { data, error } = await supabase
      .from('groups')
      .insert({
        name: name.trim(),
        description: description.trim(),
        category,
        icon_emoji: icon_emoji || '📖',
        is_private: is_private || false,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Group creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create group' },
        { status: 500 }
      )
    }

    // Add creator as group member
    await supabase.from('group_members').insert({
      group_id: data.id,
      user_id: user.id,
      role: 'admin',
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

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { display_name, bio, avatar_url } = body

    if (!display_name || typeof display_name !== 'string' || display_name.trim().length === 0) {
      return NextResponse.json({ error: 'Display name is required' }, { status: 400 })
    }

    if (display_name.trim().length > 100) {
      return NextResponse.json(
        { error: 'Display name must be 100 characters or less' },
        { status: 400 }
      )
    }

    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: 'Bio must be 500 characters or less' },
        { status: 400 }
      )
    }

    // Update profile
    const { data, error } = await supabase
      .from('profiles')
      .update({
        display_name: display_name.trim(),
        bio: bio ? bio.trim() : null,
        avatar_url: avatar_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Profile update error:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

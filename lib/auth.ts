import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types/database'

export interface AuthSession {
  user: User & { name?: string; streakDays?: number }
  profile?: Profile
}

export async function auth(): Promise<AuthSession | null> {
  try {
    const supabase = await createClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return null
    }

    // Fetch user profile with error handling for missing table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    // If profiles table doesn't exist yet, still return the session
    if (error && error.code === 'PGRST116') {
      return {
        user: {
          ...session.user,
          name: null,
          streakDays: 0,
        },
      }
    }

    return {
      user: {
        ...session.user,
        name: profile?.display_name || null,
        streakDays: profile?.streak_days || 0,
      },
      profile,
    }
  } catch (error) {
    // If there's any error, just return null to show public landing
    console.error('[v0] Auth error:', error)
    return null
  }
}

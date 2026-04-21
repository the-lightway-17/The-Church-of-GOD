import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types/database'

export interface AuthSession {
  user: User & { name?: string; streakDays?: number }
  profile?: Profile
}

export async function auth(): Promise<AuthSession | null> {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return {
    user: {
      ...session.user,
      name: profile?.display_name || null,
      streakDays: profile?.streak_days || 0,
    },
    profile,
  }
}

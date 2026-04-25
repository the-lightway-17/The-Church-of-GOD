'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, AlertCircle } from 'lucide-react'

export default function OnboardingPage() {
  const { user, profile, refreshProfile } = useAuth()
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If user already has a profile with display_name, redirect to home
  if (profile?.display_name) {
    router.push('/')
    return null
  }

  // If no user, redirect to login
  if (!user) {
    router.push('/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!displayName.trim()) {
      setError('Display name is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/profile/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName.trim(),
          bio: bio.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to complete onboarding')
      }

      // Refresh profile to get updated data
      await refreshProfile()
      
      // Redirect to home
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary">
            <BookOpen className="size-8 text-primary-foreground" />
          </div>
          <CardTitle className="font-serif text-3xl">Welcome to Christ Mission</CardTitle>
          <CardDescription className="mt-2 text-base">
            Tell us how you&apos;d like to be called
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 flex gap-2">
                <AlertCircle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name *</label>
              <Input
                type="text"
                placeholder="Enter your preferred name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={loading}
                className="bg-muted/50"
              />
              <p className="text-xs text-muted-foreground">
                This is how others will see your name in the community
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio (Optional)</label>
              <textarea
                placeholder="Tell us a bit about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={loading}
                rows={3}
                className="w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !displayName.trim()}
            >
              {loading ? 'Setting up profile...' : 'Continue to Christ Mission'}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              You can update these details anytime in your profile settings
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

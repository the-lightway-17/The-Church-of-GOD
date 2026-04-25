'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function EditProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const router = useRouter()
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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
    setSuccess(false)

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName.trim(),
          bio: bio.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update profile')
      }

      await refreshProfile()
      setSuccess(true)
      
      setTimeout(() => {
        router.push('/profile')
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/profile">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-serif">Edit Profile</h1>
          <p className="text-muted-foreground">Update your profile information</p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="max-w-2xl">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 flex gap-2">
                <AlertCircle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-3">
                <p className="text-sm text-green-700 dark:text-green-400">
                  Profile updated successfully! Redirecting...
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name *</label>
              <Input
                type="text"
                placeholder="How you want to be called"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={loading}
                maxLength={100}
                required
              />
              <p className="text-xs text-muted-foreground">
                {displayName.length}/100 characters
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                placeholder="Tell the community about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={loading}
                rows={4}
                maxLength={500}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground">
                {bio.length}/500 characters
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-muted/50 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support if you need to update it.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading || !displayName.trim()}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Link href="/profile">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="mt-6 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Profile Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Use a clear display name that reflects your identity in the community</p>
          <p>• Keep your bio concise but informative - it helps others know your expertise</p>
          <p>• Share your areas of biblical interest to help others find kindred spirits</p>
          <p>• Your profile helps build trust and credibility in the community</p>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Bell, Lock, Eye, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)

  if (!user) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Please sign in to access settings.</p>
      </div>
    )
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      // In a real app, call an API to delete the account
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('[v0] Delete account error:', error)
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and privacy</p>
      </div>

      {/* Notification Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="size-5" />
            Notifications
          </CardTitle>
          <CardDescription>Control how you receive updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates about your activity</p>
            </div>
            <Button
              variant={emailNotifications ? 'default' : 'outline'}
              onClick={() => setEmailNotifications(!emailNotifications)}
            >
              {emailNotifications ? 'On' : 'Off'}
            </Button>
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Get notified on your device</p>
            </div>
            <Button
              variant={pushNotifications ? 'default' : 'outline'}
              onClick={() => setPushNotifications(!pushNotifications)}
            >
              {pushNotifications ? 'On' : 'Off'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="size-5" />
            Privacy
          </CardTitle>
          <CardDescription>Control your visibility and data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Public Profile</p>
              <p className="text-sm text-muted-foreground">Allow others to see your profile</p>
            </div>
            <Button variant="outline">Manage</Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="size-5" />
            Security
          </CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="size-4" />
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Account?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. All your data will be permanently deleted.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-4">
                <Button variant="outline">Cancel</Button>
                <Button
                  variant="destructive"
                  disabled={loading}
                  onClick={handleDeleteAccount}
                >
                  {loading ? 'Deleting...' : 'Delete Account'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}

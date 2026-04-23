'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NavigationTabs } from './navigation-tabs'
import type { AuthSession } from '@/lib/auth'

interface AuthenticatedLandingProps {
  session: AuthSession
}

export function AuthenticatedLanding({ session }: AuthenticatedLandingProps) {
  const [question, setQuestion] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim()) {
      router.push(`/questions/new?q=${encodeURIComponent(question)}`)
    }
  }

  const firstName = session.user.name?.split(' ')[0] || 'there'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl space-y-8">
        {/* Welcome Message */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-foreground">
            Welcome, {firstName}!
          </h1>
          <p className="text-xl text-muted-foreground">
            What question do you have in mind today?
          </p>
        </div>

        {/* Question Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex items-center">
            <Input
              type="text"
              placeholder="Ask about Scripture, theology, faith..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="pr-12 py-6 text-base"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="absolute right-2 hover:bg-accent/20"
              disabled={!question.trim()}
            >
              <Send className="size-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Or explore below to get started
          </p>
        </form>

        {/* Navigation Tabs */}
        <NavigationTabs />
      </div>
    </div>
  )
}

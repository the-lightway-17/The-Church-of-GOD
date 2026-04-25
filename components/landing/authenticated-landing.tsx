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
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-3xl space-y-12">
        {/* Welcome Message */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl sm:text-6xl font-bold font-serif text-foreground text-balance">
            Welcome, {firstName}!
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground text-pretty">
            What question do you have in mind today?
          </p>
        </div>

        {/* Question Input */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Ask about Scripture, theology, faith, Bible stories..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-lg border-2 bg-card px-5 py-4 text-lg shadow-sm transition-all hover:shadow-md focus:shadow-md focus:border-primary"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              disabled={!question.trim()}
            >
              <Send className="size-5" />
            </Button>
          </div>
        </form>

        {/* Navigation Tabs Section */}
        <div className="space-y-4">
          <NavigationTabs />
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { BookOpen, MessageCircleQuestion, Trophy, Users, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function UnauthenticatedLanding() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-serif text-2xl font-bold text-primary">
            <BookOpen className="size-6" />
            Scripture Connect
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4 inline-flex gap-2">
            <Sparkles className="size-3" />
            Join 10,000+ believers exploring Scripture
          </Badge>
          
          <h1 className="mb-6 text-balance font-serif text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Explore Scripture Together
          </h1>
          
          <p className="mb-8 text-pretty text-lg text-muted-foreground sm:text-xl md:text-2xl">
            Ask questions, discover answers, and grow in your faith with a vibrant community of believers.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                <BookOpen className="size-5" />
                Start Learning Free
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="gap-2">
                Explore Features
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="border-t px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-serif text-4xl font-bold">Everything You Need to Grow</h2>
            <p className="text-muted-foreground">Features designed to deepen your understanding of Scripture</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <MessageCircleQuestion className="mb-3 size-8 text-primary" />
                <CardTitle>Ask & Answer</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get thoughtful answers to your Scripture questions from the community
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Trophy className="mb-3 size-8 text-accent" />
                <CardTitle>Earn Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Gain points and badges as you contribute and grow in knowledge
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="mb-3 size-8 text-primary" />
                <CardTitle>Join Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with like-minded believers in focused study groups
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Sparkles className="mb-3 size-8 text-accent" />
                <CardTitle>Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monitor your learning journey and celebrate milestones
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-primary/5 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 font-serif text-4xl font-bold">Ready to Start Learning?</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join our community today and begin your journey of discovery.
          </p>
          <Link href="/login">
            <Button size="lg" className="gap-2">
              <BookOpen className="size-5" />
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Scripture Connect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

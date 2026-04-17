import Link from 'next/link'
import {
  BookOpen,
  MessageCircleQuestion,
  Users,
  Trophy,
  Award,
  Flame,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DailyVerseCard } from '@/components/daily/daily-verse-card'
import { TrendingQuestions } from '@/components/questions/trending-questions'
import { TopContributors } from '@/components/gamification/top-contributors'
import { auth } from '@/lib/auth'

export default async function HomePage() {
  const session = await auth()

  return (
    <div className="container px-4 py-8">
      {/* Hero Section */}
      {!session ? (
        <section className="mb-12 text-center">
          <div className="mx-auto max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="mr-1 size-3" />
              Join 10,000+ believers
            </Badge>
            <h1 className="mb-4 text-balance font-serif text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Explore Scripture Together
            </h1>
            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
              Ask questions, share insights, and grow in your faith with a community of believers.
              Earn badges, climb the leaderboard, and deepen your understanding of the Bible.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  <BookOpen className="size-5" />
                  Get Started Free
                </Button>
              </Link>
              <Link href="/questions">
                <Button size="lg" variant="outline" className="gap-2">
                  Browse Questions
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="mb-8">
          <h1 className="mb-2 font-serif text-2xl font-bold md:text-3xl">
            Welcome back, {session.user.name?.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            {session.user.streakDays && session.user.streakDays > 1 ? (
              <span className="flex items-center gap-1">
                <Flame className="size-4 text-orange-500" />
                You&apos;re on a {session.user.streakDays}-day streak! Keep it going!
              </span>
            ) : (
              "Ready to explore Scripture today?"
            )}
          </p>
        </section>
      )}

      {/* Features Grid (for non-authenticated users) */}
      {!session && (
        <section className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <MessageCircleQuestion className="mb-2 size-8 text-primary" />
              <CardTitle className="text-lg">Ask & Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get thoughtful answers to your Bible questions from the community
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Trophy className="mb-2 size-8 text-accent" />
              <CardTitle className="text-lg">Earn Points</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gain points for your contributions and climb the leaderboard
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Award className="mb-2 size-8 text-primary" />
              <CardTitle className="text-lg">Collect Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Unlock achievements as you participate and grow in your journey
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="mb-2 size-8 text-accent" />
              <CardTitle className="text-lg">Join Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect with like-minded believers in focused study groups
              </CardDescription>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Questions Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Verse */}
          <DailyVerseCard />

          {/* Quick Actions (for authenticated users) */}
          {session && (
            <Card>
              <CardContent className="flex flex-wrap gap-3 py-4">
                <Link href="/questions/new">
                  <Button className="gap-2">
                    <MessageCircleQuestion className="size-4" />
                    Ask a Question
                  </Button>
                </Link>
                <Link href="/groups">
                  <Button variant="outline" className="gap-2">
                    <Users className="size-4" />
                    Explore Groups
                  </Button>
                </Link>
                <Link href="/polls/new">
                  <Button variant="outline" className="gap-2">
                    <TrendingUp className="size-4" />
                    Create Poll
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Trending Questions */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-serif text-xl font-semibold">
                <TrendingUp className="size-5 text-primary" />
                Trending Questions
              </h2>
              <Link href="/questions">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
            <TrendingQuestions />
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Top Contributors */}
          <TopContributors />

          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="size-5 text-accent" />
                Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Questions</span>
                <span className="font-semibold">2,847</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Answers Given</span>
                <span className="font-semibold">8,392</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Active Groups</span>
                <span className="font-semibold">124</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Members</span>
                <span className="font-semibold">10,482</span>
              </div>
            </CardContent>
          </Card>

          {/* Popular Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  'Genesis',
                  'Salvation',
                  'Prayer',
                  'Faith',
                  'Jesus',
                  'Holy Spirit',
                  'Prophecy',
                  'Wisdom',
                  'Love',
                  'Grace',
                ].map((tag) => (
                  <Link key={tag} href={`/questions?tag=${tag.toLowerCase()}`}>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

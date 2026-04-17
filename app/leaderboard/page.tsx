import Link from 'next/link'
import { Trophy, Medal, Crown, Flame, TrendingUp, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'Leaderboard',
  description: 'See who is leading in our Bible study community',
}

// Sample data - in production, this would come from the database
const LEADERBOARD_DATA = [
  {
    id: '1',
    rank: 1,
    name: 'Pastor James',
    image: null,
    points: 12450,
    level: 15,
    streakDays: 45,
    questionsAsked: 23,
    answersGiven: 156,
    acceptedAnswers: 48,
    badges: 12,
  },
  {
    id: '2',
    rank: 2,
    name: 'Maria G.',
    image: null,
    points: 9820,
    level: 12,
    streakDays: 30,
    questionsAsked: 45,
    answersGiven: 89,
    acceptedAnswers: 22,
    badges: 9,
  },
  {
    id: '3',
    rank: 3,
    name: 'Thomas W.',
    image: null,
    points: 8340,
    level: 11,
    streakDays: 22,
    questionsAsked: 12,
    answersGiven: 134,
    acceptedAnswers: 35,
    badges: 8,
  },
  {
    id: '4',
    rank: 4,
    name: 'Rachel K.',
    image: null,
    points: 7150,
    level: 10,
    streakDays: 15,
    questionsAsked: 67,
    answersGiven: 45,
    acceptedAnswers: 12,
    badges: 7,
  },
  {
    id: '5',
    rank: 5,
    name: 'Samuel P.',
    image: null,
    points: 6280,
    level: 9,
    streakDays: 8,
    questionsAsked: 34,
    answersGiven: 78,
    acceptedAnswers: 19,
    badges: 6,
  },
  {
    id: '6',
    rank: 6,
    name: 'Hannah M.',
    image: null,
    points: 5420,
    level: 8,
    streakDays: 12,
    questionsAsked: 28,
    answersGiven: 56,
    acceptedAnswers: 14,
    badges: 5,
  },
  {
    id: '7',
    rank: 7,
    name: 'Daniel R.',
    image: null,
    points: 4890,
    level: 7,
    streakDays: 5,
    questionsAsked: 19,
    answersGiven: 67,
    acceptedAnswers: 11,
    badges: 5,
  },
  {
    id: '8',
    rank: 8,
    name: 'Grace L.',
    image: null,
    points: 4210,
    level: 7,
    streakDays: 18,
    questionsAsked: 42,
    answersGiven: 34,
    acceptedAnswers: 8,
    badges: 4,
  },
  {
    id: '9',
    rank: 9,
    name: 'Joshua T.',
    image: null,
    points: 3780,
    level: 6,
    streakDays: 3,
    questionsAsked: 15,
    answersGiven: 52,
    acceptedAnswers: 9,
    badges: 4,
  },
  {
    id: '10',
    rank: 10,
    name: 'Ruth S.',
    image: null,
    points: 3450,
    level: 6,
    streakDays: 7,
    questionsAsked: 31,
    answersGiven: 28,
    acceptedAnswers: 6,
    badges: 3,
  },
]

const RANK_STYLES = [
  { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  { icon: Medal, color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/30' },
  { icon: Medal, color: 'text-amber-600', bg: 'bg-amber-600/10', border: 'border-amber-600/30' },
]

function getRankStyle(rank: number) {
  if (rank <= 3) return RANK_STYLES[rank - 1]
  return null
}

export default function LeaderboardPage() {
  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">
          See who is leading in our community and how you compare
        </p>
      </div>

      {/* Top 3 Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {LEADERBOARD_DATA.slice(0, 3).map((user, index) => {
          const style = getRankStyle(user.rank)
          const Icon = style?.icon ?? Trophy

          return (
            <Card
              key={user.id}
              className={cn(
                'relative overflow-hidden',
                index === 0 && 'md:order-2 md:-mt-4',
                index === 1 && 'md:order-1',
                index === 2 && 'md:order-3',
                style?.border
              )}
            >
              {/* Rank Badge */}
              <div
                className={cn(
                  'absolute right-4 top-4 flex size-10 items-center justify-center rounded-full',
                  style?.bg
                )}
              >
                <Icon className={cn('size-6', style?.color)} />
              </div>

              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <Avatar className={cn('size-20', index === 0 && 'size-24')}>
                      <AvatarImage src={user.image ?? ''} />
                      <AvatarFallback className="text-2xl">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        'absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground',
                        index === 0 && 'size-10 text-base'
                      )}
                    >
                      {user.level}
                    </span>
                  </div>

                  <h3 className="mb-1 font-semibold">{user.name}</h3>

                  <div className={cn('mb-3 text-2xl font-bold', style?.color)}>
                    {user.points.toLocaleString()}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">pts</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Flame className="size-4 text-orange-500" />
                      {user.streakDays}
                    </div>
                    <div>{user.badges} badges</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="all-time" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all-time">All Time</TabsTrigger>
          <TabsTrigger value="this-week">This Week</TabsTrigger>
          <TabsTrigger value="this-month">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="all-time" className="space-y-4">
          {/* Stats Overview */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Your Rank</CardDescription>
                <CardTitle className="text-3xl">#47</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-sm text-success">
                  <TrendingUp className="size-4" />
                  <span>Up 3 this week</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Your Points</CardDescription>
                <CardTitle className="text-3xl">1,250</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Level 5</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Points to Next Rank</CardDescription>
                <CardTitle className="text-3xl">180</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={75} className="h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Your Streak</CardDescription>
                <CardTitle className="flex items-center gap-2 text-3xl">
                  <Flame className="size-8 text-orange-500" />7
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="size-4" />
                  days in a row
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Full Leaderboard Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
              <CardDescription>Ranked by total points earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {LEADERBOARD_DATA.map((user) => {
                  const style = getRankStyle(user.rank)

                  return (
                    <Link key={user.id} href={`/users/${user.id}`}>
                      <div
                        className={cn(
                          'flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50',
                          user.rank <= 3 && style?.bg
                        )}
                      >
                        {/* Rank */}
                        <div
                          className={cn(
                            'flex size-10 items-center justify-center rounded-full font-bold',
                            user.rank <= 3 ? style?.color : 'text-muted-foreground'
                          )}
                        >
                          {user.rank <= 3 ? (
                            style?.icon && <style.icon className="size-6" />
                          ) : (
                            <span>#{user.rank}</span>
                          )}
                        </div>

                        {/* Avatar */}
                        <div className="relative">
                          <Avatar className="size-12">
                            <AvatarImage src={user.image ?? ''} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {user.level}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.name}</span>
                            {user.streakDays >= 7 && (
                              <Badge variant="secondary" className="gap-1 text-xs">
                                <Flame className="size-3 text-orange-500" />
                                {user.streakDays}
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{user.questionsAsked} questions</span>
                            <span>{user.answersGiven} answers</span>
                            <span>{user.badges} badges</span>
                          </div>
                        </div>

                        {/* Points */}
                        <div className="text-right">
                          <div className={cn('text-lg font-bold', user.rank <= 3 && style?.color)}>
                            {user.points.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              <div className="mt-6 text-center">
                <Button variant="outline">Load More</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="this-week">
          <Card className="py-12 text-center">
            <CardContent>
              <p className="text-muted-foreground">Weekly leaderboard resets every Monday</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="this-month">
          <Card className="py-12 text-center">
            <CardContent>
              <p className="text-muted-foreground">Monthly leaderboard resets on the 1st</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

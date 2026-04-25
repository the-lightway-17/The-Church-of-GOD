'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trophy, Medal, Flame, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Loader } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LeaderboardEntry {
  user_id: string
  rank: number
  total_points: number
  questions_asked: number
  answers_provided: number
  answers_accepted: number
  comments_made: number
  discussions_started: number
  user: {
    id: string
    display_name: string
  }
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />
    case 3:
      return <Medal className="h-5 w-5 text-orange-600" />
    default:
      return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
  }
}

function getStreakColor(streak: number) {
  if (streak >= 30) return 'bg-red-500'
  if (streak >= 15) return 'bg-orange-500'
  if (streak >= 7) return 'bg-yellow-500'
  return 'bg-blue-500'
}

function LeaderboardRow({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  const rank = index + 1
  const level = Math.floor(entry.total_points / 1000) + 1

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors border border-transparent hover:border-border">
      <div className="flex items-center justify-center w-8">
        {getRankIcon(rank)}
      </div>

      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarFallback className="bg-primary/20 text-xs font-bold">
          {entry.user?.display_name?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <Link
          href={`/profile/${entry.user_id}`}
          className="font-medium text-foreground hover:text-primary transition-colors truncate"
        >
          {entry.user?.display_name || 'Anonymous'}
        </Link>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="text-xs">
            Level {level}
          </Badge>
          <span className="flex items-center gap-1">
            <Flame className="h-3 w-3" />
            {entry.answers_accepted} accepted
          </span>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <div className="font-bold text-lg text-primary">
          {entry.total_points.toLocaleString()}
        </div>
        <div className="text-xs text-muted-foreground">
          {entry.answers_provided} answers
        </div>
      </div>
    </div>
  )
}

export function LeaderboardClient() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all-time')

  useEffect(() => {
    fetchLeaderboard()
  }, [activeTab])

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: '100',
        timeframe: activeTab === 'all-time' ? 'all' : activeTab,
      })
      const response = await fetch(`/api/leaderboard?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEntries(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const topThree = entries.slice(0, 3)
  const restOfLeaderboard = entries.slice(3)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Community Leaderboard
          </h1>
          <p className="text-muted-foreground">
            Celebrating our most active and knowledgeable community members
          </p>
        </div>

        {/* Top 3 Podium */}
        {!loading && topThree.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {topThree.map((entry, index) => {
              const rank = index + 1
              const level = Math.floor(entry.total_points / 1000) + 1
              const heights = ['md:h-40', 'md:h-48', 'md:h-44']

              return (
                <Card
                  key={entry.user_id}
                  className={cn(
                    'relative overflow-hidden',
                    rank === 1 && 'ring-2 ring-yellow-500/50',
                    rank === 2 && 'ring-2 ring-gray-400/50',
                    rank === 3 && 'ring-2 ring-orange-600/50',
                    heights[index]
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
                  <CardHeader className="relative text-center">
                    <div className="mb-4">
                      {getRankIcon(rank)}
                    </div>
                    <Avatar className="h-16 w-16 mx-auto mb-3">
                      <AvatarFallback className="bg-primary/20 text-lg font-bold">
                        {entry.user?.display_name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg">
                      {entry.user?.display_name || 'Anonymous'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative text-center space-y-2">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {entry.total_points.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                    <Badge variant="secondary">Level {level}</Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Leaderboard Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Full Rankings
              </CardTitle>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="grid grid-cols-3 w-auto">
                  <TabsTrigger value="all-time" className="text-xs">
                    All Time
                  </TabsTrigger>
                  <TabsTrigger value="month" className="text-xs">
                    Month
                  </TabsTrigger>
                  <TabsTrigger value="week" className="text-xs">
                    Week
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : entries.length > 0 ? (
              <div className="space-y-2">
                {entries.map((entry, index) => (
                  <LeaderboardRow key={entry.user_id} entry={entry} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No leaderboard data available yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        {entries.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Community Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {entries.length.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {entries.reduce((sum, e) => sum + e.questions_asked, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Questions Asked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {entries.reduce((sum, e) => sum + e.answers_provided, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Answers Given</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {entries.reduce((sum, e) => sum + e.total_points, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

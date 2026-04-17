import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Award,
  MessageCircleQuestion,
  MessageCircle,
  Flame,
  Calendar,
  Users,
  UserPlus,
  Check,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getLevelProgress } from '@/lib/constants/points'
import { BADGE_DEFINITIONS, BADGE_TIER_STYLES } from '@/lib/constants/badges'

// Sample user data - in production, this would come from the database
const SAMPLE_USERS: Record<string, {
  id: string
  name: string
  image: string | null
  bio: string
  points: number
  level: number
  streakDays: number
  questionsAsked: number
  answersGiven: number
  acceptedAnswers: number
  followers: number
  following: number
  groups: number
  badges: string[]
  joinedAt: Date
}> = {
  '1': {
    id: '1',
    name: 'Pastor James',
    image: null,
    bio: 'Senior Pastor with 20+ years of ministry experience. Love teaching and mentoring.',
    points: 12450,
    level: 15,
    streakDays: 45,
    questionsAsked: 23,
    answersGiven: 156,
    acceptedAnswers: 48,
    followers: 234,
    following: 45,
    groups: 8,
    badges: ['First Steps', 'Helping Hand', 'Scholar', 'Theologian', 'Devoted', 'Elder'],
    joinedAt: new Date('2023-06-15'),
  },
  '2': {
    id: '2',
    name: 'Maria G.',
    image: null,
    bio: 'Bible study enthusiast and small group leader. Always learning!',
    points: 9820,
    level: 12,
    streakDays: 30,
    questionsAsked: 45,
    answersGiven: 89,
    acceptedAnswers: 22,
    followers: 156,
    following: 78,
    groups: 5,
    badges: ['First Steps', 'Helping Hand', 'Curious Mind', 'Dedicated'],
    joinedAt: new Date('2023-09-01'),
  },
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = SAMPLE_USERS[id]
  if (!user) return { title: 'User Not Found' }
  return {
    title: user.name,
    description: user.bio,
  }
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = SAMPLE_USERS[id]

  if (!user) {
    notFound()
  }

  const levelProgress = getLevelProgress(user.points)

  return (
    <div className="container px-4 py-8">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="size-24 sm:size-32">
                <AvatarImage src={user.image ?? ''} />
                <AvatarFallback className="text-3xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-2 -right-2 flex size-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground sm:size-12 sm:text-xl">
                {user.level}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="mb-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <h1 className="font-serif text-2xl font-bold sm:text-3xl">{user.name}</h1>
                {user.streakDays >= 7 && (
                  <Badge variant="secondary" className="gap-1">
                    <Flame className="size-3 text-orange-500" />
                    {user.streakDays} day streak
                  </Badge>
                )}
              </div>

              <p className="mb-4 text-muted-foreground">{user.bio}</p>

              <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
                <div className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  Member since {formatDate(user.joinedAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="size-4" />
                  {user.followers} followers
                </div>
                <div>{user.following} following</div>
              </div>

              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                <Button className="gap-2">
                  <UserPlus className="size-4" />
                  Follow
                </Button>
                <Button variant="outline">Message</Button>
              </div>
            </div>

            {/* Points Card */}
            <Card className="w-full bg-primary/5 sm:w-auto sm:min-w-48">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {user.points.toLocaleString()}
                  </div>
                  <div className="mb-2 text-sm text-muted-foreground">Total Points</div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span>Level {user.level}</span>
                    <span>Level {user.level + 1}</span>
                  </div>
                  <Progress value={levelProgress.percentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <MessageCircleQuestion className="size-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{user.questionsAsked}</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <MessageCircle className="size-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{user.answersGiven}</div>
              <div className="text-sm text-muted-foreground">Answers</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Check className="size-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{user.acceptedAnswers}</div>
              <div className="text-sm text-muted-foreground">Accepted</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Award className="size-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{user.badges.length}</div>
              <div className="text-sm text-muted-foreground">Badges</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="badges" className="space-y-6">
        <TabsList>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="answers">Answers</TabsTrigger>
        </TabsList>

        <TabsContent value="badges">
          <Card>
            <CardHeader>
              <CardTitle>Badges Earned</CardTitle>
              <CardDescription>
                {user.name} has earned {user.badges.length} badges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {user.badges.map((badgeName) => {
                  const badge = BADGE_DEFINITIONS.find((b) => b.name === badgeName)
                  if (!badge) return null
                  const style = BADGE_TIER_STYLES[badge.tier]

                  return (
                    <div
                      key={badgeName}
                      className={`flex items-center gap-3 rounded-lg border p-4 ${style.border} ${style.bg}`}
                    >
                      <div className={`flex size-12 items-center justify-center rounded-full ${style.bg}`}>
                        <Award className={`size-6 ${style.icon}`} />
                      </div>
                      <div>
                        <div className="font-medium">{badge.name}</div>
                        <div className="text-sm text-muted-foreground">{badge.description}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card className="py-12 text-center">
            <CardContent>
              <MessageCircleQuestion className="mx-auto mb-4 size-12 text-muted-foreground" />
              <p className="text-muted-foreground">Questions by {user.name} will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="answers">
          <Card className="py-12 text-center">
            <CardContent>
              <MessageCircle className="mx-auto mb-4 size-12 text-muted-foreground" />
              <p className="text-muted-foreground">Answers by {user.name} will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

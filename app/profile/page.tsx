import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Settings,
  Award,
  MessageCircleQuestion,
  MessageCircle,
  Flame,
  Calendar,
  Users,
  Bookmark,
  TrendingUp,
} from 'lucide-react'
import { auth } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getLevelProgress } from '@/lib/constants/points'
import { BADGE_DEFINITIONS, BADGE_TIER_STYLES } from '@/lib/constants/badges'

export const metadata = {
  title: 'My Profile',
  description: 'View and manage your profile',
}



const SAMPLE_ACTIVITY = [
  {
    type: 'answer',
    title: 'Answered: What does it mean to be "born again"?',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2),
    points: 10,
  },
  {
    type: 'question',
    title: 'Asked: How should we interpret parables?',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    points: 5,
  },
  {
    type: 'badge',
    title: 'Earned: Faithful badge',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48),
    points: 15,
  },
  {
    type: 'accepted',
    title: 'Answer accepted: Understanding grace in Romans',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72),
    points: 25,
  },
]

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export default async function ProfilePage() {
  const session = await auth()

  if (!session || !session.profile) {
    redirect('/login?callbackUrl=/profile')
  }

  const user = {
    id: session.user.id,
    name: session.profile.display_name || 'User',
    email: session.user.email,
    image: session.profile.avatar_url,
    bio: session.profile.bio || 'No bio yet. Add one in your profile settings.',
    points: session.profile.total_points || 0,
    level: session.profile.level || 1,
    streakDays: session.profile.streak_days || 0,
    questionsAsked: session.profile.questions_count || 0,
    answersGiven: session.profile.answers_count || 0,
    acceptedAnswers: session.profile.helpful_count || 0,
    followers: 0,
    following: 0,
    groups: session.profile.groups_joined || 0,
    savedQuestions: 0,
    badges: session.profile.badges || [],
    joinedAt: session.profile.created_at ? new Date(session.profile.created_at) : new Date(),
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
                  Joined {formatDate(user.joinedAt)}
                </div>
                <Link href="/profile/followers" className="flex items-center gap-1 hover:text-foreground">
                  <Users className="size-4" />
                  {user.followers} followers
                </Link>
                <Link href="/profile/following" className="flex items-center gap-1 hover:text-foreground">
                  {user.following} following
                </Link>
              </div>

              <Link href="/profile/edit">
                <Button variant="outline" className="gap-2">
                  <Settings className="size-4" />
                  Edit Profile
                </Button>
              </Link>
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
                  <div className="mt-1 text-xs text-muted-foreground">
                    {levelProgress.current} / {levelProgress.max} to next level
                  </div>
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
              <div className="text-sm text-muted-foreground">Questions Asked</div>
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
              <div className="text-sm text-muted-foreground">Answers Given</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Award className="size-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{user.badges.length}</div>
              <div className="text-sm text-muted-foreground">Badges Earned</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Bookmark className="size-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{user.savedQuestions}</div>
              <div className="text-sm text-muted-foreground">Saved Questions</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="answers">Answers</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest contributions and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SAMPLE_ACTIVITY.map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg p-3 hover:bg-muted/50">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                      {activity.type === 'answer' && <MessageCircle className="size-5 text-primary" />}
                      {activity.type === 'question' && <MessageCircleQuestion className="size-5 text-primary" />}
                      {activity.type === 'badge' && <Award className="size-5 text-primary" />}
                      {activity.type === 'accepted' && <TrendingUp className="size-5 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{formatTimeAgo(activity.date)}</p>
                    </div>
                    <Badge variant="secondary" className="text-primary">
                      +{activity.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card className="py-12 text-center">
            <CardContent>
              <MessageCircleQuestion className="mx-auto mb-4 size-12 text-muted-foreground" />
              <p className="text-muted-foreground">Your questions will appear here</p>
              <Link href="/questions/new">
                <Button className="mt-4">Ask a Question</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="answers">
          <Card className="py-12 text-center">
            <CardContent>
              <MessageCircle className="mx-auto mb-4 size-12 text-muted-foreground" />
              <p className="text-muted-foreground">Your answers will appear here</p>
              <Link href="/questions">
                <Button className="mt-4">Browse Questions</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges">
          <Card>
            <CardHeader>
              <CardTitle>Earned Badges</CardTitle>
              <CardDescription>
                You&apos;ve earned {user.badges.length} of {BADGE_DEFINITIONS.length} badges
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
              <div className="mt-6 text-center">
                <Link href="/badges">
                  <Button variant="outline">View All Badges</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved">
          <Card className="py-12 text-center">
            <CardContent>
              <Bookmark className="mx-auto mb-4 size-12 text-muted-foreground" />
              <p className="text-muted-foreground">Your saved questions will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

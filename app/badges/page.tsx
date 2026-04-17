import {
  Award,
  MessageCircleQuestion,
  HelpCircle,
  GraduationCap,
  BookOpen,
  Crown,
  Flame,
  Users,
  UserPlus,
  Star,
  Check,
  Lock,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { BADGE_DEFINITIONS, BADGE_TIER_STYLES } from '@/lib/constants/badges'

export const metadata = {
  title: 'Badges',
  description: 'View all available badges and your achievements',
}

const ICON_MAP: Record<string, React.ElementType> = {
  'message-circle-question': MessageCircleQuestion,
  'hand-helping': HelpCircle,
  'brain': Award,
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  'crown': Crown,
  'flame': Flame,
  'users': Users,
  'user-plus': UserPlus,
  'star': Star,
}

// Sample user badge progress - in production, this would come from the database
const USER_BADGE_PROGRESS = {
  questions_asked: 3,
  answers_posted: 8,
  accepted_answers: 2,
  streak_days: 7,
  groups_joined: 2,
  groups_created: 0,
  followers: 5,
  level_reached: 5,
}

const USER_EARNED_BADGES = ['First Steps', 'Helping Hand', 'Faithful']

export default function BadgesPage() {
  const participationBadges = BADGE_DEFINITIONS.filter((b) =>
    ['questions_asked', 'answers_posted', 'accepted_answers', 'level_reached'].includes(
      b.requirement.type
    )
  )
  const streakBadges = BADGE_DEFINITIONS.filter((b) => b.requirement.type === 'streak_days')
  const communityBadges = BADGE_DEFINITIONS.filter((b) =>
    ['groups_joined', 'groups_created', 'followers'].includes(b.requirement.type)
  )

  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold">Badges</h1>
        <p className="text-muted-foreground">
          Earn badges by participating in the community and reaching milestones
        </p>
      </div>

      {/* User Progress Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="size-5 text-primary" />
            Your Progress
          </CardTitle>
          <CardDescription>
            You&apos;ve earned {USER_EARNED_BADGES.length} of {BADGE_DEFINITIONS.length} badges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress
            value={(USER_EARNED_BADGES.length / BADGE_DEFINITIONS.length) * 100}
            className="h-3"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {USER_EARNED_BADGES.map((badgeName) => {
              const badge = BADGE_DEFINITIONS.find((b) => b.name === badgeName)
              if (!badge) return null
              const style = BADGE_TIER_STYLES[badge.tier]
              const Icon = ICON_MAP[badge.icon] ?? Award

              return (
                <Badge key={badgeName} className={cn('gap-1', style.bg, style.text)}>
                  <Icon className={cn('size-3', style.icon)} />
                  {badgeName}
                </Badge>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Badges</TabsTrigger>
          <TabsTrigger value="participation">Participation</TabsTrigger>
          <TabsTrigger value="streaks">Streaks</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          <BadgeSection
            title="Participation Badges"
            description="Earn these by asking questions and giving answers"
            badges={participationBadges}
            userProgress={USER_BADGE_PROGRESS}
            earnedBadges={USER_EARNED_BADGES}
          />
          <BadgeSection
            title="Streak Badges"
            description="Maintain your daily study streak"
            badges={streakBadges}
            userProgress={USER_BADGE_PROGRESS}
            earnedBadges={USER_EARNED_BADGES}
          />
          <BadgeSection
            title="Community Badges"
            description="Engage with the community and build connections"
            badges={communityBadges}
            userProgress={USER_BADGE_PROGRESS}
            earnedBadges={USER_EARNED_BADGES}
          />
        </TabsContent>

        <TabsContent value="participation">
          <BadgeSection
            title="Participation Badges"
            description="Earn these by asking questions and giving answers"
            badges={participationBadges}
            userProgress={USER_BADGE_PROGRESS}
            earnedBadges={USER_EARNED_BADGES}
          />
        </TabsContent>

        <TabsContent value="streaks">
          <BadgeSection
            title="Streak Badges"
            description="Maintain your daily study streak"
            badges={streakBadges}
            userProgress={USER_BADGE_PROGRESS}
            earnedBadges={USER_EARNED_BADGES}
          />
        </TabsContent>

        <TabsContent value="community">
          <BadgeSection
            title="Community Badges"
            description="Engage with the community and build connections"
            badges={communityBadges}
            userProgress={USER_BADGE_PROGRESS}
            earnedBadges={USER_EARNED_BADGES}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BadgeSection({
  title,
  description,
  badges,
  userProgress,
  earnedBadges,
}: {
  title: string
  description: string
  badges: typeof BADGE_DEFINITIONS
  userProgress: Record<string, number>
  earnedBadges: string[]
}) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="font-serif text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map((badge) => {
          const isEarned = earnedBadges.includes(badge.name)
          const progress = userProgress[badge.requirement.type] ?? 0
          const progressPercent = Math.min((progress / badge.requirement.threshold) * 100, 100)
          const style = BADGE_TIER_STYLES[badge.tier]
          const Icon = ICON_MAP[badge.icon] ?? Award

          return (
            <Card
              key={badge.name}
              className={cn(
                'relative overflow-hidden transition-all',
                isEarned ? style.border : 'opacity-75 hover:opacity-100'
              )}
            >
              {isEarned && (
                <div className="absolute right-2 top-2">
                  <div className="flex size-6 items-center justify-center rounded-full bg-success text-success-foreground">
                    <Check className="size-4" />
                  </div>
                </div>
              )}
              {!isEarned && (
                <div className="absolute right-2 top-2 text-muted-foreground/50">
                  <Lock className="size-4" />
                </div>
              )}

              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'flex size-14 shrink-0 items-center justify-center rounded-xl border',
                      isEarned ? cn(style.bg, style.border) : 'border-border bg-muted'
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-7',
                        isEarned ? style.icon : 'text-muted-foreground'
                      )}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{badge.name}</h3>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px] capitalize',
                          isEarned && cn(style.bg, style.text)
                        )}
                      >
                        {badge.tier}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{badge.description}</p>

                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {progress} / {badge.requirement.threshold}
                        </span>
                        <span className="font-medium text-primary">
                          +{badge.pointsAwarded} pts
                        </span>
                      </div>
                      <Progress
                        value={progressPercent}
                        className={cn(
                          'h-2',
                          isEarned && '[&>div]:bg-success'
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

import Link from 'next/link'
import { Trophy, Medal, Flame } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Sample data - in production, this would come from the database
const TOP_USERS = [
  {
    id: '1',
    name: 'Pastor James',
    image: null,
    points: 12450,
    level: 15,
    streakDays: 45,
  },
  {
    id: '2',
    name: 'Maria G.',
    image: null,
    points: 9820,
    level: 12,
    streakDays: 30,
  },
  {
    id: '3',
    name: 'Thomas W.',
    image: null,
    points: 8340,
    level: 11,
    streakDays: 22,
  },
  {
    id: '4',
    name: 'Rachel K.',
    image: null,
    points: 7150,
    level: 10,
    streakDays: 15,
  },
  {
    id: '5',
    name: 'Samuel P.',
    image: null,
    points: 6280,
    level: 9,
    streakDays: 8,
  },
]

const RANK_STYLES = [
  { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { icon: Medal, color: 'text-slate-400', bg: 'bg-slate-400/10' },
  { icon: Medal, color: 'text-amber-600', bg: 'bg-amber-600/10' },
]

export function TopContributors() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="size-5 text-accent" />
            Top Contributors
          </CardTitle>
          <Link href="/leaderboard">
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {TOP_USERS.map((user, index) => {
          const rankStyle = RANK_STYLES[index]
          const RankIcon = rankStyle?.icon

          return (
            <Link key={user.id} href={`/users/${user.id}`}>
              <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
                {/* Rank */}
                <div
                  className={cn(
                    'flex size-8 items-center justify-center rounded-full text-sm font-bold',
                    rankStyle?.bg ?? 'bg-muted',
                    rankStyle?.color ?? 'text-muted-foreground'
                  )}
                >
                  {RankIcon ? (
                    <RankIcon className="size-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="relative">
                  <Avatar className="size-10">
                    <AvatarImage src={user.image ?? ''} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {user.level}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.points.toLocaleString()} pts
                  </p>
                </div>

                {/* Streak */}
                {user.streakDays > 0 && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Flame className="size-4 text-orange-500" />
                    <span>{user.streakDays}</span>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}

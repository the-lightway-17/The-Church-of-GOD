'use client'

import Link from 'next/link'
import {
  MessageCircleQuestion,
  Users,
  Trophy,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const tabs = [
  {
    label: 'Questions',
    href: '/questions',
    icon: MessageCircleQuestion,
    description: 'Browse all questions and answers',
  },
  {
    label: 'Groups',
    href: '/groups',
    icon: Users,
    description: 'Join study groups and communities',
  },
  {
    label: 'Leaderboard',
    href: '/leaderboard',
    icon: Trophy,
    description: 'See top contributors and rankings',
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
    description: 'View your profile and achievements',
  },
]

export function NavigationTabs() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {tabs.map(({ label, href, icon: Icon, description }) => (
        <Link key={href} href={href}>
          <Button
            variant="outline"
            className="w-full h-auto flex flex-col items-center justify-center py-6 px-3 hover:bg-accent/10 hover:border-primary transition-colors"
          >
            <Icon className="size-6 mb-2 text-primary" />
            <span className="font-semibold text-sm md:text-base">{label}</span>
            <span className="text-xs text-muted-foreground text-center mt-1 hidden md:block">
              {description}
            </span>
          </Button>
        </Link>
      ))}
    </div>
  )
}

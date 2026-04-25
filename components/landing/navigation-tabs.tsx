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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tabs.map(({ label, href, icon: Icon, description }, index) => (
        <Link key={href} href={href} className="group">
          <div 
            className="relative h-full rounded-lg border bg-card p-4 transition-all duration-200 hover:shadow-lg cursor-pointer"
            style={{
              borderColor: 'var(--daily-secondary)',
              backgroundColor: `color-mix(in srgb, var(--daily-primary) ${5 + index * 2}%, var(--card))`,
            }}
          >
            <div className="flex h-full flex-col items-center justify-center text-center space-y-3">
              <div 
                className="rounded-lg p-3 transition-colors group-hover:scale-110"
                style={{
                  backgroundColor: `color-mix(in srgb, var(--daily-accent) 20%, transparent)`,
                }}
              >
                <Icon className="size-6" style={{ color: 'var(--daily-primary)' }} />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-base" style={{ color: 'var(--daily-dark)' }}>
                  {label}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import {
  Home,
  MessageCircleQuestion,
  Users,
  BarChart3,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/questions', label: 'Questions', icon: MessageCircleQuestion },
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/leaderboard', label: 'Rank', icon: BarChart3 },
  { href: '/profile', label: 'Profile', icon: User, requiresAuth: true },
]

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          if (item.requiresAuth && !user) return null
          
          const Icon = item.icon
          const isActive = item.href === '/' 
            ? pathname === '/' 
            : pathname.startsWith(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="size-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

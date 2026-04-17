'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  BookOpen,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  Award,
  Users,
  BarChart3,
  MessageCircleQuestion,
  Flame,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/questions', label: 'Questions', icon: MessageCircleQuestion },
  { href: '/groups', label: 'Groups', icon: Users },
  { href: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
  { href: '/badges', label: 'Badges', icon: Award },
]

export function Header() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="size-5 text-primary-foreground" />
          </div>
          <span className="hidden font-serif text-xl font-semibold sm:inline-block">
            Scripture Connect
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'gap-2',
                    isActive && 'bg-secondary'
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Link href="/search">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="size-5" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>

          {status === 'authenticated' && session?.user ? (
            <>
              {/* Streak Counter */}
              {session.user.streakDays && session.user.streakDays > 0 && (
                <div className="hidden items-center gap-1 rounded-full bg-accent/50 px-3 py-1 sm:flex">
                  <Flame className="size-4 text-orange-500" />
                  <span className="text-sm font-medium">{session.user.streakDays}</span>
                </div>
              )}

              {/* Points */}
              <div className="hidden items-center gap-1 rounded-full bg-primary/10 px-3 py-1 sm:flex">
                <span className="text-sm font-semibold text-primary">
                  {session.user.points?.toLocaleString() ?? 0}
                </span>
                <span className="text-xs text-muted-foreground">pts</span>
              </div>

              {/* Notifications */}
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="size-5" />
                  <Badge className="absolute -right-1 -top-1 size-5 justify-center p-0 text-xs">
                    3
                  </Badge>
                  <span className="sr-only">Notifications</span>
                </Button>
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative size-9 rounded-full">
                    <Avatar className="size-9">
                      <AvatarImage src={session.user.image ?? ''} alt={session.user.name ?? ''} />
                      <AvatarFallback>
                        {session.user.name?.charAt(0).toUpperCase() ?? 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {/* Level Badge */}
                    <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {session.user.level ?? 1}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="size-10">
                      <AvatarImage src={session.user.image ?? ''} />
                      <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{session.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Level {session.user.level ?? 1}
                      </span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 size-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/settings" className="cursor-pointer">
                      <Settings className="mr-2 size-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="size-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col gap-2 pt-6">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname.startsWith(item.href)
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        className="w-full justify-start gap-3"
                      >
                        <Icon className="size-5" />
                        {item.label}
                      </Button>
                    </Link>
                  )
                })}
                <Link href="/search">
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <Search className="size-5" />
                    Search
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

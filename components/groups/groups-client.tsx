'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Plus,
  Users,
  MessageSquare,
  Lock,
  Globe,
  BookOpen,
  Heart,
  Sparkles,
  Loader,
} from 'lucide-react'

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'book-study', label: 'Book Study' },
  { value: 'topical', label: 'Topical' },
  { value: 'prayer', label: 'Prayer' },
  { value: 'theology', label: 'Theology' },
  { value: 'academic', label: 'Academic' },
  { value: 'commentary', label: 'Commentary' },
  { value: 'pastoral', label: 'Pastoral' },
]

function getCategoryIcon(category: string) {
  switch (category) {
    case 'book-study':
      return <BookOpen className="h-4 w-4" />
    case 'prayer':
      return <Sparkles className="h-4 w-4" />
    case 'theology':
      return <BookOpen className="h-4 w-4" />
    case 'topical':
      return <Heart className="h-4 w-4" />
    default:
      return <Users className="h-4 w-4" />
  }
}

interface Group {
  id: string
  name: string
  description: string
  icon_emoji?: string
  category: string
  member_count: number
  discussion_count: number
  is_private: boolean
  creator?: {
    id: string
    display_name: string
  }
}

function GroupCard({ group, onJoin }: { group: Group; onJoin: (groupId: string) => void }) {
  const [isJoining, setIsJoining] = useState(false)
  const [isJoined, setIsJoined] = useState(false)

  const handleJoin = async () => {
    setIsJoining(true)
    try {
      const response = await fetch(`/api/groups/${group.id}/members`, {
        method: 'POST',
      })
      if (response.ok) {
        setIsJoined(true)
        onJoin(group.id)
      }
    } catch (error) {
      console.error('Error joining group:', error)
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xl">
              {group.icon_emoji || getCategoryIcon(group.category)}
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/groups/${group.id}`}
                className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2 break-words"
              >
                {group.name}
                {group.is_private && (
                  <Lock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                )}
              </Link>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {group.member_count.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {group.discussion_count}
                </span>
              </div>
            </div>
          </div>
          {!group.is_private && (
            <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {group.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-xs font-normal">
            {group.category}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {group.creator?.display_name || 'Community'}
        </span>
        <Button
          size="sm"
          variant={isJoined ? 'outline' : 'default'}
          onClick={handleJoin}
          disabled={isJoining || isJoined}
        >
          {isJoining ? (
            <>
              <Loader className="h-3.5 w-3.5 mr-1 animate-spin" />
              Joining...
            </>
          ) : isJoined ? (
            'Joined'
          ) : (
            'Join Group'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export function GroupsClient() {
  const { user } = useAuth()
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('discover')
  const [sortBy, setSortBy] = useState('popular')

  useEffect(() => {
    fetchGroups()
  }, [selectedCategory, sortBy])

  const fetchGroups = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        category: selectedCategory,
        sort: sortBy,
        limit: '50',
      })
      const response = await fetch(`/api/groups?${params}`)
      if (response.ok) {
        const data = await response.json()
        setGroups(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleGroupJoined = () => {
    fetchGroups()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Community Groups</h1>
            <p className="text-muted-foreground mt-1">
              Connect with fellow believers in focused study and fellowship groups
            </p>
          </div>
          {user && (
            <Button asChild>
              <Link href="/groups/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Link>
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="mt-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Groups Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredGroups.map((group) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      onJoin={handleGroupJoined}
                    />
                  ))}
                </div>

                {filteredGroups.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No groups found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search or filters
                    </p>
                    {user && (
                      <Button asChild variant="outline">
                        <Link href="/groups/new">Create a new group</Link>
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="popular" className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groups
                  .sort((a, b) => b.member_count - a.member_count)
                  .slice(0, 12)
                  .map((group) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      onJoin={handleGroupJoined}
                    />
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Featured Categories */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.slice(1).map((category) => (
              <button
                key={category.value}
                onClick={() => {
                  setSelectedCategory(category.value)
                  setActiveTab('discover')
                }}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/20 hover:bg-accent/5 transition-all text-center group"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/20 transition-colors">
                  {getCategoryIcon(category.value)}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {category.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

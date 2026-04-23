"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
} from "lucide-react"

// Mock data for groups
const mockGroups = [
  {
    id: "1",
    name: "Genesis Study Circle",
    description: "Deep dive into the book of Genesis, exploring creation, the patriarchs, and God's covenant with His people.",
    category: "book-study",
    memberCount: 234,
    discussionCount: 89,
    isPrivate: false,
    image: null,
    recentActivity: "2 hours ago",
    tags: ["Genesis", "Old Testament", "Creation"],
  },
  {
    id: "2",
    name: "Youth Bible Fellowship",
    description: "A welcoming space for young believers to discuss faith, ask questions, and grow together in Christ.",
    category: "fellowship",
    memberCount: 567,
    discussionCount: 156,
    isPrivate: false,
    image: null,
    recentActivity: "30 minutes ago",
    tags: ["Youth", "Fellowship", "Community"],
  },
  {
    id: "3",
    name: "Prayer Warriors",
    description: "Join us in lifting up prayers for our community, nation, and world. Share prayer requests and testimonies.",
    category: "prayer",
    memberCount: 892,
    discussionCount: 432,
    isPrivate: false,
    image: null,
    recentActivity: "5 minutes ago",
    tags: ["Prayer", "Intercession", "Support"],
  },
  {
    id: "4",
    name: "Women of Faith",
    description: "A private group for women to share their faith journey, study scripture, and support one another.",
    category: "fellowship",
    memberCount: 345,
    discussionCount: 178,
    isPrivate: true,
    image: null,
    recentActivity: "1 hour ago",
    tags: ["Women", "Faith", "Support"],
  },
  {
    id: "5",
    name: "Apologetics Discussion",
    description: "Explore the evidence for Christianity, discuss difficult questions, and strengthen your faith through reason.",
    category: "theology",
    memberCount: 423,
    discussionCount: 234,
    isPrivate: false,
    image: null,
    recentActivity: "3 hours ago",
    tags: ["Apologetics", "Theology", "Evidence"],
  },
  {
    id: "6",
    name: "Psalms & Worship",
    description: "Study the Psalms together and explore how they guide our worship and relationship with God.",
    category: "book-study",
    memberCount: 289,
    discussionCount: 98,
    isPrivate: false,
    image: null,
    recentActivity: "45 minutes ago",
    tags: ["Psalms", "Worship", "Poetry"],
  },
]

const categories = [
  { value: "all", label: "All Categories" },
  { value: "book-study", label: "Book Study" },
  { value: "fellowship", label: "Fellowship" },
  { value: "prayer", label: "Prayer" },
  { value: "theology", label: "Theology" },
  { value: "devotional", label: "Devotional" },
]

function getCategoryIcon(category: string) {
  switch (category) {
    case "book-study":
      return <BookOpen className="h-4 w-4" />
    case "fellowship":
      return <Heart className="h-4 w-4" />
    case "prayer":
      return <Sparkles className="h-4 w-4" />
    case "theology":
      return <BookOpen className="h-4 w-4" />
    default:
      return <Users className="h-4 w-4" />
  }
}

function GroupCard({ group }: { group: typeof mockGroups[0] }) {
  const [isJoined, setIsJoined] = useState(false)

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              {getCategoryIcon(group.category)}
            </div>
            <div>
              <Link 
                href={`/groups/${group.id}`}
                className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                {group.name}
                {group.isPrivate && (
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </Link>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {group.memberCount.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {group.discussionCount}
                </span>
              </div>
            </div>
          </div>
          {group.isPrivate ? (
            <Globe className="h-4 w-4 text-muted-foreground opacity-0" />
          ) : (
            <Globe className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {group.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {group.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Active {group.recentActivity}
        </span>
        <Button
          size="sm"
          variant={isJoined ? "outline" : "default"}
          onClick={() => setIsJoined(!isJoined)}
        >
          {isJoined ? "Joined" : "Join Group"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function GroupsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeTab, setActiveTab] = useState("discover")

  const filteredGroups = mockGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || group.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
          <Button asChild>
            <Link href="/groups/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Link>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="my-groups">My Groups</TabsTrigger>
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
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
                <Button asChild variant="outline">
                  <Link href="/groups/new">Create a new group</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-groups" className="mt-6">
            {user ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  You haven&apos;t joined any groups yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Discover groups that match your interests
                </p>
                <Button onClick={() => setActiveTab("discover")}>
                  Browse Groups
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Sign in to view your groups
                </h3>
                <p className="text-muted-foreground mb-4">
                  Join groups and connect with the community
                </p>
                <Button asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="popular" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockGroups
                .sort((a, b) => b.memberCount - a.memberCount)
                .slice(0, 6)
                .map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
            </div>
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
                  setActiveTab("discover")
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

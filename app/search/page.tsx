"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  HelpCircle,
  Users,
  MessageSquare,
  BookOpen,
  BarChart3,
  Clock,
  ThumbsUp,
  Filter,
  X,
} from "lucide-react"

// Mock search results
const mockResults = {
  questions: [
    {
      id: "1",
      title: "What is the significance of Genesis 1:1?",
      content: "I'm studying the creation account and want to understand the deeper meaning of the opening verse...",
      author: { name: "Sarah Johnson", image: null },
      votes: 45,
      answers: 12,
      tags: ["Genesis", "Creation", "Old Testament"],
      createdAt: "2 days ago",
    },
    {
      id: "2",
      title: "How do we interpret Genesis 1-3 literally vs. figuratively?",
      content: "What are the different perspectives on understanding the creation account?",
      author: { name: "David Chen", image: null },
      votes: 32,
      answers: 8,
      tags: ["Genesis", "Interpretation", "Hermeneutics"],
      createdAt: "1 week ago",
    },
    {
      id: "3",
      title: "Understanding 'In the beginning God created'",
      content: "The Hebrew word 'bara' is used here. What makes this significant?",
      author: { name: "Emily Williams", image: null },
      votes: 28,
      answers: 6,
      tags: ["Genesis", "Hebrew", "Creation"],
      createdAt: "2 weeks ago",
    },
  ],
  users: [
    {
      id: "1",
      name: "Genesis Scholar",
      bio: "Passionate about studying the book of Genesis and ancient Near Eastern context",
      points: 2450,
      level: 5,
      badges: 8,
    },
    {
      id: "2",
      name: "Old Testament Teacher",
      bio: "Seminary graduate focused on Old Testament studies, especially Genesis through Deuteronomy",
      points: 1890,
      level: 4,
      badges: 6,
    },
  ],
  groups: [
    {
      id: "1",
      name: "Genesis Study Circle",
      description: "Deep dive into the book of Genesis",
      memberCount: 234,
      category: "book-study",
    },
    {
      id: "2",
      name: "Old Testament Survey",
      description: "Comprehensive study of the Hebrew Bible",
      memberCount: 567,
      category: "book-study",
    },
  ],
  discussions: [
    {
      id: "1",
      title: "Genesis 1:1 - Hebrew word study",
      group: "Genesis Study Circle",
      replies: 23,
      createdAt: "3 hours ago",
    },
    {
      id: "2",
      title: "The days of creation discussion",
      group: "Genesis Study Circle",
      replies: 45,
      createdAt: "1 day ago",
    },
  ],
  polls: [
    {
      id: "1",
      question: "Which Genesis chapter should we study next?",
      totalVotes: 234,
      isActive: true,
    },
  ],
}

const sortOptions = [
  { value: "relevance", label: "Most Relevant" },
  { value: "recent", label: "Most Recent" },
  { value: "popular", label: "Most Popular" },
]

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  
  const [query, setQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(!!initialQuery)

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery)
      setHasSearched(true)
    }
  }, [initialQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsSearching(true)
      setHasSearched(true)
      // Simulate search delay
      setTimeout(() => setIsSearching(false), 500)
    }
  }

  const clearSearch = () => {
    setQuery("")
    setHasSearched(false)
  }

  const totalResults = 
    mockResults.questions.length +
    mockResults.users.length +
    mockResults.groups.length +
    mockResults.discussions.length +
    mockResults.polls.length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-4">
            <Search className="h-8 w-8 text-primary" />
            Search
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search questions, users, groups, discussions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-12 h-14 text-lg"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </form>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {isSearching ? (
                  "Searching..."
                ) : (
                  <>Found <span className="font-semibold text-foreground">{totalResults}</span> results for &ldquo;{query}&rdquo;</>
                )}
              </p>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6 mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="questions">
                  Questions ({mockResults.questions.length})
                </TabsTrigger>
                <TabsTrigger value="users">
                  Users ({mockResults.users.length})
                </TabsTrigger>
                <TabsTrigger value="groups">
                  Groups ({mockResults.groups.length})
                </TabsTrigger>
                <TabsTrigger value="discussions">
                  Discussions ({mockResults.discussions.length})
                </TabsTrigger>
                <TabsTrigger value="polls">
                  Polls ({mockResults.polls.length})
                </TabsTrigger>
              </TabsList>

              {/* All Results */}
              <TabsContent value="all" className="space-y-6">
                {/* Questions */}
                {mockResults.questions.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      Questions
                    </h2>
                    <div className="space-y-3">
                      {mockResults.questions.slice(0, 3).map((q) => (
                        <Card key={q.id} className="hover:shadow-md transition-all">
                          <CardContent className="p-4">
                            <Link href={`/questions/${q.id}`} className="block group">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {q.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {q.content}
                              </p>
                            </Link>
                            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-3.5 w-3.5" />
                                {q.votes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-3.5 w-3.5" />
                                {q.answers}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {q.createdAt}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {q.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    {mockResults.questions.length > 3 && (
                      <Button 
                        variant="ghost" 
                        className="w-full mt-2"
                        onClick={() => setActiveTab("questions")}
                      >
                        View all {mockResults.questions.length} questions
                      </Button>
                    )}
                  </div>
                )}

                {/* Users */}
                {mockResults.users.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Users
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {mockResults.users.map((user) => (
                        <Card key={user.id} className="hover:shadow-md transition-all">
                          <CardContent className="p-4">
                            <Link href={`/users/${user.id}`} className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  {user.name}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {user.bio}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                  <span>{user.points.toLocaleString()} pts</span>
                                  <span>•</span>
                                  <span>Level {user.level}</span>
                                </div>
                              </div>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Groups */}
                {mockResults.groups.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Groups
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {mockResults.groups.map((group) => (
                        <Card key={group.id} className="hover:shadow-md transition-all">
                          <CardContent className="p-4">
                            <Link href={`/groups/${group.id}`} className="block">
                              <h3 className="font-semibold text-foreground">
                                {group.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                {group.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <Users className="h-3.5 w-3.5" />
                                {group.memberCount.toLocaleString()} members
                              </div>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Individual Tab Contents */}
              <TabsContent value="questions" className="space-y-3">
                {mockResults.questions.map((q) => (
                  <Card key={q.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <Link href={`/questions/${q.id}`} className="block group">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {q.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {q.content}
                        </p>
                      </Link>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          {q.votes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {q.answers}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {q.createdAt}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {q.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="users" className="grid gap-3 sm:grid-cols-2">
                {mockResults.users.map((user) => (
                  <Card key={user.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <Link href={`/users/${user.id}`} className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {user.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {user.bio}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>{user.points.toLocaleString()} pts</span>
                            <span>•</span>
                            <span>Level {user.level}</span>
                            <span>•</span>
                            <span>{user.badges} badges</span>
                          </div>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="groups" className="grid gap-3 sm:grid-cols-2">
                {mockResults.groups.map((group) => (
                  <Card key={group.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <Link href={`/groups/${group.id}`} className="block">
                        <h3 className="font-semibold text-foreground">
                          {group.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {group.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          {group.memberCount.toLocaleString()} members
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="discussions" className="space-y-3">
                {mockResults.discussions.map((d) => (
                  <Card key={d.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <Link href={`/groups/1/discussions/${d.id}`} className="block">
                        <h3 className="font-semibold text-foreground">
                          {d.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <span>in {d.group}</span>
                          <span>•</span>
                          <span>{d.replies} replies</span>
                          <span>•</span>
                          <span>{d.createdAt}</span>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="polls" className="space-y-3">
                {mockResults.polls.map((poll) => (
                  <Card key={poll.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <Link href={`/polls`} className="block">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart3 className="h-5 w-5 text-primary" />
                          <Badge variant={poll.isActive ? "default" : "secondary"}>
                            {poll.isActive ? "Active" : "Ended"}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-foreground">
                          {poll.question}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {poll.totalVotes.toLocaleString()} votes
                        </p>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Empty State */}
        {!hasSearched && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Search the Community
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Find questions, users, groups, discussions, and polls. 
              Start typing to discover great content.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setQuery("Genesis")}>
                Genesis
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setQuery("Psalms")}>
                Psalms
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setQuery("prayer")}>
                Prayer
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setQuery("faith")}>
                Faith
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setQuery("Romans")}>
                Romans
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading search...</div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  )
}

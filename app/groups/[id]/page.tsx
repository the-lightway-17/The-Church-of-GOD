"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Users,
  MessageSquare,
  Settings,
  Share2,
  Bell,
  BellOff,
  ArrowLeft,
  Plus,
  ThumbsUp,
  Clock,
  BookOpen,
  Heart,
  Send,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock group data
const mockGroup = {
  id: "1",
  name: "Genesis Study Circle",
  description: "Deep dive into the book of Genesis, exploring creation, the patriarchs, and God's covenant with His people. Join us for weekly discussions, verse-by-verse analysis, and fellowship as we uncover the foundational truths of Scripture together.",
  category: "book-study",
  memberCount: 234,
  discussionCount: 89,
  isPrivate: false,
  createdAt: "2024-01-15",
  tags: ["Genesis", "Old Testament", "Creation", "Covenant"],
  guidelines: [
    "Be respectful and kind to all members",
    "Support your interpretations with Scripture",
    "Stay on topic during discussions",
    "No spam or self-promotion",
  ],
}

const mockMembers = [
  { id: "1", name: "Sarah Johnson", image: null, role: "admin", joinedAt: "2024-01-15" },
  { id: "2", name: "David Chen", image: null, role: "moderator", joinedAt: "2024-01-20" },
  { id: "3", name: "Emily Williams", image: null, role: "member", joinedAt: "2024-02-01" },
  { id: "4", name: "Michael Brown", image: null, role: "member", joinedAt: "2024-02-15" },
  { id: "5", name: "Rachel Kim", image: null, role: "member", joinedAt: "2024-03-01" },
]

const mockDiscussions = [
  {
    id: "1",
    title: "Understanding Genesis 1:1 - In the Beginning",
    author: { name: "Sarah Johnson", image: null },
    content: "I've been studying the Hebrew text of Genesis 1:1, and I'm fascinated by the word 'bara' (create). What are your thoughts on the significance of this particular word choice?",
    replies: 23,
    likes: 45,
    createdAt: "2 hours ago",
    isPinned: true,
  },
  {
    id: "2",
    title: "The Days of Creation - Literal or Figurative?",
    author: { name: "David Chen", image: null },
    content: "I'd love to hear different perspectives on whether the 'days' in Genesis 1 should be interpreted as literal 24-hour periods or as longer epochs of time.",
    replies: 56,
    likes: 32,
    createdAt: "5 hours ago",
    isPinned: false,
  },
  {
    id: "3",
    title: "Abraham's Faith Journey",
    author: { name: "Emily Williams", image: null },
    content: "Reading about Abraham leaving his homeland in Genesis 12. What lessons can we apply to our own faith journey when God calls us to step out?",
    replies: 18,
    likes: 28,
    createdAt: "1 day ago",
    isPinned: false,
  },
  {
    id: "4",
    title: "Joseph's Story - Providence in Action",
    author: { name: "Michael Brown", image: null },
    content: "The story of Joseph is such a powerful example of God's sovereignty. Let's discuss how Genesis 50:20 applies to our own difficult circumstances.",
    replies: 34,
    likes: 52,
    createdAt: "2 days ago",
    isPinned: false,
  },
]

function DiscussionCard({ discussion }: { discussion: typeof mockDiscussions[0] }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(discussion.likes)

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  return (
    <Card className={`hover:shadow-md transition-all ${discussion.isPinned ? 'border-primary/30 bg-primary/5' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={discussion.author.image || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {discussion.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link 
                  href={`/groups/1/discussions/${discussion.id}`}
                  className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                >
                  {discussion.isPinned && (
                    <Badge variant="secondary" className="mr-2 text-xs">Pinned</Badge>
                  )}
                  {discussion.title}
                </Link>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                  <span>{discussion.author.name}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {discussion.createdAt}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Share</DropdownMenuItem>
                  <DropdownMenuItem>Report</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {discussion.content}
            </p>
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  liked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <ThumbsUp className={`h-4 w-4 ${liked ? 'fill-primary' : ''}`} />
                {likeCount}
              </button>
              <Link 
                href={`/groups/1/discussions/${discussion.id}`}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                {discussion.replies} replies
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function GroupDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const [isJoined, setIsJoined] = useState(false)
  const [isNotifying, setIsNotifying] = useState(true)
  const [newDiscussionTitle, setNewDiscussionTitle] = useState("")
  const [newDiscussionContent, setNewDiscussionContent] = useState("")
  const [showNewDiscussion, setShowNewDiscussion] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Link 
          href="/groups" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Groups
        </Link>

        {/* Group Header */}
        <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-background rounded-2xl p-6 md:p-8 mb-8 border border-border">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                <BookOpen className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {mockGroup.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {mockGroup.memberCount.toLocaleString()} members
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {mockGroup.discussionCount} discussions
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isJoined && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsNotifying(!isNotifying)}
                  title={isNotifying ? "Mute notifications" : "Enable notifications"}
                >
                  {isNotifying ? (
                    <Bell className="h-4 w-4" />
                  ) : (
                    <BellOff className="h-4 w-4" />
                  )}
                </Button>
              )}
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant={isJoined ? "outline" : "default"}
                onClick={() => setIsJoined(!isJoined)}
              >
                {isJoined ? "Joined" : "Join Group"}
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground mt-4 max-w-3xl">
            {mockGroup.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {mockGroup.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Discussions Column */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="discussions">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="discussions">Discussions</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>
                {isJoined && (
                  <Button
                    size="sm"
                    onClick={() => setShowNewDiscussion(!showNewDiscussion)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Discussion
                  </Button>
                )}
              </div>

              <TabsContent value="discussions" className="mt-0">
                {/* New Discussion Form */}
                {showNewDiscussion && isJoined && (
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">Start a New Discussion</h3>
                      <div className="space-y-3">
                        <Input
                          placeholder="Discussion title..."
                          value={newDiscussionTitle}
                          onChange={(e) => setNewDiscussionTitle(e.target.value)}
                        />
                        <Textarea
                          placeholder="What would you like to discuss?"
                          value={newDiscussionContent}
                          onChange={(e) => setNewDiscussionContent(e.target.value)}
                          rows={3}
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => setShowNewDiscussion(false)}
                          >
                            Cancel
                          </Button>
                          <Button>
                            <Send className="h-4 w-4 mr-2" />
                            Post Discussion
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Discussions List */}
                <div className="space-y-3">
                  {mockDiscussions.map((discussion) => (
                    <DiscussionCard key={discussion.id} discussion={discussion} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="about" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Group</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-muted-foreground">{mockGroup.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Guidelines</h4>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {mockGroup.guidelines.map((guideline, index) => (
                          <li key={index}>{guideline}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Created</h4>
                      <p className="text-muted-foreground">
                        {new Date(mockGroup.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Members Card */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Members</CardTitle>
                  <Link 
                    href={`/groups/${params.id}/members`}
                    className="text-sm text-primary hover:underline"
                  >
                    View all
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockMembers.slice(0, 5).map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.image || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/users/${member.id}`}
                          className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate block"
                        >
                          {member.name}
                        </Link>
                        {member.role !== "member" && (
                          <Badge 
                            variant={member.role === "admin" ? "default" : "secondary"}
                            className="text-xs capitalize"
                          >
                            {member.role}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-accent/10">
                    <div className="text-2xl font-bold text-primary">
                      {mockGroup.discussionCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Discussions</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-accent/10">
                    <div className="text-2xl font-bold text-primary">
                      {mockGroup.memberCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Members</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Groups */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Related Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Exodus Deep Dive", "Psalms & Worship", "Old Testament Survey"].map((name) => (
                    <Link
                      key={name}
                      href="#"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/10 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{name}</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

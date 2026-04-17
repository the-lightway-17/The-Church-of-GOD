"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Clock,
  Users,
  Plus,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  Share2,
} from "lucide-react"

// Mock polls data
const mockPolls = [
  {
    id: "1",
    question: "Which book of the Bible would you like to study next as a community?",
    author: { name: "Sarah Johnson", image: null },
    category: "Community",
    options: [
      { id: "a", text: "Romans", votes: 156, percentage: 42 },
      { id: "b", text: "James", votes: 89, percentage: 24 },
      { id: "c", text: "Philippians", votes: 78, percentage: 21 },
      { id: "d", text: "1 Peter", votes: 47, percentage: 13 },
    ],
    totalVotes: 370,
    endsAt: "2024-04-20",
    createdAt: "3 days ago",
    hasVoted: false,
    isActive: true,
    comments: 45,
  },
  {
    id: "2",
    question: "What time works best for our weekly online Bible study?",
    author: { name: "David Chen", image: null },
    category: "Schedule",
    options: [
      { id: "a", text: "7:00 PM EST", votes: 234, percentage: 45 },
      { id: "b", text: "8:00 PM EST", votes: 189, percentage: 36 },
      { id: "c", text: "6:00 PM EST", votes: 98, percentage: 19 },
    ],
    totalVotes: 521,
    endsAt: "2024-04-18",
    createdAt: "5 days ago",
    hasVoted: true,
    votedOption: "a",
    isActive: true,
    comments: 23,
  },
  {
    id: "3",
    question: "Which translation do you primarily use for personal study?",
    author: { name: "Emily Williams", image: null },
    category: "Discussion",
    options: [
      { id: "a", text: "NIV", votes: 312, percentage: 35 },
      { id: "b", text: "ESV", votes: 278, percentage: 31 },
      { id: "c", text: "KJV", votes: 156, percentage: 17 },
      { id: "d", text: "NASB", votes: 89, percentage: 10 },
      { id: "e", text: "NLT", votes: 67, percentage: 7 },
    ],
    totalVotes: 902,
    endsAt: "2024-04-10",
    createdAt: "2 weeks ago",
    hasVoted: true,
    votedOption: "b",
    isActive: false,
    comments: 89,
  },
  {
    id: "4",
    question: "How often do you read your Bible?",
    author: { name: "Michael Brown", image: null },
    category: "Personal",
    options: [
      { id: "a", text: "Daily", votes: 445, percentage: 52 },
      { id: "b", text: "Several times a week", votes: 234, percentage: 27 },
      { id: "c", text: "Weekly", votes: 112, percentage: 13 },
      { id: "d", text: "Less than weekly", votes: 67, percentage: 8 },
    ],
    totalVotes: 858,
    endsAt: "2024-04-05",
    createdAt: "3 weeks ago",
    hasVoted: false,
    isActive: false,
    comments: 156,
  },
]

function PollCard({ poll }: { poll: typeof mockPolls[0] }) {
  const [hasVoted, setHasVoted] = useState(poll.hasVoted)
  const [votedOption, setVotedOption] = useState(poll.votedOption || null)
  const [options, setOptions] = useState(poll.options)

  const handleVote = (optionId: string) => {
    if (hasVoted || !poll.isActive) return
    
    // Simulate voting
    const newOptions = options.map((opt) => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 }
      }
      return opt
    })
    
    // Recalculate percentages
    const totalVotes = newOptions.reduce((sum, opt) => sum + opt.votes, 0)
    const updatedOptions = newOptions.map((opt) => ({
      ...opt,
      percentage: Math.round((opt.votes / totalVotes) * 100),
    }))
    
    setOptions(updatedOptions)
    setHasVoted(true)
    setVotedOption(optionId)
  }

  return (
    <Card className={`hover:shadow-md transition-all ${!poll.isActive ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={poll.author.image || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {poll.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{poll.author.name}</p>
              <p className="text-xs text-muted-foreground">{poll.createdAt}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={poll.isActive ? "default" : "secondary"}>
              {poll.isActive ? "Active" : "Ended"}
            </Badge>
            <Badge variant="outline">{poll.category}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <h3 className="font-semibold text-lg mb-4">{poll.question}</h3>
        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted || !poll.isActive}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                votedOption === option.id
                  ? 'border-primary bg-primary/5'
                  : hasVoted
                  ? 'border-border bg-muted/30'
                  : 'border-border hover:border-primary/50 hover:bg-accent/30'
              } ${!poll.isActive && !hasVoted ? 'cursor-default' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  {option.text}
                  {votedOption === option.id && (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  )}
                </span>
                {(hasVoted || !poll.isActive) && (
                  <span className="text-sm font-semibold text-primary">
                    {option.percentage}%
                  </span>
                )}
              </div>
              {(hasVoted || !poll.isActive) && (
                <Progress 
                  value={option.percentage} 
                  className="h-2"
                />
              )}
            </button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {poll.totalVotes + (hasVoted && !poll.hasVoted ? 1 : 0)} votes
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {poll.comments} comments
          </span>
        </div>
        <div className="flex items-center gap-2">
          {poll.isActive && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Ends {new Date(poll.endsAt).toLocaleDateString()}
            </span>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default function PollsPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("active")

  const activePolls = mockPolls.filter((p) => p.isActive)
  const endedPolls = mockPolls.filter((p) => !p.isActive)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              Community Polls
            </h1>
            <p className="text-muted-foreground mt-1">
              Vote and share your perspective with the community
            </p>
          </div>
          <Button asChild>
            <Link href="/polls/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Poll
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{activePolls.length}</p>
            <p className="text-xs text-muted-foreground">Active Polls</p>
          </Card>
          <Card className="p-4 text-center">
            <Users className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">
              {mockPolls.reduce((sum, p) => sum + p.totalVotes, 0).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total Votes</p>
          </Card>
          <Card className="p-4 text-center">
            <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{mockPolls.length}</p>
            <p className="text-xs text-muted-foreground">All Time Polls</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="ended">Ended</TabsTrigger>
            <TabsTrigger value="my-polls">My Polls</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-0">
            <div className="space-y-4">
              {activePolls.map((poll) => (
                <PollCard key={poll.id} poll={poll} />
              ))}
              {activePolls.length === 0 && (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No active polls</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to create a poll for the community
                  </p>
                  <Button asChild>
                    <Link href="/polls/new">Create Poll</Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="ended" className="mt-0">
            <div className="space-y-4">
              {endedPolls.map((poll) => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-polls" className="mt-0">
            {session ? (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No polls created yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first poll to engage the community
                </p>
                <Button asChild>
                  <Link href="/polls/new">Create Poll</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Sign in to view your polls</h3>
                <p className="text-muted-foreground mb-4">
                  Create and manage your community polls
                </p>
                <Button asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

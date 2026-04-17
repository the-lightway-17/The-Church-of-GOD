"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  BookOpen,
  Calendar,
  Heart,
  Share2,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Send,
  Sparkles,
  Sun,
  Coffee,
  Moon,
} from "lucide-react"

// Mock data for daily verse
const todaysVerse = {
  reference: "Philippians 4:13",
  text: "I can do all this through him who gives me strength.",
  translation: "NIV",
  theme: "Strength",
  date: new Date().toISOString().split("T")[0],
  reflectionPrompt: "How has God given you strength in a challenging situation recently?",
  relatedVerses: [
    "Isaiah 40:31",
    "Psalm 28:7",
    "2 Corinthians 12:9",
  ],
}

const recentVerses = [
  {
    date: "Yesterday",
    reference: "Psalm 23:1",
    text: "The Lord is my shepherd, I lack nothing.",
  },
  {
    date: "2 days ago",
    reference: "Proverbs 3:5-6",
    text: "Trust in the Lord with all your heart and lean not on your own understanding...",
  },
  {
    date: "3 days ago",
    reference: "Romans 8:28",
    text: "And we know that in all things God works for the good of those who love him...",
  },
]

const communityReflections = [
  {
    id: "1",
    author: { name: "Sarah Johnson", image: null },
    content: "This verse has been my anchor during a difficult season at work. When I feel overwhelmed, I remember that it's His strength, not mine, that carries me through.",
    createdAt: "2 hours ago",
    likes: 24,
  },
  {
    id: "2",
    author: { name: "David Chen", image: null },
    content: "I love how Paul wrote this from prison. It wasn't about circumstances, but about contentment and relying on Christ in ALL situations.",
    createdAt: "4 hours ago",
    likes: 18,
  },
  {
    id: "3",
    author: { name: "Emily Williams", image: null },
    content: "Reading this today as I prepare for a big job interview. Praying for God's peace and strength!",
    createdAt: "6 hours ago",
    likes: 31,
  },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return { text: "Good Morning", icon: Coffee }
  if (hour < 18) return { text: "Good Afternoon", icon: Sun }
  return { text: "Good Evening", icon: Moon }
}

export default function DailyPage() {
  const [isSaved, setIsSaved] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [reflection, setReflection] = useState("")
  const [reflections, setReflections] = useState(communityReflections)

  const greeting = getGreeting()
  const GreetingIcon = greeting.icon

  const handleShareReflection = () => {
    if (reflection.trim()) {
      const newReflection = {
        id: Date.now().toString(),
        author: { name: "You", image: null },
        content: reflection,
        createdAt: "Just now",
        likes: 0,
      }
      setReflections([newReflection, ...reflections])
      setReflection("")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <GreetingIcon className="h-5 w-5" />
              <span className="text-sm font-medium">{greeting.text}</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Daily Verse</h1>
            <p className="text-muted-foreground mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Verse Card */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-br from-primary/20 via-accent/10 to-background p-8 md:p-12 text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              {todaysVerse.theme}
            </Badge>
            <blockquote className="text-2xl md:text-3xl font-serif text-foreground leading-relaxed mb-6 text-balance">
              &ldquo;{todaysVerse.text}&rdquo;
            </blockquote>
            <p className="text-lg font-semibold text-primary">
              {todaysVerse.reference}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {todaysVerse.translation}
            </p>
          </div>
          <CardFooter className="flex justify-center gap-4 p-4 bg-card">
            <Button
              variant={isSaved ? "default" : "outline"}
              size="sm"
              onClick={() => setIsSaved(!isSaved)}
            >
              <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? "Saved" : "Save"}
            </Button>
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              Like
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </CardFooter>
        </Card>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Reflections Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reflection Prompt */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Today&apos;s Reflection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-accent/30 border border-border">
                  <p className="font-medium text-foreground">
                    {todaysVerse.reflectionPrompt}
                  </p>
                </div>
                <Textarea
                  placeholder="Share your thoughts and reflections..."
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleShareReflection}
                    disabled={!reflection.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Share Reflection
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Reflections */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Reflections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reflections.map((r) => (
                  <div key={r.id} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={r.author.image || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {r.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{r.author.name}</span>
                        <span className="text-xs text-muted-foreground">{r.createdAt}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.content}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                          <Heart className="h-3.5 w-3.5" />
                          {r.likes}
                        </button>
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                          <MessageSquare className="h-3.5 w-3.5" />
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Verses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Related Verses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {todaysVerse.relatedVerses.map((verse) => (
                  <Link
                    key={verse}
                    href={`/search?q=${encodeURIComponent(verse)}`}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{verse}</span>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Recent Verses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Daily Verses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentVerses.map((verse, index) => (
                  <div key={index} className="pb-4 border-b border-border last:border-0 last:pb-0">
                    <p className="text-xs text-muted-foreground mb-1">{verse.date}</p>
                    <p className="text-sm font-medium text-primary mb-1">{verse.reference}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{verse.text}</p>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" size="sm">
                  View All History
                </Button>
              </CardFooter>
            </Card>

            {/* Reading Streak */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="pt-6 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary mb-1">7</p>
                <p className="text-sm text-muted-foreground">Day Reading Streak</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Keep it going! Read tomorrow&apos;s verse to continue.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

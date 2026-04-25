'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { useRouter } from 'next/navigation'
import {
  MessageCircle,
  ArrowUp,
  Check,
  Clock,
  Eye,
  Bookmark,
  MoreVertical,
  Edit,
  Trash2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface Question {
  id: string
  title: string
  content: string
  category: string
  views_count: number
  created_at: string
  updated_at: string
  author: { id: string; display_name: string }
  answer_count: number
  comment_count: number
}

interface QuestionsListProps {
  searchParams: { category?: string; tag?: string; sort?: string; page?: string }
}

function formatTimeAgo(date: string): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return new Date(date).toLocaleDateString()
}

export function QuestionsListClient({ searchParams }: QuestionsListProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const params = new URLSearchParams({
          page: searchParams.page || '1',
          limit: '20',
          sort: searchParams.sort || 'recent',
        })

        if (searchParams.category && searchParams.category !== 'all') {
          params.append('category', searchParams.category)
        }
        if (searchParams.tag) {
          params.append('tag', searchParams.tag)
        }

        const response = await fetch(`/api/questions?${params}`)
        if (!response.ok) {
          throw new Error('Failed to fetch questions')
        }

        const data = await response.json()
        setQuestions(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [searchParams])

  const handleDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete question')
      }

      setQuestions(questions.filter((q) => q.id !== questionId))
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete question')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse rounded-lg border p-4">
            <div className="mb-2 h-4 w-3/4 rounded bg-muted" />
            <div className="mb-4 h-3 w-1/2 rounded bg-muted" />
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded bg-muted" />
              <div className="h-6 w-16 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/10 py-12 text-center">
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (questions.length === 0) {
    return (
      <Card className="py-12 text-center">
        <CardContent>
          <p className="text-muted-foreground">No questions found matching your criteria.</p>
          <Link href="/questions/new">
            <Button className="mt-4">Ask a Question</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{questions.length} questions</span>
      </div>

      {questions.map((question) => (
        <Card key={question.id} className="transition-all hover:border-primary/50 hover:shadow-md">
          <CardContent className="py-4">
            <div className="flex gap-4">
              {/* Stats Column */}
              <div className="hidden flex-col gap-2 sm:flex">
                <div className="flex flex-col items-center justify-center rounded-lg border border-border px-3 py-2">
                  <ArrowUp className="size-4 text-primary" />
                  <span className="text-sm font-semibold">0</span>
                  <span className="text-[10px] text-muted-foreground">votes</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border border-border px-3 py-2">
                  <MessageCircle className="size-4" />
                  <span className="text-sm font-semibold">{question.answer_count}</span>
                  <span className="text-[10px] text-muted-foreground">answers</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {question.category}
                  </Badge>
                  {question.answer_count > 0 && (
                    <Badge variant="secondary" className="gap-1 bg-success/20 text-success">
                      <Check className="size-3" />
                      Answered
                    </Badge>
                  )}
                  {user && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/questions/${question.id}/edit`}>
                            <Edit className="size-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(question.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="size-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <Link href={`/questions/${question.id}`}>
                  <h3 className="font-medium leading-snug hover:text-primary">
                    {question.title}
                  </h3>
                </Link>

                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {question.content}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-5">
                      <AvatarFallback className="text-[10px]">
                        {question.author.display_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{question.author.display_name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="size-4" />
                    <span>{formatTimeAgo(question.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Eye className="size-4" />
                    <span>{question.views_count} views</span>
                  </div>

                  {/* Mobile stats */}
                  <div className="flex items-center gap-3 sm:hidden">
                    <div className="flex items-center gap-1">
                      <ArrowUp className="size-4" />
                      <span>0</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="size-4" />
                      <span>{question.answer_count}</span>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" className="ml-auto gap-1">
                    <Bookmark className="size-4" />
                    <span className="hidden sm:inline">Save</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

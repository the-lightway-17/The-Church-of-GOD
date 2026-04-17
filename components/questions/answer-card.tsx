'use client'

import Link from 'next/link'
import { ArrowUp, ArrowDown, Check, Share2, Flag, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AnswerAuthor {
  id: string
  name: string
  image: string | null
  level: number
  points: number
}

interface Answer {
  id: string
  content: string
  author: AnswerAuthor
  voteScore: number
  isAccepted: boolean
  createdAt: Date
  bibleReferences: string[]
}

interface AnswerCardProps {
  answer: Answer
  isAccepted: boolean
  isQuestionAuthor: boolean
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function renderContent(content: string) {
  // Simple markdown-like rendering
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  
  lines.forEach((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <h4 key={i} className="mt-4 mb-2 font-semibold">
          {line.slice(2, -2)}
        </h4>
      )
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={i} className="ml-4">
          {line.slice(2)}
        </li>
      )
    } else if (line.trim()) {
      elements.push(
        <p key={i} className="mb-2">
          {line}
        </p>
      )
    }
  })
  
  return elements
}

export function AnswerCard({ answer, isAccepted, isQuestionAuthor }: AnswerCardProps) {
  return (
    <Card className={cn(isAccepted && 'border-success/50 bg-success/5')}>
      <CardContent className="py-4">
        <div className="flex gap-4 sm:gap-6">
          {/* Voting */}
          <div className="hidden flex-col items-center gap-2 sm:flex">
            <Button variant="ghost" size="icon">
              <ArrowUp className="size-5" />
            </Button>
            <span className="text-lg font-semibold">{answer.voteScore}</span>
            <Button variant="ghost" size="icon">
              <ArrowDown className="size-5" />
            </Button>
            {isAccepted && (
              <div className="mt-2 flex size-10 items-center justify-center rounded-full bg-success text-success-foreground">
                <Check className="size-6" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            {isAccepted && (
              <Badge className="mb-3 gap-1 bg-success text-success-foreground">
                <Check className="size-3" />
                Accepted Answer
              </Badge>
            )}

            <div className="prose prose-stone dark:prose-invert max-w-none text-sm">
              {renderContent(answer.content)}
            </div>

            {/* Bible References */}
            {answer.bibleReferences.length > 0 && (
              <div className="mt-4">
                <h5 className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <BookOpen className="size-3" />
                  References
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {answer.bibleReferences.map((ref) => (
                    <Badge key={ref} variant="outline" className="bg-accent/20 text-xs">
                      {ref}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-t pt-4">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                  <Share2 className="size-3" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                  <Flag className="size-3" />
                  Report
                </Button>
                {isQuestionAuthor && !isAccepted && (
                  <Button variant="outline" size="sm" className="h-8 gap-1 text-xs text-success">
                    <Check className="size-3" />
                    Accept
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
                <div className="text-right text-xs text-muted-foreground">
                  <div>answered</div>
                  <div>{formatDate(answer.createdAt)}</div>
                </div>
                <Link href={`/users/${answer.author.id}`} className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarImage src={answer.author.image ?? ''} />
                    <AvatarFallback className="text-xs">
                      {answer.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium hover:text-primary">
                      {answer.author.name}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="rounded bg-primary/10 px-1 py-0.5 text-[10px] font-medium text-primary">
                        Lvl {answer.author.level}
                      </span>
                      <span>{answer.author.points.toLocaleString()} pts</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Mobile voting */}
            <div className="mt-4 flex items-center gap-2 sm:hidden">
              <Button variant="outline" size="sm" className="gap-1">
                <ArrowUp className="size-4" />
                {answer.voteScore}
              </Button>
              {isAccepted && (
                <Badge className="gap-1 bg-success text-success-foreground">
                  <Check className="size-3" />
                  Accepted
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

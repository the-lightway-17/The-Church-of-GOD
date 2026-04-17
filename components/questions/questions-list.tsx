import Link from 'next/link'
import { use } from 'react'
import { MessageCircle, ArrowUp, Check, Clock, Eye, Bookmark } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Sample data - in production, this would come from the database
const SAMPLE_QUESTIONS = [
  {
    id: '1',
    title: 'What does it mean to be "born again" according to John 3?',
    content: 'I have been reading John 3 and I am trying to understand what Jesus meant when he told Nicodemus that he must be born again...',
    category: 'theological',
    author: { id: 'u1', name: 'Sarah M.', image: null, level: 5 },
    voteScore: 42,
    answerCount: 8,
    viewCount: 234,
    hasAcceptedAnswer: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    tags: ['John', 'Salvation', 'New Testament'],
    bibleReferences: ['John 3:3-7'],
  },
  {
    id: '2',
    title: 'How should Christians approach the concept of predestination?',
    content: 'There seems to be a lot of debate among Christians about predestination. Some believe in free will while others believe everything is predetermined...',
    category: 'theological',
    author: { id: 'u2', name: 'David K.', image: null, level: 8 },
    voteScore: 38,
    answerCount: 15,
    viewCount: 567,
    hasAcceptedAnswer: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    tags: ['Predestination', 'Doctrine', 'Calvinism', 'Arminianism'],
    bibleReferences: ['Romans 8:29-30', 'Ephesians 1:4-5'],
  },
  {
    id: '3',
    title: 'What are practical ways to incorporate daily Bible reading into a busy schedule?',
    content: 'I really want to be more consistent with my Bible reading but I work long hours and have a family to take care of...',
    category: 'practical',
    author: { id: 'u3', name: 'Emily R.', image: null, level: 3 },
    voteScore: 31,
    answerCount: 12,
    viewCount: 189,
    hasAcceptedAnswer: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    tags: ['Devotional', 'Habits', 'Bible Study'],
    bibleReferences: [],
  },
  {
    id: '4',
    title: 'What is the historical context of the book of Revelation?',
    content: 'I am trying to understand Revelation better and I think knowing when it was written and what was happening at the time would help...',
    category: 'historical',
    author: { id: 'u4', name: 'Michael T.', image: null, level: 12 },
    voteScore: 27,
    answerCount: 6,
    viewCount: 445,
    hasAcceptedAnswer: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    tags: ['Revelation', 'Prophecy', 'History', 'John'],
    bibleReferences: ['Revelation 1:1-3'],
  },
  {
    id: '5',
    title: 'How do I find peace during times of anxiety according to Scripture?',
    content: 'I have been struggling with anxiety lately and I am looking for biblical wisdom and practical application for dealing with it...',
    category: 'devotional',
    author: { id: 'u5', name: 'Anna L.', image: null, level: 6 },
    voteScore: 45,
    answerCount: 18,
    viewCount: 892,
    hasAcceptedAnswer: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    tags: ['Peace', 'Anxiety', 'Psalms', 'Mental Health'],
    bibleReferences: ['Philippians 4:6-7', 'Psalm 94:19'],
  },
  {
    id: '6',
    title: 'What does the Bible say about tithing in the New Testament?',
    content: 'I know tithing was a requirement in the Old Testament, but is it still required for Christians today?',
    category: 'theological',
    author: { id: 'u6', name: 'Robert J.', image: null, level: 4 },
    voteScore: 22,
    answerCount: 9,
    viewCount: 321,
    hasAcceptedAnswer: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
    tags: ['Tithing', 'Giving', 'New Testament', 'Finances'],
    bibleReferences: ['2 Corinthians 9:7', 'Malachi 3:10'],
  },
]

const CATEGORY_STYLES = {
  theological: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  practical: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  historical: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  devotional: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}

interface QuestionsListProps {
  searchParams: Promise<{ category?: string; tag?: string; sort?: string; page?: string }>
}

export function QuestionsList({ searchParams }: QuestionsListProps) {
  const params = use(searchParams)
  
  // Filter questions based on params (in production this would be done server-side)
  let filteredQuestions = [...SAMPLE_QUESTIONS]
  
  if (params.category && params.category !== 'all') {
    filteredQuestions = filteredQuestions.filter((q) => q.category === params.category)
  }
  
  if (params.tag) {
    filteredQuestions = filteredQuestions.filter((q) =>
      q.tags.some((t) => t.toLowerCase() === params.tag?.toLowerCase())
    )
  }
  
  // Sort
  switch (params.sort) {
    case 'popular':
      filteredQuestions.sort((a, b) => b.voteScore - a.voteScore)
      break
    case 'unanswered':
      filteredQuestions = filteredQuestions.filter((q) => q.answerCount === 0 || !q.hasAcceptedAnswer)
      filteredQuestions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      break
    case 'active':
      filteredQuestions.sort((a, b) => b.answerCount - a.answerCount)
      break
    default: // recent
      filteredQuestions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  if (filteredQuestions.length === 0) {
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
        <span>{filteredQuestions.length} questions</span>
      </div>

      {filteredQuestions.map((question) => (
        <Card key={question.id} className="transition-all hover:border-primary/50 hover:shadow-md">
          <CardContent className="py-4">
            <div className="flex gap-4">
              {/* Stats Column */}
              <div className="hidden flex-col gap-2 sm:flex">
                <div
                  className={cn(
                    'flex flex-col items-center justify-center rounded-lg border px-3 py-2',
                    question.voteScore > 30
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-border'
                  )}
                >
                  <ArrowUp className="size-4 text-primary" />
                  <span className="text-sm font-semibold">{question.voteScore}</span>
                  <span className="text-[10px] text-muted-foreground">votes</span>
                </div>
                <div
                  className={cn(
                    'flex flex-col items-center justify-center rounded-lg border px-3 py-2',
                    question.hasAcceptedAnswer
                      ? 'border-success/30 bg-success/5 text-success'
                      : 'border-border'
                  )}
                >
                  <MessageCircle className="size-4" />
                  <span className="text-sm font-semibold">{question.answerCount}</span>
                  <span className="text-[10px] text-muted-foreground">answers</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-start gap-2">
                  <Badge
                    variant="secondary"
                    className={cn('text-xs capitalize', CATEGORY_STYLES[question.category])}
                  >
                    {question.category}
                  </Badge>
                  {question.hasAcceptedAnswer && (
                    <Badge variant="secondary" className="gap-1 bg-success/20 text-success">
                      <Check className="size-3" />
                      Answered
                    </Badge>
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

                {/* Bible References */}
                {question.bibleReferences.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {question.bibleReferences.map((ref) => (
                      <Badge key={ref} variant="outline" className="bg-accent/20 text-xs">
                        {ref}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {question.tags.slice(0, 4).map((tag) => (
                    <Link key={tag} href={`/questions?tag=${tag.toLowerCase()}`}>
                      <Badge variant="outline" className="text-xs font-normal hover:bg-muted">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                  {question.tags.length > 4 && (
                    <Badge variant="outline" className="text-xs font-normal">
                      +{question.tags.length - 4}
                    </Badge>
                  )}
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-sm text-muted-foreground">
                  <Link href={`/users/${question.author.id}`} className="flex items-center gap-2 hover:text-foreground">
                    <Avatar className="size-5">
                      <AvatarImage src={question.author.image ?? ''} />
                      <AvatarFallback className="text-[10px]">
                        {question.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{question.author.name}</span>
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                      Lvl {question.author.level}
                    </span>
                  </Link>

                  <div className="flex items-center gap-1">
                    <Clock className="size-4" />
                    <span>{formatTimeAgo(question.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Eye className="size-4" />
                    <span>{question.viewCount} views</span>
                  </div>

                  {/* Mobile stats */}
                  <div className="flex items-center gap-3 sm:hidden">
                    <div className="flex items-center gap-1">
                      <ArrowUp className="size-4" />
                      <span>{question.voteScore}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="size-4" />
                      <span>{question.answerCount}</span>
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

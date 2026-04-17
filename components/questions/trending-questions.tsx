import Link from 'next/link'
import { MessageCircle, ArrowUp, Check, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Sample data - in production, this would come from the database
const SAMPLE_QUESTIONS = [
  {
    id: '1',
    title: 'What does it mean to be "born again" according to John 3?',
    category: 'theological',
    author: { name: 'Sarah M.', image: null },
    voteScore: 42,
    answerCount: 8,
    hasAcceptedAnswer: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    tags: ['John', 'Salvation', 'New Testament'],
  },
  {
    id: '2',
    title: 'How should Christians approach the concept of predestination?',
    category: 'theological',
    author: { name: 'David K.', image: null },
    voteScore: 38,
    answerCount: 15,
    hasAcceptedAnswer: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    tags: ['Predestination', 'Doctrine', 'Calvinism'],
  },
  {
    id: '3',
    title: 'What are practical ways to incorporate daily Bible reading into a busy schedule?',
    category: 'practical',
    author: { name: 'Emily R.', image: null },
    voteScore: 31,
    answerCount: 12,
    hasAcceptedAnswer: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    tags: ['Devotional', 'Habits', 'Bible Study'],
  },
  {
    id: '4',
    title: 'What is the historical context of the book of Revelation?',
    category: 'historical',
    author: { name: 'Michael T.', image: null },
    voteScore: 27,
    answerCount: 6,
    hasAcceptedAnswer: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    tags: ['Revelation', 'Prophecy', 'History'],
  },
  {
    id: '5',
    title: 'How do I find peace during times of anxiety according to Scripture?',
    category: 'devotional',
    author: { name: 'Anna L.', image: null },
    voteScore: 45,
    answerCount: 18,
    hasAcceptedAnswer: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    tags: ['Peace', 'Anxiety', 'Psalms'],
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

export function TrendingQuestions() {
  return (
    <div className="space-y-4">
      {SAMPLE_QUESTIONS.map((question) => (
        <Link key={question.id} href={`/questions/${question.id}`}>
          <Card className="transition-all hover:border-primary/50 hover:shadow-md">
            <CardContent className="py-4">
              <div className="flex gap-4">
                {/* Vote Score */}
                <div className="hidden flex-col items-center gap-1 sm:flex">
                  <div
                    className={cn(
                      'flex size-12 flex-col items-center justify-center rounded-lg border',
                      question.voteScore > 30
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-border'
                    )}
                  >
                    <ArrowUp className="size-4 text-primary" />
                    <span className="text-sm font-semibold">{question.voteScore}</span>
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

                  <h3 className="font-medium leading-snug hover:text-primary">
                    {question.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-5">
                        <AvatarImage src={question.author.image ?? ''} />
                        <AvatarFallback className="text-[10px]">
                          {question.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{question.author.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MessageCircle className="size-4" />
                      <span>
                        {question.answerCount} answer{question.answerCount !== 1 && 's'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="size-4" />
                      <span>{formatTimeAgo(question.createdAt)}</span>
                    </div>

                    {/* Mobile vote score */}
                    <div className="flex items-center gap-1 sm:hidden">
                      <ArrowUp className="size-4" />
                      <span>{question.voteScore}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {question.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs font-normal">
                        {tag}
                      </Badge>
                    ))}
                    {question.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs font-normal">
                        +{question.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

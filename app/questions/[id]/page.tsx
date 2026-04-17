import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowUp,
  ArrowDown,
  Check,
  Clock,
  Eye,
  Bookmark,
  Share2,
  Flag,
  MessageCircle,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AnswerForm } from '@/components/questions/answer-form'
import { AnswerCard } from '@/components/questions/answer-card'
import { cn } from '@/lib/utils'

// Sample data - in production, this would come from the database
const SAMPLE_QUESTION = {
  id: '1',
  title: 'What does it mean to be "born again" according to John 3?',
  content: `I have been reading John 3 and I am trying to understand what Jesus meant when he told Nicodemus that he must be "born again."

Nicodemus was a Pharisee and a member of the Sanhedrin, so he was clearly a religious and educated man. Yet Jesus told him that he needed to be born again to enter the kingdom of God.

Some questions I have:
1. What exactly does "born again" mean?
2. Is this a one-time event or an ongoing process?
3. How does this relate to baptism?
4. What are the signs that someone has been born again?

I would appreciate any insights from Scripture and how different denominations understand this passage.`,
  category: 'theological' as const,
  author: {
    id: 'u1',
    name: 'Sarah M.',
    image: null,
    level: 5,
    points: 1250,
    bio: 'Passionate about studying Scripture and growing in faith.',
  },
  voteScore: 42,
  viewCount: 234,
  hasAcceptedAnswer: true,
  acceptedAnswerId: 'a1',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  tags: ['John', 'Salvation', 'New Testament', 'Nicodemus'],
  bibleReferences: ['John 3:3-7', 'John 3:16', '1 Peter 1:23'],
}

const SAMPLE_ANSWERS = [
  {
    id: 'a1',
    content: `Great question! The concept of being "born again" (Greek: γεννηθῇ ἄνωθεν) is one of the most important teachings in Christianity.

**What does "born again" mean?**

The phrase can be translated as "born again" or "born from above." Jesus uses this term to describe a spiritual rebirth - a transformation of the heart and soul that happens when someone truly accepts Christ as their Savior.

In John 3:5-6, Jesus clarifies: "Unless one is born of water and the Spirit, he cannot enter the kingdom of God. That which is born of the flesh is flesh, and that which is born of the Spirit is spirit."

**Is this a one-time event?**

Theologically, the new birth is a one-time event - the moment of regeneration when the Holy Spirit transforms us. However, sanctification (the process of becoming more Christ-like) is ongoing throughout our lives.

**Relation to baptism**

Christians interpret "born of water" differently:
- Some see it as referring to physical birth (amniotic fluid)
- Others connect it to baptism
- Still others link it to the cleansing work of God's Word

**Signs of being born again**

1 John gives us several indicators:
- Belief that Jesus is the Christ (1 John 5:1)
- Love for other believers (1 John 3:14)
- Overcoming the world (1 John 5:4)
- Practice of righteousness (1 John 2:29)

The transformation is both instantaneous (in terms of our position before God) and progressive (in terms of our daily walk).`,
    author: {
      id: 'u2',
      name: 'Pastor James',
      image: null,
      level: 15,
      points: 12450,
    },
    voteScore: 28,
    isAccepted: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
    bibleReferences: ['John 3:5-6', '1 John 5:1', '1 John 3:14'],
  },
  {
    id: 'a2',
    content: `I want to add some historical context to Pastor James' excellent answer.

Nicodemus would have understood birth as a powerful metaphor. In Jewish thought, there were several "rebirths":
- When a Gentile converted to Judaism
- When a man was crowned king
- When someone was ordained as a rabbi

So when Jesus said Nicodemus must be born again, it was shocking because Nicodemus already had all these qualifications! Jesus was saying that none of his religious achievements were enough - he needed something completely new.

This is why Jesus emphasizes being "born of the Spirit." It's not about human effort or religious merit. It's about God's transformative work in us.

The Gospel of John repeatedly contrasts the earthly and heavenly, the physical and spiritual. This passage is a perfect example of that theme.`,
    author: {
      id: 'u3',
      name: 'Dr. Thomas W.',
      image: null,
      level: 12,
      points: 8340,
    },
    voteScore: 15,
    isAccepted: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    bibleReferences: ['John 3:1-2'],
  },
]

const CATEGORY_STYLES = {
  theological: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  practical: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  historical: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  devotional: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // In production, fetch question from DB
  if (id !== '1') return { title: 'Question Not Found' }
  return {
    title: SAMPLE_QUESTION.title,
    description: SAMPLE_QUESTION.content.slice(0, 160),
  }
}

export default async function QuestionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  // In production, fetch question from DB
  if (id !== '1') {
    notFound()
  }

  const question = SAMPLE_QUESTION
  const answers = SAMPLE_ANSWERS

  return (
    <div className="container px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Question Header */}
        <div className="mb-6">
          <div className="mb-4 flex flex-wrap items-start gap-2">
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

          <h1 className="mb-4 font-serif text-2xl font-bold md:text-3xl">
            {question.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="size-4" />
              <span>Asked {formatDate(question.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="size-4" />
              <span>{question.viewCount} views</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="size-4" />
              <span>{answers.length} answers</span>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Question Content */}
        <div className="mb-8 flex gap-6">
          {/* Voting */}
          <div className="hidden flex-col items-center gap-2 sm:flex">
            <Button variant="ghost" size="icon">
              <ArrowUp className="size-5" />
            </Button>
            <span className="text-xl font-semibold">{question.voteScore}</span>
            <Button variant="ghost" size="icon">
              <ArrowDown className="size-5" />
            </Button>
            <Separator className="my-2" />
            <Button variant="ghost" size="icon">
              <Bookmark className="size-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="prose prose-stone dark:prose-invert max-w-none">
              {question.content.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Bible References */}
            {question.bibleReferences.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <BookOpen className="size-4 text-primary" />
                  Bible References
                </h4>
                <div className="flex flex-wrap gap-2">
                  {question.bibleReferences.map((ref) => (
                    <Badge key={ref} variant="outline" className="bg-accent/20">
                      {ref}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <Link key={tag} href={`/questions?tag=${tag.toLowerCase()}`}>
                  <Badge variant="outline" className="hover:bg-muted">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Author & Actions */}
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="gap-1">
                  <Share2 className="size-4" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Flag className="size-4" />
                  Report
                </Button>
              </div>

              <Card className="bg-primary/5">
                <CardContent className="flex items-center gap-3 p-3">
                  <Avatar className="size-10">
                    <AvatarImage src={question.author.image ?? ''} />
                    <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link href={`/users/${question.author.id}`} className="font-medium hover:text-primary">
                      {question.author.name}
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                        Level {question.author.level}
                      </span>
                      <span>{question.author.points.toLocaleString()} points</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile voting */}
            <div className="mt-6 flex items-center gap-4 sm:hidden">
              <Button variant="outline" size="sm" className="gap-1">
                <ArrowUp className="size-4" />
                {question.voteScore}
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Answers Section */}
        <section>
          <h2 className="mb-6 font-serif text-xl font-semibold">
            {answers.length} Answer{answers.length !== 1 && 's'}
          </h2>

          <div className="space-y-6">
            {answers.map((answer) => (
              <AnswerCard
                key={answer.id}
                answer={answer}
                isAccepted={answer.id === question.acceptedAnswerId}
                isQuestionAuthor={false}
              />
            ))}
          </div>

          {/* Answer Form */}
          <div className="mt-8">
            <h3 className="mb-4 font-serif text-lg font-semibold">Your Answer</h3>
            <AnswerForm questionId={question.id} />
          </div>
        </section>
      </div>
    </div>
  )
}

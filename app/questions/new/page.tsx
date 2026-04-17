'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, X, Plus, Send, Lightbulb, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CATEGORIES = [
  { value: 'theological', label: 'Theological', description: 'Doctrine, interpretation, theology' },
  { value: 'practical', label: 'Practical', description: 'Application, daily life, habits' },
  { value: 'historical', label: 'Historical', description: 'Context, history, archaeology' },
  { value: 'devotional', label: 'Devotional', description: 'Personal growth, prayer, meditation' },
]

const SUGGESTED_TAGS = [
  'Genesis', 'Exodus', 'Psalms', 'Proverbs', 'Isaiah', 'Matthew', 'Mark', 'Luke', 'John',
  'Romans', 'Revelation', 'Salvation', 'Grace', 'Faith', 'Love', 'Prayer', 'Holy Spirit',
  'Jesus', 'Prophecy', 'End Times', 'Marriage', 'Family', 'Wisdom', 'Forgiveness',
]

export default function NewQuestionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [tag, setTag] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [bibleReference, setBibleReference] = useState('')
  const [bibleReferences, setBibleReferences] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addTag = (newTag?: string) => {
    const tagToAdd = newTag ?? tag
    if (tagToAdd.trim() && !tags.includes(tagToAdd.trim()) && tags.length < 5) {
      setTags([...tags, tagToAdd.trim()])
      setTag('')
    }
  }

  const removeTag = (t: string) => {
    setTags(tags.filter((tag) => tag !== t))
  }

  const addBibleReference = () => {
    if (bibleReference.trim() && !bibleReferences.includes(bibleReference.trim())) {
      setBibleReferences([...bibleReferences, bibleReference.trim()])
      setBibleReference('')
    }
  }

  const removeBibleReference = (ref: string) => {
    setBibleReferences(bibleReferences.filter((r) => r !== ref))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !category || !session) return

    setIsSubmitting(true)
    
    // In production, this would submit to the API
    console.log('Submitting question:', {
      title,
      content,
      category,
      tags,
      bibleReferences,
    })
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    router.push('/questions')
  }

  if (status === 'loading') {
    return (
      <div className="container flex items-center justify-center px-4 py-16">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Sign in Required</CardTitle>
            <CardDescription>You need to sign in to ask a question</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login?callbackUrl=/questions/new">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/questions" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back to Questions
        </Link>

        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold">Ask a Question</h1>
          <p className="text-muted-foreground">
            Share your Bible study question with the community
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title">Question Title</Label>
                <Input
                  id="title"
                  placeholder="What would you like to know?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                  required
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Be specific and clear - titles like this get better answers
                </p>
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Details</Label>
                <Textarea
                  id="content"
                  placeholder="Provide context, what you've already learned, and what specifically you're struggling with..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="mt-1 resize-none"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div>
                          <div className="font-medium">{cat.label}</div>
                          <div className="text-xs text-muted-foreground">{cat.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div>
                <Label>Tags (up to 5)</Label>
                <div className="mt-1 flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    disabled={tags.length >= 5}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => addTag()}
                    disabled={tags.length >= 5}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <Badge key={t} variant="secondary" className="gap-1">
                        {t}
                        <button
                          type="button"
                          onClick={() => removeTag(t)}
                          className="ml-1 rounded-full hover:bg-background/50"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="mt-2">
                  <p className="mb-1 text-xs text-muted-foreground">Suggested:</p>
                  <div className="flex flex-wrap gap-1">
                    {SUGGESTED_TAGS.filter((t) => !tags.includes(t))
                      .slice(0, 10)
                      .map((t) => (
                        <Badge
                          key={t}
                          variant="outline"
                          className="cursor-pointer text-xs hover:bg-muted"
                          onClick={() => addTag(t)}
                        >
                          {t}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>

              {/* Bible References */}
              <div>
                <Label className="flex items-center gap-2">
                  <BookOpen className="size-4 text-primary" />
                  Bible References (optional)
                </Label>
                <div className="mt-1 flex gap-2">
                  <Input
                    placeholder="e.g., John 3:16"
                    value={bibleReference}
                    onChange={(e) => setBibleReference(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addBibleReference()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addBibleReference}>
                    <Plus className="size-4" />
                  </Button>
                </div>
                {bibleReferences.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {bibleReferences.map((ref) => (
                      <Badge key={ref} variant="secondary" className="gap-1 bg-accent/20">
                        {ref}
                        <button
                          type="button"
                          onClick={() => removeBibleReference(ref)}
                          className="ml-1 rounded-full hover:bg-background/50"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between border-t pt-6">
                <p className="text-xs text-muted-foreground">
                  You&apos;ll earn <span className="font-semibold text-primary">+5 points</span> for
                  asking a question
                </p>
                <Button
                  type="submit"
                  disabled={!title.trim() || !content.trim() || !category || isSubmitting}
                  className="gap-2"
                >
                  <Send className="size-4" />
                  {isSubmitting ? 'Posting...' : 'Post Question'}
                </Button>
              </div>
            </form>
          </div>

          {/* Tips Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lightbulb className="size-5 text-accent" />
                  Writing a Good Question
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Be specific</strong> - Ask about a particular
                  passage, concept, or situation
                </p>
                <p>
                  <strong className="text-foreground">Show your research</strong> - Share what
                  you&apos;ve already learned and where you&apos;re stuck
                </p>
                <p>
                  <strong className="text-foreground">Include context</strong> - Mention relevant
                  Bible verses and your current understanding
                </p>
                <p>
                  <strong className="text-foreground">Stay focused</strong> - Ask one question at a
                  time for clearer answers
                </p>
                <p>
                  <strong className="text-foreground">Be respectful</strong> - Remember that people
                  may have different interpretations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

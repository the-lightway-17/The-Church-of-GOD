'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { BookOpen, Send, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'

interface AnswerFormProps {
  questionId: string
}

export function AnswerForm({ questionId }: AnswerFormProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [bibleReference, setBibleReference] = useState('')
  const [bibleReferences, setBibleReferences] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    if (!content.trim() || !session) return

    setIsSubmitting(true)
    
    // In production, this would submit to the API
    console.log('Submitting answer:', {
      questionId,
      content,
      bibleReferences,
    })
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setContent('')
    setBibleReferences([])
  }

  if (!session) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="mb-4 text-muted-foreground">
            Sign in to share your answer and earn points
          </p>
          <Link href="/login">
            <Button>Sign In to Answer</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="answer-content" className="sr-only">
              Your Answer
            </Label>
            <Textarea
              id="answer-content"
              placeholder="Share your insights, experiences, or biblical knowledge..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="resize-none"
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Tip: Use **text** for bold and - for bullet points
            </p>
          </div>

          {/* Bible References */}
          <div>
            <Label className="mb-2 flex items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              Bible References (optional)
            </Label>
            <div className="flex gap-2">
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
                  <Badge key={ref} variant="secondary" className="gap-1">
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

          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-xs text-muted-foreground">
              You&apos;ll earn <span className="font-semibold text-primary">+10 points</span> for
              posting an answer
            </p>
            <Button type="submit" disabled={!content.trim() || isSubmitting} className="gap-2">
              <Send className="size-4" />
              {isSubmitting ? 'Posting...' : 'Post Answer'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

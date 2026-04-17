import { BookOpen, Share2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Sample verses - in production, this would come from the database
const SAMPLE_VERSES = [
  {
    reference: 'Philippians 4:13',
    text: 'I can do all things through Christ who strengthens me.',
    translation: 'NKJV',
  },
  {
    reference: 'Jeremiah 29:11',
    text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
    translation: 'NIV',
  },
  {
    reference: 'Psalm 23:1',
    text: 'The Lord is my shepherd; I shall not want.',
    translation: 'KJV',
  },
  {
    reference: 'Romans 8:28',
    text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    translation: 'NIV',
  },
  {
    reference: 'Isaiah 41:10',
    text: 'Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.',
    translation: 'ESV',
  },
]

function getDailyVerse() {
  // Use the day of the year to pick a consistent verse for the day
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
  return SAMPLE_VERSES[dayOfYear % SAMPLE_VERSES.length]
}

export function DailyVerseCard() {
  const verse = getDailyVerse()

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <CardContent className="py-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="size-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Verse of the Day
            </span>
          </div>
          <Button variant="ghost" size="icon-sm">
            <Share2 className="size-4" />
            <span className="sr-only">Share verse</span>
          </Button>
        </div>

        <blockquote className="mb-4">
          <p className="text-balance font-serif text-xl leading-relaxed md:text-2xl">
            &ldquo;{verse.text}&rdquo;
          </p>
        </blockquote>

        <footer className="flex items-center justify-between">
          <cite className="not-italic">
            <span className="font-semibold text-primary">{verse.reference}</span>
            <span className="ml-2 text-sm text-muted-foreground">({verse.translation})</span>
          </cite>
        </footer>
      </CardContent>
    </Card>
  )
}

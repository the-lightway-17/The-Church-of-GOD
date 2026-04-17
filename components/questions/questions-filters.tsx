'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { use } from 'react'

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'theological', label: 'Theological' },
  { value: 'practical', label: 'Practical' },
  { value: 'historical', label: 'Historical' },
  { value: 'devotional', label: 'Devotional' },
]

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'unanswered', label: 'Unanswered' },
  { value: 'active', label: 'Most Active' },
]

const POPULAR_TAGS = [
  'Genesis',
  'Salvation',
  'Prayer',
  'Faith',
  'Jesus',
  'Holy Spirit',
  'Prophecy',
  'Wisdom',
  'Paul',
  'Psalms',
  'Grace',
  'Love',
]

interface QuestionsFiltersProps {
  searchParams: Promise<{ category?: string; tag?: string; sort?: string; page?: string }>
}

export function QuestionsFilters({ searchParams }: QuestionsFiltersProps) {
  const params = use(searchParams)
  const router = useRouter()
  const currentSearchParams = useSearchParams()

  const currentCategory = params.category ?? 'all'
  const currentSort = params.sort ?? 'recent'
  const currentTag = params.tag ?? ''

  function updateParams(key: string, value: string | null) {
    const newParams = new URLSearchParams(currentSearchParams.toString())
    if (value && value !== 'all') {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    newParams.delete('page') // Reset page when filters change
    router.push(`/questions?${newParams.toString()}`)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sort */}
        <div>
          <h4 className="mb-2 text-sm font-medium">Sort By</h4>
          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={currentSort === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateParams('sort', option.value)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Categories */}
        <div>
          <h4 className="mb-2 text-sm font-medium">Category</h4>
          <div className="flex flex-col gap-1">
            {CATEGORIES.map((category) => (
              <Button
                key={category.value}
                variant="ghost"
                size="sm"
                className={cn(
                  'justify-start',
                  currentCategory === category.value && 'bg-primary/10 text-primary'
                )}
                onClick={() => updateParams('category', category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Tags */}
        <div>
          <h4 className="mb-2 text-sm font-medium">Popular Tags</h4>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant={currentTag.toLowerCase() === tag.toLowerCase() ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer transition-colors',
                  currentTag.toLowerCase() === tag.toLowerCase()
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
                onClick={() =>
                  updateParams(
                    'tag',
                    currentTag.toLowerCase() === tag.toLowerCase() ? null : tag.toLowerCase()
                  )
                }
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {(currentCategory !== 'all' || currentSort !== 'recent' || currentTag) && (
          <>
            <Separator />
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => router.push('/questions')}
            >
              Clear all filters
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

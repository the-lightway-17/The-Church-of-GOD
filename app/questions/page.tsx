import { Suspense } from 'react'
import Link from 'next/link'
import { Plus, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuestionsList } from '@/components/questions/questions-list'
import { QuestionsFilters } from '@/components/questions/questions-filters'

export const metadata = {
  title: 'Questions',
  description: 'Browse and ask Bible study questions from our community',
}

export default function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; sort?: string; page?: string }>
}) {
  return (
    <div className="container px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Questions</h1>
          <p className="text-muted-foreground">
            Explore questions from the community or ask your own
          </p>
        </div>
        <Link href="/questions/new">
          <Button className="gap-2">
            <Plus className="size-4" />
            Ask Question
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-20">
            <div className="mb-4 flex items-center gap-2 lg:hidden">
              <Filter className="size-4" />
              <span className="font-medium">Filters</span>
            </div>
            <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
              <QuestionsFilters searchParams={searchParams} />
            </Suspense>
          </div>
        </aside>

        {/* Questions List */}
        <div className="lg:col-span-3">
          <Suspense
            fallback={
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
            }
          >
            <QuestionsList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

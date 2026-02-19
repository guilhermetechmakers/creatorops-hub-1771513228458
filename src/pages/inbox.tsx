import { Mail, ExternalLink, Inbox } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const mockThreads: Array<{
  id: string
  subject: string
  excerpt: string
  from: string
}> = [
  {
    id: '1',
    subject: 'Brief: Q1 campaign assets',
    excerpt: 'Please review the attached...',
    from: 'client@example.com',
  },
  {
    id: '2',
    subject: 'Deadline reminder',
    excerpt: 'Your video is due Friday...',
    from: 'team@example.com',
  },
]

function InboxListSkeleton() {
  return (
    <div className="space-y-0" role="status" aria-label="Loading inbox threads">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-2 border-b border-border p-4 last:border-b-0"
        >
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-4 w-4 shrink-0 rounded" />
        </div>
      ))}
    </div>
  )
}

function InboxEmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center"
      role="status"
      aria-label="No inbox threads"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Inbox className="h-8 w-8 text-muted-foreground" aria-hidden />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        No threads yet
      </h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        Gmail threads will appear here when connected. Connect your Gmail account
        to surface relevant emails for your workflow.
      </p>
      <Button variant="outline" size="default" aria-label="Connect Gmail">
        Connect Gmail
      </Button>
    </div>
  )
}

export function InboxPage() {
  const isLoading = false
  const hasThreads = mockThreads.length > 0

  return (
    <div className="space-y-6 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
        <p className="text-muted-foreground">
          Gmail threads surfaced for your workflow
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="overflow-hidden border-border">
          <CardContent className="p-0">
            {isLoading ? (
              <InboxListSkeleton />
            ) : hasThreads ? (
              <ul className="divide-y divide-border" role="list">
                {mockThreads.map((t) => (
                  <li
                    key={t.id}
                    className="cursor-pointer p-4 transition-colors duration-200 hover:bg-secondary/30 focus-within:bg-secondary/20"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-foreground">
                          {t.subject}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {t.excerpt}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {t.from}
                        </div>
                      </div>
                      <ExternalLink
                        className="h-4 w-4 shrink-0 text-muted-foreground"
                        aria-hidden
                      />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <InboxEmptyState />
            )}
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-24">
            <Mail
              className="mb-4 h-12 w-12 text-muted-foreground"
              aria-hidden
            />
            <p className="text-muted-foreground">
              {hasThreads ? 'Select a thread to view' : 'Connect Gmail to get started'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

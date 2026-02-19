import { Mail, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const mockThreads = [
  { id: '1', subject: 'Brief: Q1 campaign assets', excerpt: 'Please review the attached...', from: 'client@example.com' },
  { id: '2', subject: 'Deadline reminder', excerpt: 'Your video is due Friday...', from: 'team@example.com' },
]

export function InboxPage() {
  return (
    <div className="space-y-6 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold">Inbox</h1>
        <p className="text-muted-foreground">
          Gmail threads surfaced for your workflow
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {mockThreads.map((t) => (
                <li key={t.id} className="cursor-pointer p-4 hover:bg-secondary/30">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{t.subject}</div>
                      <div className="text-sm text-muted-foreground">{t.excerpt}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{t.from}</div>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-24">
            <Mail className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Select a thread to view</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

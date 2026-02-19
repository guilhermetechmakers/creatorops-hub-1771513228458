import { Search, Plus, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const mockResearch = [
  { id: '1', topic: 'Creator economy trends 2025', sources: 8, summary: 'Key insights on...' },
  { id: '2', topic: 'Short-form video benchmarks', sources: 5, summary: 'Performance metrics...' },
]

export function ResearchPage() {
  return (
    <div className="space-y-6 animate-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Research Workspace</h1>
          <p className="text-muted-foreground">
            OpenClaw research outputs with captured sources
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New research
        </Button>
      </div>

      <div className="flex gap-4">
        <Input placeholder="Search research..." className="max-w-sm" />
        <Button variant="outline" size="icon">
          <Tag className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {mockResearch.map((r) => (
          <Card key={r.id} className="cursor-pointer">
            <CardContent className="p-4">
              <div className="font-medium">{r.topic}</div>
              <p className="mt-1 text-sm text-muted-foreground">{r.summary}</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Search className="h-4 w-4" />
                {r.sources} sources
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

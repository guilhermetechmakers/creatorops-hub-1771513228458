import { Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { OpenClawEmbeddedAgent } from '@/components/openclaw-embedded-agent'

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
      </div>

      <div className="flex gap-4">
        <Input placeholder="Search research..." className="max-w-sm" />
        <Button variant="outline" size="icon" aria-label="Filter by tag">
          <Tag className="h-4 w-4" />
        </Button>
      </div>

      <OpenClawEmbeddedAgent compact={false} />
    </div>
  )
}

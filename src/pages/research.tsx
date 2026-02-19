import { Link } from 'react-router-dom'
import { Tag, ChevronRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { OpenClawEmbeddedAgent } from '@/components/openclaw-embedded-agent'
import { cn } from '@/lib/utils'

export function ResearchPage() {

  return (
    <div className="space-y-6 animate-in-up">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Link
          to="/dashboard"
          className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
          aria-label="Navigate to Dashboard"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span
          className="font-medium text-foreground"
          aria-current="page"
        >
          Research
        </span>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Research Workspace
          </h1>
          <p className="text-muted-foreground">
            OpenClaw research outputs with captured sources
          </p>
        </div>
      </div>

      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardContent className="p-4">
          <form
            role="search"
            aria-label="Search research jobs and topics"
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex-1 space-y-2">
              <Label
                htmlFor="research-search"
                className="text-sm font-medium text-foreground"
              >
                Search research
              </Label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="research-search"
                  type="search"
                  placeholder="Search research jobs and topics..."
                  className={cn('w-full pl-9 sm:max-w-sm')}
                  aria-label="Search research jobs and topics"
                  aria-describedby="research-search-hint"
                />
              </div>
              <p
                id="research-search-hint"
                className="sr-only"
              >
                Type to filter or pre-fill your next research query
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Filter research by tag"
              title="Filter by tag"
              className="shrink-0"
            >
              <Tag className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>
        </CardContent>
      </Card>

      <OpenClawEmbeddedAgent compact={false} />
    </div>
  )
}

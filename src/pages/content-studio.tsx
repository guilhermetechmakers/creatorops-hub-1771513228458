import { useState, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Image, FileText, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const OpenClawEmbeddedAgent = lazy(
  () =>
    import('@/components/openclaw-embedded-agent').then((m) => ({
      default: m.OpenClawEmbeddedAgent,
    }))
)

function OpenClawLoadingFallback() {
  return (
    <div className="space-y-6 animate-in-up" role="status" aria-label="Loading OpenClaw research panel">
      <Card className="overflow-hidden border-border bg-card transition-all duration-300">
        <div className="border-b border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>
        <div className="space-y-4 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <Skeleton className="h-11 flex-1" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </Card>
      <span className="sr-only">Loading OpenClaw research panel...</span>
    </div>
  )
}

export function ContentStudioPage() {
  const [draftContent, setDraftContent] = useState('')
  const [showOpenClaw, setShowOpenClaw] = useState(false)
  const [linkedAssets] = useState<Array<{ id: string; name: string }>>([])

  const handleInsertOutput = (content: string) => {
    setDraftContent((prev) => (prev ? `${prev}\n\n${content}` : content))
  }

  const hasLinkedAssets = linkedAssets.length > 0

  return (
    <div className="space-y-6 animate-in-up">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" aria-hidden />
        <span className="text-foreground font-medium">Content Studio</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold">Content Studio</h1>
        <p className="text-muted-foreground">
          Drafting, iteration, and AI-assisted generation with provenance
        </p>
      </div>

      <Card className="border-border bg-card transition-all duration-300 hover:shadow-card-hover">
        <CardContent className="flex flex-col items-center justify-center py-24">
          <div className="mb-4 flex gap-2">
            <span className="rounded bg-secondary px-2 py-1 text-sm">Instagram</span>
            <span className="rounded bg-secondary px-2 py-1 text-sm">Draft</span>
          </div>
          <div className="mb-6 w-full max-w-2xl rounded-lg border border-border bg-background p-8">
            {draftContent ? (
              <p className="whitespace-pre-wrap text-foreground">{draftContent}</p>
            ) : (
              <p className="text-muted-foreground">
                Start typing or use OpenClaw to research and generate content...
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              aria-label="Attach images, videos, or documents to your content"
            >
              <Image className="mr-2 h-4 w-4" aria-hidden />
              Attach assets
            </Button>
            <Button
              onClick={() => setShowOpenClaw(!showOpenClaw)}
              className={cn(showOpenClaw && 'bg-primary/90')}
              aria-label={showOpenClaw ? 'Hide OpenClaw research panel' : 'Show OpenClaw research panel'}
              aria-expanded={showOpenClaw}
            >
              <Sparkles className="mr-2 h-4 w-4" aria-hidden />
              OpenClaw research
            </Button>
          </div>
        </CardContent>
      </Card>

      {showOpenClaw && (
        <Suspense fallback={<OpenClawLoadingFallback />}>
          <OpenClawEmbeddedAgent
            onInsertOutput={handleInsertOutput}
            compact={false}
          />
        </Suspense>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card
          className={cn(
            'border-border bg-card transition-all duration-300',
            hasLinkedAssets && 'cursor-pointer hover:border-accent/50 hover:shadow-card-hover'
          )}
          role="region"
          aria-label={hasLinkedAssets ? 'Linked assets - View and manage attached files' : 'Linked assets - No assets attached'}
        >
          <CardContent className="flex flex-col p-4">
            {hasLinkedAssets ? (
              <>
                <FileText className="mb-2 h-8 w-8 text-muted-foreground" aria-hidden />
                <div className="font-medium">Linked assets</div>
                <div className="text-sm text-muted-foreground">
                  {linkedAssets.length} attached
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-4 text-center">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary"
                  aria-hidden
                >
                  <Image className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium">Linked assets</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    No assets attached yet. Add images, videos, or documents to enrich your content.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  aria-label="Attach your first asset"
                >
                  <Image className="mr-2 h-4 w-4" aria-hidden />
                  Attach assets
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer border-border bg-card transition-all duration-300 hover:border-accent/50 hover:shadow-card-hover"
          onClick={() => setShowOpenClaw(true)}
          role="button"
          tabIndex={0}
          aria-label="Research - Link OpenClaw output to your draft"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setShowOpenClaw(true)
            }
          }}
        >
          <CardContent className="p-4">
            <Sparkles className="mb-2 h-8 w-8 text-muted-foreground" aria-hidden />
            <div className="font-medium">Research</div>
            <div className="text-sm text-muted-foreground">Link OpenClaw output</div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer border-border bg-card transition-all duration-300 hover:border-accent/50 hover:shadow-card-hover"
          role="button"
          tabIndex={0}
          aria-label="Version history - Autosave enabled"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
            }
          }}
        >
          <CardContent className="p-4">
            <FileText className="mb-2 h-8 w-8 text-muted-foreground" aria-hidden />
            <div className="font-medium">Version history</div>
            <div className="text-sm text-muted-foreground">Autosave enabled</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

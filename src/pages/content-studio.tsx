import { Sparkles, Image, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function ContentStudioPage() {
  return (
    <div className="space-y-6 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold">Content Studio</h1>
        <p className="text-muted-foreground">
          Drafting, iteration, and AI-assisted generation with provenance
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-24">
          <div className="mb-4 flex gap-2">
            <span className="rounded bg-secondary px-2 py-1 text-sm">Instagram</span>
            <span className="rounded bg-secondary px-2 py-1 text-sm">Draft</span>
          </div>
          <div className="mb-6 w-full max-w-2xl rounded-lg border border-border bg-background p-8">
            <p className="text-muted-foreground">
              Start typing or use OpenClaw to research and generate content...
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Image className="mr-2 h-4 w-4" />
              Attach assets
            </Button>
            <Button>
              <Sparkles className="mr-2 h-4 w-4" />
              OpenClaw research
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="cursor-pointer hover:border-accent/50">
          <CardContent className="p-4">
            <FileText className="mb-2 h-8 w-8 text-muted-foreground" />
            <div className="font-medium">Linked assets</div>
            <div className="text-sm text-muted-foreground">0 attached</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-accent/50">
          <CardContent className="p-4">
            <Sparkles className="mb-2 h-8 w-8 text-muted-foreground" />
            <div className="font-medium">Research</div>
            <div className="text-sm text-muted-foreground">Link OpenClaw output</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-accent/50">
          <CardContent className="p-4">
            <FileText className="mb-2 h-8 w-8 text-muted-foreground" />
            <div className="font-medium">Version history</div>
            <div className="text-sm text-muted-foreground">Autosave enabled</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Sparkles, Image, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { OpenClawEmbeddedAgent } from '@/components/openclaw-embedded-agent'

export function ContentStudioPage() {
  const [draftContent, setDraftContent] = useState('')
  const [showOpenClaw, setShowOpenClaw] = useState(false)

  const handleInsertOutput = (content: string) => {
    setDraftContent((prev) => (prev ? `${prev}\n\n${content}` : content))
  }

  return (
    <div className="space-y-6 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold">Content Studio</h1>
        <p className="text-muted-foreground">
          Drafting, iteration, and AI-assisted generation with provenance
        </p>
      </div>

      <Card className="transition-all duration-300 hover:shadow-card-hover">
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
            <Button variant="outline">
              <Image className="mr-2 h-4 w-4" />
              Attach assets
            </Button>
            <Button
              onClick={() => setShowOpenClaw(!showOpenClaw)}
              className={showOpenClaw ? 'bg-primary/90' : ''}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              OpenClaw research
            </Button>
          </div>
        </CardContent>
      </Card>

      {showOpenClaw && (
        <OpenClawEmbeddedAgent
          onInsertOutput={handleInsertOutput}
          compact={false}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="cursor-pointer transition-all duration-300 hover:border-accent/50 hover:shadow-card-hover">
          <CardContent className="p-4">
            <FileText className="mb-2 h-8 w-8 text-muted-foreground" />
            <div className="font-medium">Linked assets</div>
            <div className="text-sm text-muted-foreground">0 attached</div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer transition-all duration-300 hover:border-accent/50 hover:shadow-card-hover"
          onClick={() => setShowOpenClaw(true)}
        >
          <CardContent className="p-4">
            <Sparkles className="mb-2 h-8 w-8 text-muted-foreground" />
            <div className="font-medium">Research</div>
            <div className="text-sm text-muted-foreground">Link OpenClaw output</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-all duration-300 hover:border-accent/50 hover:shadow-card-hover">
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

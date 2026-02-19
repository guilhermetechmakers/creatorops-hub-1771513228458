import { Youtube, BarChart3, Video, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IntegrationCard } from './IntegrationCard'

export function YouTubeIntegrationCard() {
  return (
    <IntegrationCard
      title="YouTube Data"
      description="Analytics, video metadata, and publishing insights"
      icon={<Youtube className="h-5 w-5 text-muted-foreground" aria-hidden />}
      status="disconnected"
      actions={
        <Button
          variant="outline"
          size="sm"
          disabled
          className="text-muted-foreground transition-transform hover:scale-[1.02]"
          aria-label="YouTube integration coming soon"
        >
          Coming soon
        </Button>
      }
    >
      <div
        className="rounded-lg border border-border bg-card/50 p-4"
        role="region"
        aria-label="YouTube integration planned features"
      >
        <h4 className="mb-2 text-sm font-medium text-foreground">
          Coming soon
        </h4>
        <p className="mb-3 text-sm text-muted-foreground">
          YouTube analytics, video metadata, and publishing insights will be available in a future update.
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground" aria-label="Planned features">
          <li className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            Video analytics and performance metrics
          </li>
          <li className="flex items-center gap-2">
            <Video className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            Video metadata and thumbnails
          </li>
          <li className="flex items-center gap-2">
            <Upload className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            Publishing insights and scheduling
          </li>
        </ul>
      </div>
    </IntegrationCard>
  )
}

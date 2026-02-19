import { Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IntegrationCard } from './IntegrationCard'

export function YouTubeIntegrationCard() {
  return (
    <IntegrationCard
      title="YouTube Data"
      description="Analytics, video metadata, and publishing insights"
      icon={<Youtube className="h-6 w-6 text-muted-foreground" />}
      status="disconnected"
      actions={
        <Button
          variant="outline"
          size="sm"
          disabled
          className="opacity-70"
          aria-label="YouTube integration coming soon"
        >
          Coming soon
        </Button>
      }
    />
  )
}

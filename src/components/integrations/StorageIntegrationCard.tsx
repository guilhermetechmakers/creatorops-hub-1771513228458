import { HardDrive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IntegrationCard } from './IntegrationCard'

export function StorageIntegrationCard() {
  return (
    <IntegrationCard
      title="Storage & Connectors"
      description="File sync and storage connectors for assets"
      icon={<HardDrive className="h-6 w-6 text-muted-foreground" />}
      status="disconnected"
      actions={
        <Button variant="outline" size="sm" disabled className="opacity-70">
          Coming soon
        </Button>
      }
    />
  )
}

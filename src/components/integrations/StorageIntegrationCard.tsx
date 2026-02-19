import { HardDrive, Database, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IntegrationCard } from './IntegrationCard'

export function StorageIntegrationCard() {
  return (
    <IntegrationCard
      title="Storage & Connectors"
      description="File sync and storage connectors for assets"
      icon={<HardDrive className="h-5 w-5 text-muted-foreground" />}
      status="disconnected"
      actions={
        <Button
          variant="outline"
          size="sm"
          disabled
          className="opacity-70 transition-transform hover:scale-[1.02]"
        >
          Coming soon
        </Button>
      }
    >
      <div className="rounded-lg border border-border bg-card/50 p-4">
        <h4 className="mb-2 text-sm font-medium">Coming soon</h4>
        <p className="mb-3 text-sm text-muted-foreground">
          File sync and storage connectors will be available in a future update.
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground" aria-label="Planned features">
          <li className="flex items-center gap-2">
            <Database className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            Cloud storage connectors
          </li>
          <li className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            Asset sync and versioning
          </li>
        </ul>
      </div>
    </IntegrationCard>
  )
}

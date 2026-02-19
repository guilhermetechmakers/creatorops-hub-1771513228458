import { useState } from 'react'
import { Plug, Instagram, Twitter, Cloud } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import {
  GoogleIntegrationCard,
  YouTubeIntegrationCard,
  StorageIntegrationCard,
  IntegrationStubCard,
  IntegrationHealthPanel,
  IntegrationAuditLog,
} from '@/components/integrations'
import { getSyncLogs, getAuditLogs } from '@/services/integrations-service'
import { useAuth } from '@/hooks/use-auth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function IntegrationsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('integrations')

  const { data: syncLogs = [] } = useQuery({
    queryKey: ['integration-sync-all'],
    queryFn: async () => {
      const { logs } = await getSyncLogs()
      return logs
    },
    enabled: !!user?.id,
  })

  const {
    data: auditLogs = [],
    isLoading: auditLoading,
    isError: auditError,
    error: auditQueryError,
    refetch: refetchAuditLogs,
  } = useQuery({
    queryKey: ['integration-audit'],
    queryFn: async () => {
      const { logs, error } = await getAuditLogs(50)
      if (error) throw error
      return logs
    },
    enabled: !!user?.id,
  })

  const healthIssues = syncLogs
    .filter((log) => log.error_message)
    .map((log) => ({
      id: log.id,
      integrationType: log.integration_type,
      message: log.error_message ?? 'Unknown error',
      severity: 'error' as const,
      timestamp: log.updated_at,
    }))

  const lastSyncByType: Record<string, string> = {}
  syncLogs.forEach((log) => {
    if (log.last_sync_at) {
      lastSyncByType[log.integration_type] = log.last_sync_at
    }
  })

  return (
    <div className="space-y-8 animate-in-up" role="main" aria-labelledby="integrations-heading" aria-describedby="integrations-description">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold" id="integrations-heading">
          <Plug className="h-7 w-7 text-muted-foreground" aria-hidden />
          Integrations
        </h1>
        <p className="mt-1 text-muted-foreground" id="integrations-description">
          Connect and manage third-party integrations. View sync health, reconnect, or disconnect
          with safe revocation.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3" aria-label="Integrations page tabs">
          <TabsTrigger value="integrations" aria-label="View connected integrations">
            Integrations
          </TabsTrigger>
          <TabsTrigger value="health" aria-label="View integration health status">
            Health
          </TabsTrigger>
          <TabsTrigger value="audit" aria-label="View integration audit log">
            Audit Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-8">
          <section aria-labelledby="connected-services-heading">
            <h2 id="connected-services-heading" className="mb-4 text-lg font-semibold">Connected services</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <GoogleIntegrationCard />
              <YouTubeIntegrationCard />
              <StorageIntegrationCard />
            </div>
          </section>

          <section aria-labelledby="coming-soon-heading">
            <h2 id="coming-soon-heading" className="mb-4 text-lg font-semibold">Coming soon</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <IntegrationStubCard
                title="Instagram"
                description="Content & insights from Instagram"
                icon={<Instagram className="h-6 w-6 text-muted-foreground" />}
              />
              <IntegrationStubCard
                title="X (Twitter)"
                description="Posts and analytics from X"
                icon={<Twitter className="h-6 w-6 text-muted-foreground" />}
              />
              <IntegrationStubCard
                title="Dropbox"
                description="File sync and storage"
                icon={<Cloud className="h-6 w-6 text-muted-foreground" />}
              />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="health">
          <IntegrationHealthPanel
            issues={healthIssues}
            lastSyncByType={Object.keys(lastSyncByType).length > 0 ? lastSyncByType : undefined}
            onEmptyAction={() => setActiveTab('integrations')}
          />
        </TabsContent>

        <TabsContent value="audit">
          <IntegrationAuditLog
            logs={auditLogs}
            isLoading={auditLoading}
            isError={auditError}
            errorMessage={auditQueryError instanceof Error ? auditQueryError.message : undefined}
            onEmptyAction={() => setActiveTab('integrations')}
            onRetry={() => refetchAuditLogs()}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

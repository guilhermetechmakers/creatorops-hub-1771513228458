import { Activity, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface HealthIssue {
  id: string
  integrationType: string
  message: string
  severity: 'error' | 'warning'
  timestamp: string
}

export interface IntegrationHealthPanelProps {
  issues: HealthIssue[]
  lastSyncByType?: Record<string, string>
  className?: string
}

export function IntegrationHealthPanel({
  issues,
  lastSyncByType = {},
  className,
}: IntegrationHealthPanelProps) {
  const hasErrors = issues.some((i) => i.severity === 'error')

  return (
    <Card className={cn('animate-in-up transition-all duration-300', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Integration Health</CardTitle>
          </div>
          {issues.length === 0 ? (
            <Badge variant="success" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              All healthy
            </Badge>
          ) : (
            <Badge variant={hasErrors ? 'accent' : 'warning'} className="gap-1">
              <AlertCircle className="h-3 w-3" />
              {issues.length} issue{issues.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <CardDescription>
          Sync status and connection issues across integrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        {issues.length === 0 ? (
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <p className="text-sm text-muted-foreground">
              No integration issues detected. All connected services are operating normally.
            </p>
            {Object.keys(lastSyncByType).length > 0 && (
              <div className="mt-4 space-y-2 border-t border-border pt-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Last sync times
                </p>
                {Object.entries(lastSyncByType).map(([type, time]) => (
                  <p key={type} className="text-sm">
                    <span className="capitalize">{type.replace(/_/g, ' ')}:</span>{' '}
                    {new Date(time).toLocaleString()}
                  </p>
                ))}
              </div>
            )}
          </div>
        ) : (
          <ul className="space-y-3" role="list">
            {issues.map((issue) => (
              <li
                key={issue.id}
                className={cn(
                  'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                  issue.severity === 'error'
                    ? 'border-accent/50 bg-accent/5'
                    : 'border-amber-500/30 bg-amber-500/5'
                )}
              >
                <AlertCircle
                  className={cn(
                    'h-4 w-4 shrink-0 mt-0.5',
                    issue.severity === 'error' ? 'text-accent' : 'text-amber-500'
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium capitalize">
                    {issue.integrationType.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm text-muted-foreground">{issue.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(issue.timestamp).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

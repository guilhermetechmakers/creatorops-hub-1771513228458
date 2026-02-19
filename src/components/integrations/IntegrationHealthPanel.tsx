import { Link } from 'react-router-dom'
import { Activity, AlertCircle, CheckCircle, Plug } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  /** Callback when user clicks the empty state CTA. Use to switch tabs or navigate. */
  onEmptyAction?: () => void
}

export function IntegrationHealthPanel({
  issues,
  lastSyncByType = {},
  className,
  onEmptyAction,
}: IntegrationHealthPanelProps) {
  const hasErrors = issues.some((i) => i.severity === 'error')

  return (
    <Card
      className={cn('animate-in-up border-border bg-card transition-all duration-300', className)}
      role="region"
      aria-labelledby="integration-health-heading"
    >
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            <h2
              id="integration-health-heading"
              className="font-semibold leading-none tracking-tight"
            >
              Integration Health
            </h2>
          </div>
          {issues.length === 0 ? (
            <Badge variant="success" className="w-fit gap-1">
              <CheckCircle className="h-3 w-3" aria-hidden />
              All healthy
            </Badge>
          ) : (
            <Badge variant={hasErrors ? 'accent' : 'warning'} className="w-fit gap-1">
              <AlertCircle className="h-3 w-3" aria-hidden />
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
          <div
            className="rounded-lg border border-border bg-muted/20 p-4 sm:p-6"
            role="status"
            aria-label="No integration issues detected"
          >
            <p className="text-sm text-muted-foreground">
              No integration issues detected. All connected services are operating normally.
            </p>
            {Object.keys(lastSyncByType).length > 0 && (
              <div className="mt-4 space-y-2 border-t border-border pt-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
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
            <div className="mt-6">
              {onEmptyAction ? (
                <Button
                  variant="default"
                  size="default"
                  onClick={onEmptyAction}
                  aria-label="Go to integrations to connect or manage services"
                  className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Plug className="mr-2 h-4 w-4" aria-hidden />
                  View integrations
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="default"
                  asChild
                  aria-label="Go to integrations to connect or manage services"
                  className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Link to="/dashboard/integrations" className="inline-flex items-center">
                    <Plug className="mr-2 h-4 w-4" aria-hidden />
                    View integrations
                  </Link>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <ul className="space-y-3" role="list">
            {issues.map((issue) => (
              <li
                key={issue.id}
                className={cn(
                  'flex items-start gap-3 rounded-lg border p-3 transition-colors duration-200',
                  issue.severity === 'error'
                    ? 'border-accent/50 bg-accent/5'
                    : 'border-warning/30 bg-warning/5'
                )}
              >
                <AlertCircle
                  className={cn(
                    'mt-0.5 h-4 w-4 shrink-0',
                    issue.severity === 'error' ? 'text-accent' : 'text-warning'
                  )}
                  aria-hidden
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

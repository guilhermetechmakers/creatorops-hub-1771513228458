import { Link } from 'react-router-dom'
import { ClipboardList, Plug, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { IntegrationAuditLog as AuditLogType } from '@/types/database'
import { cn } from '@/lib/utils'

export interface IntegrationAuditLogProps {
  logs: AuditLogType[]
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  className?: string
  /** Callback when user clicks the empty state CTA. Use to switch to integrations tab or navigate. */
  onEmptyAction?: () => void
  /** Callback when user clicks retry in error state. */
  onRetry?: () => void
}

const actionLabels: Record<string, string> = {
  connect: 'Connected',
  disconnect: 'Disconnected',
  reconnect: 'Reconnected',
  error: 'Error',
  sync: 'Sync',
}

export function IntegrationAuditLog({
  logs,
  isLoading,
  isError,
  errorMessage,
  className,
  onEmptyAction,
  onRetry,
}: IntegrationAuditLogProps) {
  return (
    <Card
      className={cn(
        'animate-in-up rounded-2xl shadow-card transition-all duration-300',
        className
      )}
      role="region"
      aria-label="Integration audit log"
    >
      <CardHeader>
        <div className="flex items-center gap-2" aria-hidden="true">
          <ClipboardList className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <CardTitle>Audit Log</CardTitle>
        </div>
        <CardDescription>
          Recent integration actions for admin visibility
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div
            className="space-y-3"
            role="status"
            aria-live="polite"
            aria-label="Loading audit log"
            aria-busy="true"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <div
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-accent/50 bg-accent/5 py-12 px-4 text-center"
            role="alert"
            aria-label="Failed to load audit log"
          >
            <AlertCircle
              className="h-12 w-12 text-accent"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm font-medium text-foreground">
              Failed to load audit log
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {errorMessage ?? 'Something went wrong. Please try again.'}
            </p>
            {onRetry && (
              <Button
                variant="outline"
                size="default"
                className="mt-4"
                onClick={onRetry}
                aria-label="Retry loading audit log"
              >
                Retry
              </Button>
            )}
          </div>
        ) : logs.length === 0 ? (
          <div
            className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-muted/10 py-12 px-4 text-center shadow-sm"
            role="status"
            aria-label="No audit entries yet"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/30">
              <ClipboardList
                className="h-8 w-8 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <p className="mt-4 text-base font-medium text-foreground">
              No audit entries yet
            </p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Actions will appear here when you connect, disconnect, or sync integrations. Connect your first integration to get started.
            </p>
            {onEmptyAction ? (
              <Button
                variant="default"
                size="default"
                className="mt-6 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={onEmptyAction}
                aria-label="Connect an integration to see audit entries"
              >
                <Plug className="mr-2 h-4 w-4" aria-hidden="true" />
                Connect integrations
              </Button>
            ) : (
              <Button
                variant="default"
                size="default"
                className="mt-6 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                asChild
                aria-label="Go to integrations to connect services"
              >
                <Link to="/dashboard/integrations" className="inline-flex items-center">
                  <Plug className="mr-2 h-4 w-4" aria-hidden="true" />
                  Connect integrations
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div
            className="overflow-x-auto rounded-2xl border border-border shadow-sm"
            role="region"
            aria-label="Audit log table"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Integration</TableHead>
                  <TableHead scope="col">Action</TableHead>
                  <TableHead scope="col">Status</TableHead>
                  <TableHead scope="col">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="transition-colors hover:bg-secondary/50">
                    <TableCell className="font-medium capitalize">
                      {log.integration_type.replace(/_/g, ' ')}
                    </TableCell>
                    <TableCell>
                      {actionLabels[log.action] ?? log.action}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={log.status === 'success' ? 'success' : 'accent'}
                        className="text-xs"
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

import { ClipboardList } from 'lucide-react'
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
import { Skeleton } from '@/components/ui/skeleton'
import type { IntegrationAuditLog as AuditLogType } from '@/types/database'
import { cn } from '@/lib/utils'

export interface IntegrationAuditLogProps {
  logs: AuditLogType[]
  isLoading?: boolean
  className?: string
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
  className,
}: IntegrationAuditLogProps) {
  return (
    <Card className={cn('animate-in-up transition-all duration-300', className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Audit Log</CardTitle>
        </div>
        <CardDescription>
          Recent integration actions for admin visibility
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-12 text-center">
            <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              No audit entries yet. Actions will appear here when you connect or disconnect integrations.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Integration</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
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

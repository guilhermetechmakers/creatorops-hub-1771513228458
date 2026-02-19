import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type IntegrationCardStatus = 'connected' | 'disconnected' | 'error' | 'refreshing'

export interface IntegrationCardProps {
  title: string
  description: string
  icon: ReactNode
  status: IntegrationCardStatus
  lastSync?: string | null
  errorMessage?: string | null
  isRefreshing?: boolean
  actions: ReactNode
  children?: ReactNode
  className?: string
}

const statusConfig: Record<
  IntegrationCardStatus,
  { label: string; variant: 'success' | 'secondary' | 'accent' | 'warning' }
> = {
  connected: { label: 'Connected', variant: 'success' },
  disconnected: { label: 'Disconnected', variant: 'secondary' },
  error: { label: 'Error', variant: 'accent' },
  refreshing: { label: 'Refreshing', variant: 'warning' },
}

export function IntegrationCard({
  title,
  description,
  icon,
  status,
  lastSync,
  errorMessage,
  isRefreshing,
  actions,
  children,
  className,
}: IntegrationCardProps) {
  const config = statusConfig[status]

  return (
    <Card
      className={cn(
        'animate-in-up transition-all duration-300 hover:shadow-card-hover',
        status === 'error' && 'border-accent/50',
        className
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <Badge variant={config.variant} className="shrink-0">
            {isRefreshing ? 'Refreshing...' : config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {(lastSync || errorMessage) && (
          <div className="rounded-lg border border-border bg-card/50 p-4">
            {lastSync && (
              <p className="text-sm text-muted-foreground">
                Last sync: {new Date(lastSync).toLocaleString()}
              </p>
            )}
            {errorMessage && (
              <p className="mt-1 text-sm text-accent" role="alert">
                {errorMessage}
              </p>
            )}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
        {children}
      </CardContent>
    </Card>
  )
}

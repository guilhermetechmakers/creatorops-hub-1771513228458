import { useQuery } from '@tanstack/react-query'
import {
  Users,
  CreditCard,
  Shield,
  Activity,
  BarChart3,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchAdminStats } from '@/services/adminStatsService'
import { cn } from '@/lib/utils'

const CARD_SKELETON_COUNT = 4

function AdminStatsCardsSkeleton() {
  return (
    <>
      {Array.from({ length: CARD_SKELETON_COUNT }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-2 h-8 w-16" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </>
  )
}

function AdminEmptyState({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card
      className="border-dashed"
      role="status"
      aria-label="No admin stats available"
    >
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <BarChart3 className="h-8 w-8 text-muted-foreground" aria-hidden />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          No stats available
        </h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          Admin statistics are not available right now. This may be because the
          admin API is not configured or the service is temporarily unavailable.
        </p>
        {onRetry && (
          <Button
            variant="outline"
            size="default"
            onClick={onRetry}
            aria-label="Retry loading admin stats"
          >
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden />
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function AdminErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <Card
      className="border-destructive/30 bg-destructive/5"
      role="alert"
      aria-label="Error loading admin stats"
    >
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" aria-hidden />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Failed to load stats
        </h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">{message}</p>
        {onRetry && (
          <Button
            variant="outline"
            size="default"
            onClick={onRetry}
            aria-label="Retry loading admin stats"
          >
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden />
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function SystemHealthBadge({ status }: { status: string }) {
  const config = {
    healthy: {
      label: 'Healthy',
      className: 'text-success',
      bgClassName: 'bg-success/10',
    },
    degraded: {
      label: 'Degraded',
      className: 'text-warning',
      bgClassName: 'bg-warning/10',
    },
    error: {
      label: 'Error',
      className: 'text-destructive',
      bgClassName: 'bg-destructive/10',
    },
  } as const

  const c = config[status as keyof typeof config] ?? config.error
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-sm font-medium',
        c.bgClassName,
        c.className
      )}
    >
      {c.label}
    </span>
  )
}

export function AdminPage() {
  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
    retry: false,
  })

  const handleRetry = () => refetch()

  return (
    <div className="space-y-6 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Platform governance and support
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading || isRefetching ? (
          <AdminStatsCardsSkeleton />
        ) : isError ? (
          <div className="sm:col-span-2 lg:col-span-4">
            <AdminErrorState
              message={
                error instanceof Error ? error.message : 'An unexpected error occurred'
              }
              onRetry={handleRetry}
            />
          </div>
        ) : !stats ? (
          <div className="sm:col-span-2 lg:col-span-4">
            <AdminEmptyState onRetry={handleRetry} />
          </div>
        ) : (
          <>
            <Card className="transition-all duration-200 hover:shadow-card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  User management
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats.activeUsers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Active users</p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-200 hover:shadow-card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Workspace billing
                </CardTitle>
                <CreditCard
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats.paidWorkspaces.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Paid workspaces</p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-200 hover:shadow-card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Moderation queue
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats.pendingReview}
                </div>
                <p className="text-xs text-muted-foreground">Pending review</p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-200 hover:shadow-card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  System health
                </CardTitle>
                <Activity
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <SystemHealthBadge status={stats.systemHealth} />
                </div>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

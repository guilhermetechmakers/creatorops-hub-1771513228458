import { useQuery } from '@tanstack/react-query'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import {
  BarChart3,
  Clock,
  FileEdit,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getAnalytics } from '@/services/analyticsService'

const CARD_SKELETON_COUNT = 3

function AnalyticsMetricCardsSkeleton() {
  return (
    <>
      {Array.from({ length: CARD_SKELETON_COUNT }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-2 h-8 w-12" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </>
  )
}

function ChannelChartSkeleton() {
  return (
    <div className="h-[300px] w-full space-y-4 p-4">
      <div className="flex gap-4">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </div>
      <div className="flex items-end gap-2" style={{ height: '200px' }}>
        {[40, 70, 50, 90, 60, 80, 45].map((h, i) => (
          <Skeleton
            key={i}
            className="w-full flex-1"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  )
}

function AnalyticsEmptyState({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card
      className="border-dashed border-border"
      role="status"
      aria-label="No analytics data available"
    >
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <BarChart3
            className="h-8 w-8 text-muted-foreground"
            aria-hidden
          />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          No channel data yet
        </h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          Start publishing content across your channels to see analytics and
          engagement metrics here.
        </p>
        {onRetry && (
          <Button
            variant="outline"
            size="default"
            onClick={onRetry}
            aria-label="Retry loading analytics"
          >
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden />
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function AnalyticsErrorState({
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
      aria-label="Error loading analytics"
    >
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" aria-hidden />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Failed to load analytics
        </h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">{message}</p>
        {onRetry && (
          <Button
            variant="outline"
            size="default"
            onClick={onRetry}
            aria-label="Retry loading analytics"
          >
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden />
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function AnalyticsPage() {
  const {
    data: analytics,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['analytics'],
    queryFn: getAnalytics,
  })

  const handleRetry = () => refetch()
  const channelData = analytics?.channelData ?? []
  const hasChannelData = channelData.length > 0

  return (
    <div className="space-y-6 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Analytics & Reports
        </h1>
        <p className="mt-1 text-muted-foreground">
          Content impact and operational metrics
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading || isRefetching ? (
          <AnalyticsMetricCardsSkeleton />
        ) : isError ? (
          <div className="sm:col-span-2 lg:col-span-3">
            <AnalyticsErrorState
              message={
                error instanceof Error ? error.message : 'An unexpected error occurred'
              }
              onRetry={handleRetry}
            />
          </div>
        ) : analytics ? (
          <>
            <Card className="transition-all duration-200 hover:shadow-card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Posts published
                </CardTitle>
                <FileEdit className="h-4 w-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {analytics.summary.postsPublished}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics.summary.postsPublishedLabel}
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-200 hover:shadow-card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg. time-to-publish
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {analytics.summary.avgTimeToPublish}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics.summary.avgTimeToPublishTrend}
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-200 hover:shadow-card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Team productivity
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {analytics.summary.teamProductivity}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics.summary.teamProductivityLabel}
                </p>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      {/* Channel breakdown chart */}
      <Card className="transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="text-foreground">Channel breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || isRefetching ? (
            <ChannelChartSkeleton />
          ) : isError ? (
            <AnalyticsErrorState
              message={
                error instanceof Error ? error.message : 'An unexpected error occurred'
              }
              onRetry={handleRetry}
            />
          ) : !hasChannelData ? (
            <AnalyticsEmptyState onRetry={handleRetry} />
          ) : (
            <div className="h-[300px] min-h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData}>
                  <XAxis
                    dataKey="channel"
                    stroke="rgb(var(--muted-foreground))"
                    tick={{ fill: 'rgb(var(--muted-foreground))' }}
                  />
                  <YAxis
                    stroke="rgb(var(--muted-foreground))"
                    tick={{ fill: 'rgb(var(--muted-foreground))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(var(--card))',
                      border: '1px solid rgb(var(--border))',
                      borderRadius: '0.5rem',
                      color: 'rgb(var(--card-foreground))',
                    }}
                    labelStyle={{ color: 'rgb(var(--foreground))' }}
                  />
                  <Bar
                    dataKey="posts"
                    fill="rgb(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="engagement"
                    fill="rgb(var(--accent))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

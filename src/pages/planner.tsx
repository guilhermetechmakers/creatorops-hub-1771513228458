import { useQuery } from '@tanstack/react-query'
import {
  Calendar,
  LayoutList,
  AlertCircle,
  RefreshCw,
  GripVertical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { getPlannerPipeline } from '@/services/plannerService'

function PipelineStageSkeleton() {
  return (
    <Card className="min-w-[280px] flex-shrink-0 border-border bg-card">
      <CardContent className="p-4">
        <Skeleton className="mb-3 h-5 w-24" />
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}

function PlannerLoadingState() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <PipelineStageSkeleton key={i} />
      ))}
    </div>
  )
}

function PlannerEmptyState() {
  return (
    <Card
      className="border-dashed border-border bg-card"
      role="status"
      aria-label="No pipeline stages available"
    >
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <LayoutList
            className="h-8 w-8 text-muted-foreground"
            aria-hidden
          />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          No pipeline configured
        </h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          Your publishing pipeline will appear here. Add stages to organize your
          content from ideas to published.
        </p>
        <Button variant="outline" size="default" aria-label="Create pipeline">
          <LayoutList className="mr-2 h-4 w-4" aria-hidden />
          Set up pipeline
        </Button>
      </CardContent>
    </Card>
  )
}

function PlannerErrorState({
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
      aria-label="Error loading planner"
    >
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" aria-hidden />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Failed to load planner
        </h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">{message}</p>
        {onRetry && (
          <Button
            variant="outline"
            size="default"
            onClick={onRetry}
            aria-label="Retry loading planner"
          >
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden />
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

function StageColumnEmptyState() {
  return (
    <div
      className={cn(
        'flex min-h-[120px] flex-col items-center justify-center rounded-lg',
        'border border-dashed border-border bg-muted/30 p-6 text-center',
        'transition-colors duration-200 hover:border-border hover:bg-muted/50'
      )}
    >
      <GripVertical className="mb-2 h-6 w-6 text-muted-foreground" aria-hidden />
      <p className="text-sm font-medium text-muted-foreground">
        Drag content here
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        or create new from the editor
      </p>
    </div>
  )
}

export function PlannerPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['planner-pipeline'],
    queryFn: getPlannerPipeline,
  })

  const handleRetry = () => refetch()
  const stages = data?.stages ?? []
  const hasStages = stages.length > 0

  return (
    <div className="space-y-6 animate-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Publishing Planner</h1>
          <p className="text-muted-foreground">
            Editorial calendar and Kanban pipeline
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={isLoading}>
            <Calendar className="mr-2 h-4 w-4" aria-hidden />
            Calendar
          </Button>
          <Button disabled={isLoading}>
            <LayoutList className="mr-2 h-4 w-4" aria-hidden />
            Pipeline
          </Button>
        </div>
      </div>

      {isLoading ? (
        <PlannerLoadingState />
      ) : isError ? (
        <PlannerErrorState
          message={
            error instanceof Error ? error.message : 'An unexpected error occurred'
          }
          onRetry={handleRetry}
        />
      ) : !hasStages ? (
        <PlannerEmptyState />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <Card
              key={stage.id}
              className={cn(
                'min-w-[280px] flex-shrink-0 border-border bg-card',
                'transition-all duration-300 hover:shadow-card-hover'
              )}
            >
              <CardContent className="p-4">
                <div className="mb-3 font-medium text-foreground">{stage.name}</div>
                {stage.items.length === 0 ? (
                  <StageColumnEmptyState />
                ) : (
                  <div className="space-y-2">
                    {stage.items.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          'rounded-lg border border-border bg-card p-3',
                          'transition-all duration-200 hover:shadow-card'
                        )}
                      >
                        <div className="font-medium text-foreground truncate">
                          {item.title}
                        </div>
                        {item.channel && (
                          <div className="text-xs text-muted-foreground">
                            {item.channel}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

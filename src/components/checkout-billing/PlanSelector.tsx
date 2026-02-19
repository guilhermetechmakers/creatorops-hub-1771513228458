import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CreditCard, AlertCircle, RefreshCw } from 'lucide-react'

export interface Plan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  recommended?: boolean
}

const defaultPlans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    interval: 'month',
    features: ['5 projects', '1GB storage', 'Basic research'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    interval: 'month',
    features: ['Unlimited projects', '10GB storage', 'Full OpenClaw', 'Priority support'],
    recommended: true,
  },
  {
    id: 'team',
    name: 'Team',
    price: 99,
    interval: 'month',
    features: ['Everything in Pro', 'Team seats', 'Shared library', 'Admin controls'],
  },
]

export interface PlanSelectorProps {
  plans?: Plan[]
  selectedPlanId?: string
  onSelectPlan?: (plan: Plan) => void
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

const PLAN_SELECTOR_HEADING_ID = 'plan-selector-heading'

export function PlanSelector({
  plans = defaultPlans,
  selectedPlanId,
  onSelectPlan,
  isLoading = false,
  error = null,
  onRetry,
}: PlanSelectorProps) {
  if (isLoading) {
    return (
      <section
        className="space-y-4"
        aria-labelledby={PLAN_SELECTOR_HEADING_ID}
        aria-busy="true"
        aria-live="polite"
      >
        <h2
          id={PLAN_SELECTOR_HEADING_ID}
          className="text-lg font-semibold text-foreground sm:text-xl"
        >
          Select plan
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden border-border">
              <CardContent className="p-6">
                <Skeleton className="mb-4 h-4 w-24" />
                <Skeleton className="mb-2 h-8 w-16" />
                <div className="mt-4 space-y-2">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-3 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        className="space-y-4"
        aria-labelledby={PLAN_SELECTOR_HEADING_ID}
        aria-describedby="plan-selector-error"
      >
        <h2
          id={PLAN_SELECTOR_HEADING_ID}
          className="text-lg font-semibold text-foreground sm:text-xl"
        >
          Select plan
        </h2>
        <div
          id="plan-selector-error"
          className="flex flex-col items-center justify-center rounded-lg border border-border bg-card px-6 py-12 text-center"
          role="alert"
        >
          <AlertCircle
            className="mb-4 h-12 w-12 text-destructive"
            aria-hidden
          />
          <p className="mb-2 text-base font-medium text-foreground">
            Unable to load plans
          </p>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            {error}
          </p>
          {onRetry && (
            <Button
              variant="outline"
              onClick={onRetry}
              className="gap-2"
              aria-label="Retry loading plans"
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              Retry
            </Button>
          )}
        </div>
      </section>
    )
  }

  if (!plans || plans.length === 0) {
    return (
      <section
        className="space-y-4"
        aria-labelledby={PLAN_SELECTOR_HEADING_ID}
        aria-describedby="plan-selector-empty"
      >
        <h2
          id={PLAN_SELECTOR_HEADING_ID}
          className="text-lg font-semibold text-foreground sm:text-xl"
        >
          Select plan
        </h2>
        <div
          id="plan-selector-empty"
          className="flex flex-col items-center justify-center rounded-lg border border-border bg-card px-6 py-12 text-center"
        >
          <CreditCard
            className="mb-4 h-12 w-12 text-muted-foreground"
            aria-hidden
          />
          <p className="mb-2 text-base font-medium text-foreground">
            No plans available
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Subscription plans will be available soon. Please check back later or contact support for assistance.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      className="space-y-4"
      aria-labelledby={PLAN_SELECTOR_HEADING_ID}
    >
      <h2
        id={PLAN_SELECTOR_HEADING_ID}
        className="text-lg font-semibold text-foreground sm:text-xl"
      >
        Select plan
      </h2>
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        role="radiogroup"
        aria-label="Subscription plan selection"
      >
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id
          return (
            <Card
              key={plan.id}
              className={cn(
                'cursor-pointer border-border transition-all duration-300',
                'hover:scale-[1.02] hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                plan.recommended && 'border-accent ring-2 ring-accent/30',
                isSelected && 'ring-2 ring-primary'
              )}
              onClick={() => onSelectPlan?.(plan)}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${plan.name} plan, $${plan.price} per ${plan.interval === 'month' ? 'month' : 'year'}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectPlan?.(plan)
                }
              }}
            >
              <CardContent className="p-6">
                {plan.recommended && (
                  <span className="mb-2 block text-xs font-medium text-accent">
                    Recommended
                  </span>
                )}
                <div className="font-semibold text-foreground">{plan.name}</div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-foreground">
                    ${plan.price}
                  </span>
                  <span className="text-sm font-normal text-muted-foreground">
                    /{plan.interval === 'month' ? 'mo' : 'yr'}
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

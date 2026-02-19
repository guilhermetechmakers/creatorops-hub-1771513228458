import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

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
}

export function PlanSelector({
  plans = defaultPlans,
  selectedPlanId,
  onSelectPlan,
  isLoading = false,
}: PlanSelectorProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="font-semibold">Select plan</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="mb-4 h-4 w-24 rounded bg-muted" />
                <div className="mb-2 h-8 w-16 rounded bg-muted" />
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-3 w-full rounded bg-muted" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Select plan</h2>
      <div
        className="grid gap-4 sm:grid-cols-3"
        role="radiogroup"
        aria-label="Subscription plan selection"
      >
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id
          return (
            <Card
              key={plan.id}
              className={cn(
                'cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-card-hover',
                plan.recommended && 'border-accent ring-2 ring-accent/30',
                isSelected && 'ring-2 ring-primary'
              )}
              onClick={() => onSelectPlan?.(plan)}
              role="radio"
              aria-checked={isSelected}
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
                  <span className="mb-2 block text-xs font-medium text-accent">Recommended</span>
                )}
                <div className="font-semibold">{plan.name}</div>
                <div className="mt-2">
                  <span className="text-2xl font-bold">${plan.price}</span>
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
    </div>
  )
}

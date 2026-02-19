import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export interface SummaryAndCTAProps {
  planName?: string
  price?: number
  interval?: 'month' | 'year'
  discount?: number
  promoMessage?: string
  onCheckout?: () => void
  isLoading?: boolean
  hasError?: boolean
  errorMessage?: string
}

export function SummaryAndCTA({
  planName,
  price,
  interval = 'month',
  discount = 0,
  promoMessage,
  onCheckout,
  isLoading = false,
  hasError = false,
  errorMessage,
}: SummaryAndCTAProps) {
  const hasPlan = planName != null && price != null
  const subtotal = price ?? 0
  const total = Math.max(0, subtotal - discount)
  const cadence = interval === 'month' ? 'monthly' : 'yearly'
  const isDisabled = !hasPlan || isLoading

  return (
    <Card className="sticky top-24">
      <CardContent className="p-4 sm:p-6">
        <h3 className="mb-4 font-semibold text-card-foreground">
          Order summary
        </h3>

        {hasPlan ? (
          <>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{planName} plan</span>
                <span className="text-foreground">
                  ${subtotal.toFixed(2)}/{interval === 'month' ? 'mo' : 'yr'}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="my-4 border-t border-border pt-4">
              <div className="flex justify-between font-semibold text-foreground">
                <span>Total</span>
                <span>${total.toFixed(2)}/{interval === 'month' ? 'mo' : 'yr'}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Billed {cadence}. Cancel anytime.
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Select a plan to see your order summary
            </p>
          </div>
        )}

        {promoMessage && (
          <p className="mb-4 rounded-lg border border-accent/20 bg-accent/10 px-3 py-2 text-sm text-accent">
            {promoMessage}
          </p>
        )}

        {hasError && (
          <div
            className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {errorMessage ?? 'Something went wrong. Please try again.'}
          </div>
        )}

        <Button
          className="w-full transition-all duration-300 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={onCheckout}
          disabled={isDisabled}
          aria-label={
            isLoading
              ? 'Processing your purchase'
              : isDisabled
                ? 'Select a plan to complete purchase'
                : 'Complete purchase'
          }
          aria-busy={isLoading}
          aria-disabled={isDisabled}
        >
          {isLoading ? (
            <>
              <Loader2
                className="h-4 w-4 shrink-0 animate-spin"
                aria-hidden
              />
              <span>Processing...</span>
            </>
          ) : (
            'Complete purchase'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

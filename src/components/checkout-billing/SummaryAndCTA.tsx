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
}

export function SummaryAndCTA({
  planName = 'Pro',
  price = 49,
  interval = 'month',
  discount = 0,
  promoMessage,
  onCheckout,
  isLoading = false,
}: SummaryAndCTAProps) {
  const subtotal = price
  const total = Math.max(0, subtotal - discount)
  const cadence = interval === 'month' ? 'monthly' : 'yearly'

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <h3 className="mb-4 font-semibold">Order summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{planName} plan</span>
            <span>${subtotal.toFixed(2)}/{interval === 'month' ? 'mo' : 'yr'}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-accent">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
        </div>
        <div className="my-4 border-t border-border pt-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}/{interval === 'month' ? 'mo' : 'yr'}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Billed {cadence}. Cancel anytime.
          </p>
        </div>
        {promoMessage && (
          <p className="mb-4 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
            {promoMessage}
          </p>
        )}
        <Button
          className="w-full transition-all duration-300 hover:scale-[1.02]"
          onClick={onCheckout}
          disabled={isLoading}
          isLoading={isLoading}
        >
          Complete purchase
        </Button>
      </CardContent>
    </Card>
  )
}

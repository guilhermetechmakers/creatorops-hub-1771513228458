import { useState, useCallback } from 'react'
import {
  PlanSelector,
  PaymentForm,
  SummaryAndCTA,
  InvoiceHistoryLink,
  type Plan,
} from '@/components/checkout-billing'
import { apiPost } from '@/lib/api'
import { toast } from 'sonner'

const CHECKOUT_FORM_ID = 'checkout-form'

export function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [discount] = useState(0)
  const [promoMessage] = useState<string | undefined>()
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const handleSelectPlan = useCallback((plan: Plan) => {
    setSelectedPlan(plan)
    setCheckoutError(null)
  }, [])

  const handlePaymentSubmit = useCallback(
    async (data: {
      name: string
      email: string
      addressLine1: string
      addressLine2?: string
      city: string
      state?: string
      postalCode: string
      country: string
    }) => {
      if (!selectedPlan) return
      setIsCheckoutLoading(true)
      setCheckoutError(null)
      try {
        await apiPost('/checkout', {
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          price: selectedPlan.price,
          interval: selectedPlan.interval,
          ...data,
        })
        toast.success('Payment processed successfully')
      } catch (err) {
        const message =
          err && typeof err === 'object' && 'message' in err
            ? String((err as { message: string }).message)
            : 'Payment failed. Please try again.'
        setCheckoutError(message)
        toast.error(message)
      } finally {
        setIsCheckoutLoading(false)
      }
    },
    [selectedPlan]
  )

  return (
    <main
      className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-12 animate-in-up"
      role="main"
      aria-label="Checkout and billing"
    >
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Checkout & Billing
        </h1>
        <p className="text-muted-foreground">
          Plan purchase and subscription management
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <PlanSelector
            selectedPlanId={selectedPlan?.id}
            onSelectPlan={handleSelectPlan}
          />
          <PaymentForm
            formId={CHECKOUT_FORM_ID}
            onSubmit={handlePaymentSubmit}
          />
        </div>

        <aside
          className="space-y-4"
          aria-label="Order summary and checkout"
        >
          <SummaryAndCTA
            planName={selectedPlan?.name}
            price={selectedPlan?.price}
            interval={selectedPlan?.interval}
            discount={discount}
            promoMessage={promoMessage}
            formId={CHECKOUT_FORM_ID}
            isLoading={isCheckoutLoading}
            hasError={!!checkoutError}
            errorMessage={checkoutError ?? undefined}
          />
          <InvoiceHistoryLink />
        </aside>
      </div>
    </main>
  )
}

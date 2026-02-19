import { useState } from 'react'
import {
  PlanSelector,
  PaymentForm,
  SummaryAndCTA,
  InvoiceHistoryLink,
  type Plan,
} from '@/components/checkout-billing'

export function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [discount] = useState(0)
  const [promoMessage] = useState<string | undefined>()

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan)
  }

  const handleCheckout = () => {
    // Wire to Supabase Edge Function for payment processing
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold">Checkout & Billing</h1>
        <p className="text-muted-foreground">
          Plan purchase and subscription management
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <PlanSelector
            selectedPlanId={selectedPlan?.id}
            onSelectPlan={handleSelectPlan}
          />
          <PaymentForm />
        </div>

        <div className="space-y-4">
          <SummaryAndCTA
            planName={selectedPlan?.name}
            price={selectedPlan?.price}
            interval={selectedPlan?.interval}
            discount={discount}
            promoMessage={promoMessage}
            onCheckout={handleCheckout}
          />
          <InvoiceHistoryLink />
        </div>
      </div>
    </div>
  )
}

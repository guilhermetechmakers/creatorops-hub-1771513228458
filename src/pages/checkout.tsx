import { Link } from 'react-router-dom'
import { CreditCard, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const plans = [
  { name: 'Starter', price: 19, features: ['5 projects', '1GB storage'] },
  { name: 'Pro', price: 49, features: ['Unlimited projects', '10GB storage'], recommended: true },
  { name: 'Team', price: 99, features: ['Everything in Pro', 'Team seats'] },
]

export function CheckoutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-12 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold">Checkout & Billing</h1>
        <p className="text-muted-foreground">
          Plan purchase and management
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-semibold">Select plan</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`cursor-pointer ${plan.recommended ? 'border-accent' : ''}`}
              >
                <CardContent className="p-4">
                  {plan.recommended && (
                    <span className="mb-2 block text-xs font-medium text-accent">Recommended</span>
                  )}
                  <div className="font-semibold">{plan.name}</div>
                  <div className="text-2xl font-bold">${plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {plan.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment
            </CardTitle>
            <CardDescription>Stripe Elements payment form</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Coupon code</Label>
              <Input placeholder="Enter code" />
            </div>
            <div className="rounded-lg border border-border p-4 text-center text-sm text-muted-foreground">
              Payment form placeholder
            </div>
            <Link to="/dashboard/profile">
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Invoice history
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

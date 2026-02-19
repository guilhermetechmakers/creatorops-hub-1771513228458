import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement } from '@stripe/react-stripe-js'
import { CreditCard, Tag } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null

const billingSchema = z.object({
  couponCode: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
})

type BillingForm = z.infer<typeof billingSchema>

export interface PaymentFormProps {
  onCouponApply?: (code: string) => Promise<{ valid: boolean; message?: string }>
  onSubmit?: (data: BillingForm) => Promise<void>
  isLoading?: boolean
}

function CardInputPlaceholder() {
  return (
    <div
      className="flex h-12 w-full items-center rounded-lg border border-input bg-background px-3 py-2"
      aria-label="Card number input"
    >
      <CreditCard className="mr-2 h-5 w-5 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Card number, expiry, CVC</span>
    </div>
  )
}

function StripeCardInput() {
  return (
    <div
      className={cn(
        'rounded-lg border border-input bg-background px-3 py-2',
        '[&_.StripeElement]:min-h-[24px] [&_.StripeElement]:py-2'
      )}
    >
      <CardElement
        options={{
          style: {
            base: {
              color: 'rgb(var(--foreground))',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '16px',
              '::placeholder': { color: 'rgb(var(--muted-foreground))' },
            },
          },
        }}
      />
    </div>
  )
}

function CardInputSection() {
  if (!stripePromise) {
    return <CardInputPlaceholder />
  }
  return (
    <Elements stripe={stripePromise}>
      <StripeCardInput />
    </Elements>
  )
}

export function PaymentForm({
  onCouponApply,
  onSubmit,
  isLoading: _isLoading = false,
}: PaymentFormProps) {
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponLoading, setCouponLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: _isSubmitting },
  } = useForm<BillingForm>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      couponCode: '',
      name: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  })

  const handleCouponApply = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    try {
      const result = await onCouponApply?.(couponCode.trim())
      if (result?.valid) {
        setCouponApplied(true)
        toast.success('Coupon applied')
      } else {
        toast.error(result?.message ?? 'Invalid coupon code')
      }
    } catch {
      toast.error('Failed to apply coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  const onFormSubmit = async (data: BillingForm) => {
    try {
      await onSubmit?.(data)
      toast.success('Payment processed')
    } catch {
      toast.error('Payment failed')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" aria-hidden />
          Payment
        </CardTitle>
        <CardDescription>Secure payment with Stripe</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Coupon code */}
        <div className="space-y-2">
          <Label htmlFor="coupon">Coupon code</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="coupon"
                placeholder="Enter code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponApplied}
                className="pl-10"
                aria-label="Coupon code"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleCouponApply}
              disabled={couponLoading || couponApplied || !couponCode.trim()}
              isLoading={couponLoading}
            >
              {couponApplied ? 'Applied' : 'Apply'}
            </Button>
          </div>
        </div>

        {/* Card input - Stripe Elements */}
        <div className="space-y-2">
          <Label>Card details</Label>
          <CardInputSection />
        </div>

        {/* Billing info */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register('name')}
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="text-sm text-accent">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register('email')}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-sm text-accent">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address</Label>
            <Input
              id="addressLine1"
              placeholder="123 Main St"
              {...register('addressLine1')}
              aria-invalid={!!errors.addressLine1}
            />
            {errors.addressLine1 && (
              <p className="text-sm text-accent">{errors.addressLine1.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressLine2">Address line 2 (optional)</Label>
            <Input id="addressLine2" placeholder="Apt 4" {...register('addressLine2')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="San Francisco"
                {...register('city')}
                aria-invalid={!!errors.city}
              />
              {errors.city && <p className="text-sm text-accent">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State / Province</Label>
              <Input id="state" placeholder="CA" {...register('state')} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal code</Label>
              <Input
                id="postalCode"
                placeholder="94102"
                {...register('postalCode')}
                aria-invalid={!!errors.postalCode}
              />
              {errors.postalCode && (
                <p className="text-sm text-accent">{errors.postalCode.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="United States"
                {...register('country')}
                aria-invalid={!!errors.country}
              />
              {errors.country && (
                <p className="text-sm text-accent">{errors.country.message}</p>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

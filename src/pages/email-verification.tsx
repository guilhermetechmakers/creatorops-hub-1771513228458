import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Mail, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export function EmailVerificationPage() {
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const location = useLocation()
  const email = (location.state as { email?: string })?.email

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return
    setIsResending(true)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    })
    setIsResending(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Verification email sent')
    setResendCooldown(60)
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md animate-in-up">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Mail className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to your email. Please check your inbox and click the link to confirm your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            disabled={resendCooldown > 0 || isResending || !email}
            onClick={handleResend}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend verification email'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Need help? <Link to="/help" className="hover:text-foreground">Contact support</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

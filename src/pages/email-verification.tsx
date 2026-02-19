import { Link } from 'react-router-dom'
import { Mail, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function EmailVerificationPage() {
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
          <Button variant="outline" className="w-full" disabled>
            <RefreshCw className="mr-2 h-4 w-4" />
            Resend (rate-limited)
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Need help? <Link to="/help" className="hover:text-foreground">Contact support</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

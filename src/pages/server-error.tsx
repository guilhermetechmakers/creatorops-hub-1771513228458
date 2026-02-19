import { Link } from 'react-router-dom'
import { RefreshCw, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function ServerErrorPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md animate-in-up text-center">
        <CardContent className="flex flex-col items-center py-12">
          <div className="mb-4 text-6xl font-bold text-accent">500</div>
          <h1 className="mb-2 text-xl font-semibold">Something went wrong</h1>
          <p className="mb-6 text-muted-foreground">
            We&apos;re sorry, but something went wrong on our end. Please try again later.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
            <Button variant="outline" asChild>
              <Link to="/help">
                <HelpCircle className="mr-2 h-4 w-4" />
                Contact support
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

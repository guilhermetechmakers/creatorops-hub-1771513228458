import { Link } from 'react-router-dom'
import { Search, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md animate-in-up text-center">
        <CardContent className="flex flex-col items-center py-12">
          <div className="mb-4 text-6xl font-bold text-muted-foreground">404</div>
          <h1 className="mb-2 text-xl font-semibold">Page not found</h1>
          <p className="mb-6 text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mb-6 flex w-full max-w-xs gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10" />
            </div>
            <Button>Search</Button>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Go home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

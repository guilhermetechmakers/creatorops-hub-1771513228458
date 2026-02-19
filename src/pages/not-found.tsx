import { Link } from 'react-router-dom'
import { Search, Home, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function NotFoundPage() {
  return (
    <main
      role="main"
      aria-label="Page not found"
      className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 sm:py-16"
    >
      <Card
        className={cn(
          'w-full max-w-md animate-in-up text-center',
          'transition-all duration-300 hover:shadow-card-hover'
        )}
      >
        <CardContent className="flex flex-col items-center py-10 sm:py-12">
          <h2 className="mb-3 bg-gradient-to-br from-muted-foreground to-primary bg-clip-text text-5xl font-bold text-transparent sm:text-6xl">
            404
          </h2>
          <h1 className="mb-2 text-xl font-semibold text-foreground sm:text-2xl">
            Page not found
          </h1>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground sm:text-base">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mb-6 flex w-full max-w-xs flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                placeholder="Search..."
                className="pl-10"
                aria-label="Search for content"
              />
            </div>
            <Button className="shrink-0" aria-label="Search">
              Search
            </Button>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" aria-hidden />
                Go home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" aria-hidden />
                Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

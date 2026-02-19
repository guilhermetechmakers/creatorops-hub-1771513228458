import { useState, useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function PublicLayout() {
  const { user, isLoading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeMobileMenu()
      }
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', handleEscape)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const navLinks = !isLoading
    ? user
      ? [
          { to: '/dashboard', label: 'Dashboard', variant: 'ghost' as const },
          { to: '/dashboard/profile', label: 'Profile', variant: 'default' as const },
        ]
      : [
          { to: '/login', label: 'Log in', variant: 'ghost' as const },
          { to: '/signup', label: 'Get started', variant: 'default' as const },
        ]
    : []

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="font-bold text-lg text-foreground transition-colors hover:text-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
            aria-label="CreatorOps Hub - Go to home"
          >
            CreatorOps Hub
          </Link>

          {/* Desktop navigation */}
          <nav
            className="hidden md:flex items-center gap-4 lg:gap-6"
            aria-label="Main navigation"
          >
            {isLoading ? (
              <>
                <Skeleton className="h-9 w-20 rounded-lg" aria-hidden />
                <Skeleton className="h-9 w-24 rounded-lg" aria-hidden />
              </>
            ) : (
              navLinks.map(({ to, label, variant }) => (
                <Button
                  key={to}
                  variant={variant}
                  size="sm"
                  asChild
                >
                  <Link
                    to={to}
                    className={variant === 'ghost' ? 'text-muted-foreground hover:text-foreground' : ''}
                  >
                    {label}
                  </Link>
                </Button>
              ))
            )}
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </Button>
        </div>

        {/* Mobile navigation drawer */}
        <div
          id="mobile-nav"
          role="dialog"
          aria-label="Mobile navigation"
          aria-modal="true"
          aria-hidden={!mobileMenuOpen}
          className={cn(
            'fixed inset-0 z-40 md:hidden',
            !mobileMenuOpen && 'pointer-events-none'
          )}
        >
          {/* Backdrop */}
          <div
            className={cn(
              'absolute inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300',
              mobileMenuOpen ? 'opacity-100' : 'opacity-0'
            )}
            onClick={closeMobileMenu}
            aria-hidden
          />

          {/* Drawer panel */}
          <nav
            className={cn(
              'absolute top-16 right-0 bottom-0 w-full max-w-xs bg-background border-l border-border shadow-card',
              'flex flex-col gap-2 p-4 transition-transform duration-300 ease-out',
              mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            )}
            aria-label="Mobile navigation menu"
          >
            {isLoading ? (
              <div className="flex flex-col gap-3 pt-4">
                <Skeleton className="h-10 w-full rounded-lg" aria-hidden />
                <Skeleton className="h-10 w-full rounded-lg" aria-hidden />
              </div>
            ) : (
              navLinks.map(({ to, label, variant }) => (
                <Button
                  key={to}
                  variant={variant}
                  size="default"
                  asChild
                  className="w-full justify-start"
                >
                  <Link to={to} onClick={closeMobileMenu}>
                    {label}
                  </Link>
                </Button>
              ))
            )}
          </nav>
        </div>
      </header>

      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  )
}

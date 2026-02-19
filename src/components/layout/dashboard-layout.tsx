import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Search, Plus, Bell } from 'lucide-react'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background px-6">
          <div className="flex flex-1 items-center gap-4">
            <div
              className={cn(
                'flex items-center gap-2 transition-all duration-300',
                searchOpen ? 'flex-1 max-w-md' : 'w-10'
              )}
            >
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-secondary"
                aria-label="Toggle search"
              >
                <Search className="h-5 w-5" />
              </button>
              {searchOpen && (
                <Input
                  placeholder="Search assets, content, research..."
                  className="animate-in h-10"
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                />
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

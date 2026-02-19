import { User, Key, Shield, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { useNavigate } from 'react-router-dom'

export function ProfilePage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  const email = user?.email ?? '—'
  const displayName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? 'User'
  const avatarUrl = user?.user_metadata?.avatar_url
  const providers = user?.app_metadata?.providers ?? []
  const hasGoogle = providers.includes('google')
  const hasApple = providers.includes('apple')

  return (
    <div className="space-y-6 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold">User Profile</h1>
        <p className="text-muted-foreground">
          Account management and admin controls
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="transition-all duration-300 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>Name, email, avatar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-secondary">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl font-semibold text-muted-foreground">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium">{displayName}</div>
                <div className="text-sm text-muted-foreground">{email}</div>
              </div>
              <Button variant="outline">Edit profile</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Connected OAuth
            </CardTitle>
            <CardDescription>Google, Apple</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <span>Google</span>
                <span className={`text-sm ${hasGoogle ? 'text-green-500' : 'text-muted-foreground'}`}>
                  {hasGoogle ? 'Connected' : 'Not connected'}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <span>Apple</span>
                <span className={`text-sm ${hasApple ? 'text-green-500' : 'text-muted-foreground'}`}>
                  {hasApple ? 'Connected' : 'Not connected'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              2FA & Security
            </CardTitle>
            <CardDescription>Two-factor authentication</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Enable 2FA</Button>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle>Billing overview</CardTitle>
            <CardDescription>Manage subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <a href="/checkout">Billing & invoices</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 transition-all duration-300 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle>Sign out</CardTitle>
            <CardDescription>End your session on this device</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="text-accent hover:bg-accent/10 hover:text-accent" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

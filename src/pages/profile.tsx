import { User, Key, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ProfilePage() {
  return (
    <div className="space-y-6 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold">User Profile</h1>
        <p className="text-muted-foreground">
          Account management and admin controls
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile card
            </CardTitle>
            <CardDescription>Name, email, avatar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-16 w-16 rounded-full bg-secondary" />
              <div>
                <div className="font-medium">User name</div>
                <div className="text-sm text-muted-foreground">user@example.com</div>
              </div>
              <Button variant="outline">Edit profile</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
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
                <span className="text-sm text-muted-foreground">Connected</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
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

        <Card>
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
      </div>
    </div>
  )
}

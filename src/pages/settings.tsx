import { Bell, Zap, Globe, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function SettingsPage() {
  return (
    <div className="space-y-6 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold">Settings & Preferences</h1>
        <p className="text-muted-foreground">
          Configure notifications, integrations, and defaults
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage notification toggles and rules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Email notifications</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span>In-app notifications</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              AI & Research Credits
            </CardTitle>
            <CardDescription>OpenClaw usage and quota</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-secondary p-4">
              <div className="text-2xl font-bold">1,240</div>
              <div className="text-sm text-muted-foreground">credits remaining this month</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Publishing defaults
            </CardTitle>
            <CardDescription>Channels and timezone</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">UTC (default timezone)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Accessibility
            </CardTitle>
            <CardDescription>Display and interaction preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Configure</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const integrations = [
  { name: 'Google', desc: 'Gmail & Calendar', connected: true },
  { name: 'YouTube', desc: 'Analytics & publishing', connected: false },
  { name: 'Instagram', desc: 'Content & insights', connected: false },
  { name: 'Dropbox', desc: 'File sync', connected: false },
]

export function IntegrationsPage() {
  return (
    <div className="space-y-6 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">
          Manage third-party connections
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {integrations.map((int) => (
          <Card key={int.name}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium">{int.name}</div>
                <div className="text-sm text-muted-foreground">{int.desc}</div>
              </div>
              {int.connected ? (
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <Check className="h-4 w-4" />
                  Connected
                </div>
              ) : (
                <Button size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Connect
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

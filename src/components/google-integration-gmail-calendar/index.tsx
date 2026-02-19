import { useState } from 'react'
import { Mail, Calendar, ExternalLink, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  initiateGoogleOAuth,
  getGoogleIntegration,
  revokeGoogleIntegration,
} from '@/services/google-integration-gmail-calendar-service'
import { useAuth } from '@/hooks/use-auth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

export function GoogleIntegrationGmailCalendar() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [showRevokeDialog, setShowRevokeDialog] = useState(false)
  const [revokeId, setRevokeId] = useState<string | null>(null)

  const { data: integration, isLoading, error } = useQuery({
    queryKey: ['google-integration', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      const { data, error: err } = await getGoogleIntegration(user.id)
      if (err) throw err
      return data
    },
    enabled: !!user?.id,
  })

  const connectMutation = useMutation({
    mutationFn: () => initiateGoogleOAuth(),
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error.message)
      }
    },
  })

  const handleConnect = () => {
    connectMutation.mutate()
  }

  const revokeMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      if (!user?.id) throw new Error('Not authenticated')
      return revokeGoogleIntegration(id, user.id)
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error.message)
      } else {
        toast.success('Google integration disconnected')
        queryClient.invalidateQueries({ queryKey: ['google-integration', user?.id] })
        setShowRevokeDialog(false)
        setRevokeId(null)
      }
    },
  })

  const handleRevokeClick = (id: string) => {
    setRevokeId(id)
    setShowRevokeDialog(true)
  }

  const handleRevokeConfirm = () => {
    if (revokeId) {
      revokeMutation.mutate({ id: revokeId })
    }
  }

  if (isLoading) {
    return (
      <Card className="animate-in-up">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="animate-in-up border-accent/50">
        <CardContent className="p-6">
          <p className="text-sm text-accent">Failed to load integration. Please try again.</p>
        </CardContent>
      </Card>
    )
  }

  const isConnected = !!integration && integration.status === 'active'

  return (
    <>
      <Card className="animate-in-up transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
              <Mail className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle>Gmail & Calendar</CardTitle>
              <CardDescription>
                Surface briefs, deadlines, and contextual inbox items from Google
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-card/50 p-4">
            <h4 className="mb-2 text-sm font-medium">Scopes requested</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Gmail (read-only) – view threads and messages
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Google Calendar (read-only) – view events and deadlines
              </li>
            </ul>
          </div>

          {isConnected ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  Connected
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href="https://mail.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Gmail
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-accent hover:bg-accent/10 hover:text-accent"
                  onClick={() => integration && handleRevokeClick(integration.id)}
                  disabled={revokeMutation.isPending}
                >
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={handleConnect}
              disabled={connectMutation.isPending}
            >
              {connectMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Connect Google (Gmail + Calendar)
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showRevokeDialog} onOpenChange={setShowRevokeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Google?</AlertDialogTitle>
            <AlertDialogDescription>
              This will revoke access to Gmail and Calendar. You can reconnect anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevokeConfirm}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

import { useState } from 'react'
import { Mail, Calendar, ExternalLink, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IntegrationCard } from './IntegrationCard'
import {
  initiateGoogleOAuth,
  getGoogleIntegration,
  disconnectIntegration,
  getSyncLogs,
} from '@/services/integrations-service'
import { useAuth } from '@/hooks/use-auth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function GoogleIntegrationCard() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [showRevokeDialog, setShowRevokeDialog] = useState(false)

  const { data: integration, isLoading, error } = useQuery({
    queryKey: ['google-integration', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      const { data, error } = await getGoogleIntegration(user.id)
      if (error) throw error
      return data
    },
    enabled: !!user?.id,
  })

  const { data: syncLogs } = useQuery({
    queryKey: ['integration-sync', 'google_gmail_calendar'],
    queryFn: async () => {
      const { logs } = await getSyncLogs('google_gmail_calendar')
      return logs
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

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      if (!integration?.id) throw new Error('No integration')
      return disconnectIntegration('google_gmail_calendar', integration.id)
    },
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error.message)
      } else {
        toast.success('Google integration disconnected')
        queryClient.invalidateQueries({ queryKey: ['google-integration', user?.id] })
        queryClient.invalidateQueries({ queryKey: ['integration-audit'] })
        setShowRevokeDialog(false)
      }
    },
  })

  const lastSync = syncLogs?.[0]?.last_sync_at ?? null
  const errorMsg = syncLogs?.[0]?.error_message ?? null
  const isConnected = !!integration && integration.status === 'active'

  const status = isConnected
    ? errorMsg
      ? 'error'
      : 'connected'
    : 'disconnected'

  if (isLoading) {
    return (
      <IntegrationCard
        title="Gmail & Calendar"
        description="Surface briefs, deadlines, and contextual inbox items from Google"
        icon={<Mail className="h-6 w-6 text-muted-foreground" />}
        status="disconnected"
        actions={
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        }
      />
    )
  }

  if (error) {
    return (
      <IntegrationCard
        title="Gmail & Calendar"
        description="Surface briefs, deadlines, and contextual inbox items from Google"
        icon={<Mail className="h-6 w-6 text-muted-foreground" />}
        status="error"
        errorMessage="Failed to load integration. Please try again."
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['google-integration', user?.id] })}
          >
            Retry
          </Button>
        }
      />
    )
  }

  return (
    <>
      <IntegrationCard
        title="Gmail & Calendar"
        description="Surface briefs, deadlines, and contextual inbox items from Google"
        icon={<Mail className="h-6 w-6 text-muted-foreground" />}
        status={status}
        lastSync={lastSync}
        errorMessage={errorMsg}
        isRefreshing={connectMutation.isPending}
        actions={
          isConnected ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-transform hover:scale-[1.02]"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Gmail
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => connectMutation.mutate()}
                disabled={connectMutation.isPending}
                className="transition-transform hover:scale-[1.02]"
              >
                {connectMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reconnect
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-accent hover:bg-accent/10 hover:text-accent transition-transform hover:scale-[1.02]"
                onClick={() => setShowRevokeDialog(true)}
                disabled={disconnectMutation.isPending}
              >
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              className="transition-transform hover:scale-[1.02]"
              onClick={() => connectMutation.mutate()}
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
          )
        }
      >
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
      </IntegrationCard>

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
              onClick={() => disconnectMutation.mutate()}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {disconnectMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Disconnect'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

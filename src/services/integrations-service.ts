import { supabase } from '@/lib/supabase'
import type {
  IntegrationSyncLog,
  IntegrationAuditLog,
  GoogleIntegrationGmailCalendar,
} from '@/types/database'

export type IntegrationType =
  | 'google_gmail_calendar'
  | 'youtube'
  | 'storage'
  | 'instagram'
  | 'x'
  | 'dropbox'

async function invokeIntegrations<T>(body: Record<string, unknown>): Promise<{ data: T; error: Error | null }> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) {
    return { data: null as T, error: new Error('Not authenticated') }
  }

  const { data, error } = await supabase.functions.invoke('integrations', {
    body: { ...body },
    headers: { Authorization: `Bearer ${session.access_token}` },
  })

  if (error) {
    return { data: null as T, error }
  }
  if (data?.error) {
    return { data: null as T, error: new Error(data.error as string) }
  }
  return { data: data as T, error: null }
}

export async function disconnectIntegration(
  integrationType: IntegrationType,
  integrationId?: string
): Promise<{ error: Error | null }> {
  const { error } = await invokeIntegrations<{ success: boolean }>({
    action: 'disconnect',
    integrationType,
    integrationId,
  })
  return { error }
}

export async function getSyncLogs(
  integrationType?: IntegrationType
): Promise<{ logs: IntegrationSyncLog[]; error: Error | null }> {
  try {
    const { data, error } = await invokeIntegrations<{ logs: IntegrationSyncLog[] }>({
      action: 'get-sync-status',
      integrationType,
    })
    if (error) return { logs: [], error }
    return { logs: data?.logs ?? [], error: null }
  } catch {
    return { logs: [], error: null }
  }
}

export async function getAuditLogs(limit = 50): Promise<{
  logs: IntegrationAuditLog[];
  error: Error | null;
}> {
  try {
    const { data, error } = await invokeIntegrations<{ logs: IntegrationAuditLog[] }>({
      action: 'get-audit-logs',
      limit,
    })
    if (error) return { logs: [], error }
    return { logs: data?.logs ?? [], error: null }
  } catch {
    return { logs: [], error: null }
  }
}

export async function logAudit(
  integrationType: IntegrationType,
  action: string,
  status = 'success',
  details: Record<string, unknown> = {}
): Promise<{ error: Error | null }> {
  const { error } = await invokeIntegrations<{ success: boolean }>({
    action: 'log-audit',
    integrationType,
    auditAction: action,
    status,
    details,
  })
  return { error }
}

export async function getGoogleIntegration(
  userId: string
): Promise<{ data: GoogleIntegrationGmailCalendar | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('google_integration_gmail_calendar')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle()

  return {
    data: data as GoogleIntegrationGmailCalendar | null,
    error: error ?? null,
  }
}

export { initiateGoogleOAuth } from './google-integration-gmail-calendar-service'

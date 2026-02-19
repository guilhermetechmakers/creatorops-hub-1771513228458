import { supabase } from '@/lib/supabase'
import type { GoogleIntegrationGmailCalendar } from '@/types/database'

const GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly'
const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events.readonly'

export async function initiateGoogleOAuth(): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/integrations&source=google_connect`,
      scopes: `${GMAIL_SCOPE} ${CALENDAR_SCOPE}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  return { error: error ?? null }
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

export async function createGoogleIntegration(
  userId: string,
  title: string,
  description?: string
): Promise<{ data: GoogleIntegrationGmailCalendar | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('google_integration_gmail_calendar')
    .insert({
      user_id: userId,
      title,
      description: description ?? null,
      status: 'active',
    })
    .select()
    .single()

  return {
    data: data as GoogleIntegrationGmailCalendar | null,
    error: error ?? null,
  }
}

export async function revokeGoogleIntegration(
  id: string,
  userId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('google_integration_gmail_calendar')
    .update({ status: 'revoked', updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)

  return { error: error ?? null }
}

export function getGmailThreadUrl(threadId: string): string {
  return `https://mail.google.com/mail/u/0/#inbox/${threadId}`
}

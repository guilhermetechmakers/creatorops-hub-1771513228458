// Supabase Edge Function: Integrations
// Handles disconnect/revoke, sync status, audit logs - all server-side
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  })
}

function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message }, status)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders() })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return errorResponse('Unauthorized', 401)
  }

  const token = authHeader.replace('Bearer ', '')
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })

  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  if (userError || !user) {
    return errorResponse('Invalid token', 401)
  }

  const userId = user.id

  try {
    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {}
    const action = body.action ?? 'status'

    switch (action) {
      case 'disconnect': {
        const { integrationType, integrationId } = body
        if (!integrationType || typeof integrationType !== 'string') {
          return errorResponse('integrationType is required')
        }

        if (integrationType === 'google_gmail_calendar' && integrationId) {
          const { error } = await supabase
            .from('google_integration_gmail_calendar')
            .update({ status: 'revoked', updated_at: new Date().toISOString() })
            .eq('id', integrationId)
            .eq('user_id', userId)

          if (error) {
            return errorResponse(error.message, 500)
          }
        }

        await supabase.from('integration_audit_log').insert({
          user_id: userId,
          integration_type: integrationType,
          action: 'disconnect',
          status: 'success',
          details: { integration_id: integrationId ?? null },
        })

        return jsonResponse({ success: true })
      }

      case 'get-sync-status': {
        const { integrationType } = body
        let query = supabase
          .from('integration_sync_log')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20)

        if (integrationType && typeof integrationType === 'string') {
          query = query.eq('integration_type', integrationType)
        }

        const { data, error } = await query
        if (error) {
          return errorResponse(error.message, 500)
        }
        return jsonResponse({ logs: data ?? [] })
      }

      case 'get-audit-logs': {
        const { limit = 50 } = body
        const { data, error } = await supabase
          .from('integration_audit_log')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(Math.min(Number(limit) || 50, 100))

        if (error) {
          return errorResponse(error.message, 500)
        }
        return jsonResponse({ logs: data ?? [] })
      }

      case 'log-audit': {
        const { integrationType, auditAction, status = 'success', details = {} } = body
        if (!integrationType || !auditAction) {
          return errorResponse('integrationType and auditAction are required')
        }

        const { error } = await supabase.from('integration_audit_log').insert({
          user_id: userId,
          integration_type: integrationType,
          action: auditAction,
          status,
          details: typeof details === 'object' ? details : {},
        })

        if (error) {
          return errorResponse(error.message, 500)
        }
        return jsonResponse({ success: true })
      }

      case 'upsert-sync-log': {
        const {
          integrationType,
          integrationId,
          status,
          lastSyncAt,
          nextRefreshAt,
          errorMessage,
          metadata = {},
        } = body

        if (!integrationType) {
          return errorResponse('integrationType is required')
        }

        const { data: existing } = await supabase
          .from('integration_sync_log')
          .select('id')
          .eq('user_id', userId)
          .eq('integration_type', integrationType)
          .limit(1)
          .maybeSingle()

        const payload = {
          user_id: userId,
          integration_type: integrationType,
          integration_id: integrationId ?? null,
          status: status ?? 'pending',
          last_sync_at: lastSyncAt ?? null,
          next_refresh_at: nextRefreshAt ?? null,
          error_message: errorMessage ?? null,
          metadata: typeof metadata === 'object' ? metadata : {},
          updated_at: new Date().toISOString(),
        }

        if (existing) {
          const { data, error } = await supabase
            .from('integration_sync_log')
            .update(payload)
            .eq('id', existing.id)
            .select()
            .single()
          if (error) return errorResponse(error.message, 500)
          return jsonResponse({ log: data })
        }

        const { data, error } = await supabase
          .from('integration_sync_log')
          .insert(payload)
          .select()
          .single()
        if (error) return errorResponse(error.message, 500)
        return jsonResponse({ log: data })
      }

      default:
        return errorResponse(`Unknown action: ${action}`, 400)
    }
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : 'Unknown error',
      500
    )
  }
})

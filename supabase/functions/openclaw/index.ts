// Supabase Edge Function: OpenClaw API proxy
// Handles research jobs, structured generation, job status, usage accounting,
// provenance capture, webhooks, and safety guardrails
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const DAILY_QUOTA_RESEARCH = 50
const DAILY_QUOTA_GENERATE = 100
const MIN_CONFIDENCE = 0.5
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 500
const WEBHOOK_SECRET = Deno.env.get('OPENCLAW_WEBHOOK_SECRET') ?? ''

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature',
  }
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  })
}

function errorResponse(message: string, status = 400, code?: string) {
  return jsonResponse({ error: message, code }, status)
}

function rateLimitResponse(retryAfter?: number) {
  return jsonResponse(
    {
      error: 'Rate limit exceeded',
      code: 'RATE_LIMIT',
      retryAfter: retryAfter ?? 60,
    },
    429
  )
}

function log(level: string, message: string, meta?: Record<string, unknown>) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  }
  console.log(JSON.stringify(entry))
}

/** Simple hallucination heuristic: require source citations in research output */
function hasSourceProvenance(summary: string, sourceCount: number): boolean {
  if (sourceCount === 0) return false
  const hasCitation = /\[.*?\]|\(.*?\)|source|according to|cited|reference/i.test(summary)
  return hasCitation || summary.length > 100
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function checkQuota(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  usageType: 'research' | 'generate'
): Promise<{ allowed: boolean; used: number; limit: number }> {
  const limit = usageType === 'research' ? DAILY_QUOTA_RESEARCH : DAILY_QUOTA_GENERATE
  const today = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('openclaw_usage')
    .select('id')
    .eq('user_id', userId)
    .eq('usage_type', usageType)
    .gte('created_at', `${today}T00:00:00Z`)

  if (error) return { allowed: false, used: 0, limit }
  const used = data?.length ?? 0
  return { allowed: used < limit, used, limit }
}

async function recordUsage(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  jobId: string,
  usageType: 'research' | 'generate',
  tokensUsed = 0
) {
  await supabase.from('openclaw_usage').insert({
    user_id: userId,
    job_id: jobId,
    usage_type: usageType,
    tokens_used: tokensUsed,
  })
}

// Mock research - in production, call external OpenClaw API
async function mockResearch(query: string): Promise<{
  summary: string
  sources: Array<{ url: string; title: string; snippet: string }>
  confidence: number
}> {
  await sleep(500)
  const summary = `Research summary for "${query}". Key findings and insights based on web sources [1][2].`
  const sources = [
    { url: 'https://example.com/source1', title: 'Source 1', snippet: 'Relevant excerpt...' },
    { url: 'https://example.com/source2', title: 'Source 2', snippet: 'Additional context...' },
  ]
  return { summary, sources, confidence: 0.85 }
}

// Mock generation - in production, call external OpenClaw API
async function mockGenerate(
  query: string,
  outputType: string
): Promise<{ output: unknown; confidence: number }> {
  await sleep(300)
  const output =
    outputType === 'thread'
      ? { posts: [`Post 1 for: ${query}`, `Post 2 for: ${query}`] }
      : outputType === 'script'
        ? { script: `Script content for: ${query}` }
        : { caption: `Caption for: ${query}` }
  return { output, confidence: 0.82 }
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
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? supabaseAnonKey

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  if (userError || !user) {
    return errorResponse('Invalid token', 401)
  }

  const userId = user.id

  try {
    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {}
    const action = body.action ?? ''

    switch (action) {
      case 'research': {
        const { query } = body
        if (!query || typeof query !== 'string' || query.trim().length === 0) {
          log('warn', 'Research: invalid query', { userId })
          return errorResponse('query is required and must be a non-empty string')
        }

        const quota = await checkQuota(supabaseAdmin, userId, 'research')
        if (!quota.allowed) {
          log('warn', 'Research: quota exceeded', { userId, used: quota.used, limit: quota.limit })
          return rateLimitResponse(3600)
        }

        log('info', 'Research job submitted', { userId, query: query.trim().slice(0, 80) })

        const { data: job, error } = await supabase
          .from('openclaw_job')
          .insert({
            user_id: userId,
            type: 'research',
            query: query.trim(),
            status: 'processing',
          })
          .select()
          .single()

        if (error) {
          return errorResponse(error.message, 500)
        }

        // Process research (mock - in prod would be async/queue)
        try {
          let result = await mockResearch(query.trim())
          let attempts = 1
          while (attempts < MAX_RETRIES && result.confidence < MIN_CONFIDENCE) {
            await sleep(RETRY_DELAY_MS * attempts)
            result = await mockResearch(query.trim())
            attempts++
          }

          if (result.confidence < MIN_CONFIDENCE) {
            await supabase
              .from('openclaw_job')
              .update({
                status: 'failed',
                error_message: 'Low confidence score - source capture required',
                completed_at: new Date().toISOString(),
              })
              .eq('id', job.id)
              .eq('user_id', userId)
            log('warn', 'Research: low confidence', { jobId: job.id, confidence: result.confidence })
            return errorResponse('Research failed: insufficient confidence', 400, 'LOW_CONFIDENCE')
          }

          if (!hasSourceProvenance(result.summary, result.sources.length)) {
            log('warn', 'Research: provenance check failed', { jobId: job.id })
            await supabase
              .from('openclaw_job')
              .update({
                status: 'failed',
                error_message: 'Source capture required - output must cite sources',
                completed_at: new Date().toISOString(),
              })
              .eq('id', job.id)
              .eq('user_id', userId)
            return errorResponse('Research failed: source provenance required', 400, 'PROVENANCE_REQUIRED')
          }

          for (const src of result.sources) {
            await supabase.from('openclaw_source').insert({
              job_id: job.id,
              url: src.url,
              title: src.title,
              snippet: src.snippet,
            })
          }

          await supabase
            .from('openclaw_job')
            .update({
              status: 'completed',
              output: { summary: result.summary, sourceCount: result.sources.length },
              confidence_score: result.confidence,
              completed_at: new Date().toISOString(),
            })
            .eq('id', job.id)
            .eq('user_id', userId)

          await recordUsage(supabaseAdmin, userId, job.id, 'research', 500)
          log('info', 'Research completed', { jobId: job.id, sourceCount: result.sources.length })
        } catch (err) {
          await supabase
            .from('openclaw_job')
            .update({
              status: 'failed',
              error_message: err instanceof Error ? err.message : 'Processing failed',
              completed_at: new Date().toISOString(),
            })
            .eq('id', job.id)
            .eq('user_id', userId)
          return errorResponse('Research processing failed', 500)
        }

        const { data: updatedJob } = await supabase
          .from('openclaw_job')
          .select('*')
          .eq('id', job.id)
          .eq('user_id', userId)
          .single()

        const { data: sources } = await supabase
          .from('openclaw_source')
          .select('*')
          .eq('job_id', job.id)

        return jsonResponse({ job: { ...(updatedJob ?? job), sources: sources ?? [] } })
      }

      case 'generate': {
        const { query, outputType = 'caption' } = body
        if (!query || typeof query !== 'string' || query.trim().length === 0) {
          log('warn', 'Generate: invalid query', { userId })
          return errorResponse('query is required and must be a non-empty string')
        }
        const validTypes = ['thread', 'script', 'caption']
        const type = validTypes.includes(outputType) ? outputType : 'caption'

        const quota = await checkQuota(supabaseAdmin, userId, 'generate')
        if (!quota.allowed) {
          log('warn', 'Generate: quota exceeded', { userId, used: quota.used, limit: quota.limit })
          return rateLimitResponse(3600)
        }

        log('info', 'Generate job submitted', { userId, query: query.trim().slice(0, 80), outputType: type })

        const { data: job, error } = await supabase
          .from('openclaw_job')
          .insert({
            user_id: userId,
            type: 'generate',
            query: query.trim(),
            status: 'processing',
            metadata: { outputType: type },
          })
          .select()
          .single()

        if (error) {
          return errorResponse(error.message, 500)
        }

        try {
          const result = await mockGenerate(query.trim(), type)
          if (result.confidence < MIN_CONFIDENCE) {
            await supabase
              .from('openclaw_job')
              .update({
                status: 'failed',
                error_message: 'Low confidence - review sources',
                completed_at: new Date().toISOString(),
              })
              .eq('id', job.id)
              .eq('user_id', userId)
            return errorResponse('Generation failed: insufficient confidence', 400, 'LOW_CONFIDENCE')
          }

          await supabase
            .from('openclaw_job')
            .update({
              status: 'completed',
              output: result.output,
              confidence_score: result.confidence,
              completed_at: new Date().toISOString(),
            })
            .eq('id', job.id)
            .eq('user_id', userId)

          await recordUsage(supabaseAdmin, userId, job.id, 'generate', 300)
        } catch (err) {
          await supabase
            .from('openclaw_job')
            .update({
              status: 'failed',
              error_message: err instanceof Error ? err.message : 'Generation failed',
              completed_at: new Date().toISOString(),
            })
            .eq('id', job.id)
            .eq('user_id', userId)
          return errorResponse('Generation processing failed', 500)
        }

        const { data: updatedJob } = await supabase
          .from('openclaw_job')
          .select('*')
          .eq('id', job.id)
          .eq('user_id', userId)
          .single()

        return jsonResponse({ job: updatedJob ?? job })
      }

      case 'job-status': {
        const { jobId } = body
        if (!jobId) {
          return errorResponse('jobId is required')
        }

        const { data: job, error } = await supabase
          .from('openclaw_job')
          .select('*')
          .eq('id', jobId)
          .eq('user_id', userId)
          .single()

        if (error || !job) {
          return errorResponse('Job not found', 404)
        }

        const { data: sources } = await supabase
          .from('openclaw_source')
          .select('*')
          .eq('job_id', jobId)

        return jsonResponse({ job: { ...job, sources: sources ?? [] } })
      }

      case 'list-jobs': {
        const { limit = 20, offset = 0, type } = body
        let query = supabase
          .from('openclaw_job')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1)

        if (type && ['research', 'generate'].includes(type)) {
          query = query.eq('type', type)
        }

        const { data: jobs, error } = await query
        if (error) {
          return errorResponse(error.message, 500)
        }

        return jsonResponse({ jobs: jobs ?? [] })
      }

      case 'webhook': {
        const sig = req.headers.get('x-webhook-signature')
        if (WEBHOOK_SECRET && sig !== WEBHOOK_SECRET) {
          log('warn', 'Webhook: invalid signature')
          return errorResponse('Invalid webhook signature', 401)
        }
        const { jobId, status, output, confidence, error } = body
        if (!jobId || !status) {
          return errorResponse('jobId and status required for webhook')
        }

        const { data: existing } = await supabaseAdmin
          .from('openclaw_job')
          .select('id, user_id')
          .eq('id', jobId)
          .single()

        if (!existing) {
          return errorResponse('Job not found', 404)
        }

        const updates: Record<string, unknown> = {
          status: String(status),
          updated_at: new Date().toISOString(),
        }
        if (status === 'completed' || status === 'failed') {
          updates.completed_at = new Date().toISOString()
        }
        if (output != null) updates.output = output
        if (confidence != null) updates.confidence_score = confidence
        if (error != null) updates.error_message = String(error)

        const { error: updateErr } = await supabaseAdmin
          .from('openclaw_job')
          .update(updates)
          .eq('id', jobId)

        if (updateErr) {
          log('error', 'Webhook: update failed', { jobId, error: updateErr.message })
          return errorResponse(updateErr.message, 500)
        }
        log('info', 'Webhook processed', { jobId, status })
        return jsonResponse({ received: true })
      }

      case 'delete-job': {
        const { jobId } = body
        if (!jobId) {
          return errorResponse('jobId is required')
        }

        const { error: delErr } = await supabase
          .from('openclaw_job')
          .delete()
          .eq('id', jobId)
          .eq('user_id', userId)

        if (delErr) {
          log('warn', 'Delete job failed', { jobId, userId, error: delErr.message })
          return errorResponse(delErr.message, 500)
        }
        log('info', 'Job deleted', { jobId, userId })
        return jsonResponse({ success: true })
      }

      default:
        return errorResponse(`Unknown action: ${action || '(missing)'}. Use: research, generate, job-status, list-jobs, delete-job`, 400)
    }
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : 'Unknown error',
      500
    )
  }
})

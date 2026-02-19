import { supabase } from '@/lib/supabase'
import type { OpenClawJob, OpenClawEmbeddedAgent } from '@/types/database'

interface InvokeResult<T> {
  data: T | null
  error: Error | null
}

async function invoke<T>(action: string, body: Record<string, unknown> = {}): Promise<InvokeResult<T>> {
  const { data, error } = await supabase.functions.invoke('openclaw', {
    body: { action, ...body },
  })

  if (error) {
    return { data: null, error }
  }

  const err = (data as { error?: string; code?: string })?.error
  if (err) {
    const e = new Error(err)
    ;(e as Error & { code?: string }).code = (data as { code?: string })?.code
    return { data: null, error: e }
  }

  return { data: data as T, error: null }
}

export interface SubmitResearchParams {
  query: string
}

export interface SubmitGenerateParams {
  query: string
  outputType?: 'thread' | 'script' | 'caption'
}

export async function submitResearchJob(
  params: SubmitResearchParams
): Promise<InvokeResult<{ job: OpenClawJob }>> {
  return invoke<{ job: OpenClawJob }>('research', { query: params.query })
}

export async function submitGenerationRequest(
  params: SubmitGenerateParams
): Promise<InvokeResult<{ job: OpenClawJob }>> {
  return invoke<{ job: OpenClawJob }>('generate', {
    query: params.query,
    outputType: params.outputType ?? 'caption',
  })
}

export async function getJobStatus(
  jobId: string
): Promise<InvokeResult<{ job: OpenClawJob }>> {
  return invoke<{ job: OpenClawJob }>('job-status', { jobId })
}

export async function listJobs(params?: {
  limit?: number
  offset?: number
  type?: 'research' | 'generate'
}): Promise<InvokeResult<{ jobs: OpenClawJob[] }>> {
  return invoke<{ jobs: OpenClawJob[] }>('list-jobs', params ?? {})
}

export async function deleteJob(
  jobId: string
): Promise<InvokeResult<{ success: boolean }>> {
  return invoke<{ success: boolean }>('delete-job', { jobId })
}

export async function listAgents(): Promise<{
  data: OpenClawEmbeddedAgent[] | null
  error: Error | null
}> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: null, error: new Error('Not authenticated') }
  }

  const { data, error } = await supabase
    .from('openclaw_embedded_agent')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error }
  }
  return { data: data as OpenClawEmbeddedAgent[], error: null }
}

export async function createAgent(params: {
  title: string
  description?: string
}): Promise<{
  data: OpenClawEmbeddedAgent | null
  error: Error | null
}> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: null, error: new Error('Not authenticated') }
  }

  const { data, error } = await supabase
    .from('openclaw_embedded_agent')
    .insert({
      user_id: user.id,
      title: params.title,
      description: params.description ?? null,
      status: 'active',
    })
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }
  return { data: data as OpenClawEmbeddedAgent, error: null }
}

export async function updateAgent(
  id: string,
  updates: { title?: string; description?: string; status?: string }
): Promise<{
  data: OpenClawEmbeddedAgent | null
  error: Error | null
}> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { data: null, error: new Error('Not authenticated') }
  }

  const { data, error } = await supabase
    .from('openclaw_embedded_agent')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }
  return { data: data as OpenClawEmbeddedAgent, error: null }
}

export async function deleteAgent(id: string): Promise<{ error: Error | null }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: new Error('Not authenticated') }
  }

  const { error } = await supabase
    .from('openclaw_embedded_agent')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  return { error: error ?? null }
}

export function formatJobStatus(status: string): string {
  const map: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    rate_limited: 'Rate limited',
  }
  return map[status] ?? status
}

export function getConfidenceLabel(score: number | null | undefined): string {
  if (score == null) return '—'
  if (score >= 0.9) return 'High'
  if (score >= 0.7) return 'Medium'
  if (score >= 0.5) return 'Low'
  return 'Very low'
}

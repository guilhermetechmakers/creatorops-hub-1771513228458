import { apiGet } from '@/lib/api'

export interface AdminStats {
  activeUsers: number
  paidWorkspaces: number
  pendingReview: number
  systemHealth: 'healthy' | 'degraded' | 'error'
}

/**
 * Fetches admin dashboard stats.
 * Returns null when unavailable (e.g. no API).
 */
export async function fetchAdminStats(): Promise<AdminStats | null> {
  try {
    const data = await apiGet<AdminStats>('/admin/stats')
    return data ?? null
  } catch {
    return null
  }
}

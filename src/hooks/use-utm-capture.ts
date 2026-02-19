import { useEffect } from 'react'

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

export function useUtmCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hasUtm = UTM_KEYS.some((key) => params.has(key))
    if (!hasUtm) return

    const utm: Record<string, string> = {}
    UTM_KEYS.forEach((key) => {
      const val = params.get(key)
      if (val) utm[key] = val
    })
    if (Object.keys(utm).length === 0) return

    try {
      sessionStorage.setItem('utm_params', JSON.stringify(utm))
      sessionStorage.setItem('utm_captured_at', new Date().toISOString())
    } catch {
      // Ignore storage errors
    }
  }, [])
}

export function getStoredUtm(): Record<string, string> | null {
  try {
    const raw = sessionStorage.getItem('utm_params')
    return raw ? (JSON.parse(raw) as Record<string, string>) : null
  } catch {
    return null
  }
}

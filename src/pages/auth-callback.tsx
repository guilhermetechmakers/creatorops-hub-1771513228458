import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { createGoogleIntegration } from '@/services/google-integration-gmail-calendar-service'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const handleCallback = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const searchParams = new URLSearchParams(window.location.search)
      const error = hashParams.get('error') ?? searchParams.get('error')
      const errorDescription = hashParams.get('error_description') ?? searchParams.get('error_description')

      if (error) {
        toast.error(errorDescription ?? error)
        setStatus('error')
        setTimeout(() => navigate('/login'), 2000)
        return
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        toast.error(sessionError.message)
        setStatus('error')
        setTimeout(() => navigate('/login'), 2000)
        return
      }

      if (session) {
        setStatus('success')
        const next = searchParams.get('next') ?? '/dashboard'
        const source = searchParams.get('source')

        if (source === 'google_connect' && session.user) {
          const { data: existing } = await supabase
            .from('google_integration_gmail_calendar')
            .select('id')
            .eq('user_id', session.user.id)
            .eq('status', 'active')
            .maybeSingle()

          if (!existing) {
            await createGoogleIntegration(
              session.user.id,
              'Gmail & Calendar',
              'Connected for deadlines, briefs, and inbox items'
            )
            toast.success('Google connected successfully')
          }
        } else {
          toast.success('Signed in successfully')
        }

        const from = (window.history.state?.usr as { from?: { pathname: string } })?.from?.pathname
        navigate(from ?? next, { replace: true })
      } else {
        setStatus('error')
        navigate('/login', { replace: true })
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      {status === 'loading' && (
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-sm text-muted-foreground">Completing sign in...</p>
        </div>
      )}
      {status === 'success' && (
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Redirecting...</p>
        </div>
      )}
      {status === 'error' && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-accent">Something went wrong. Redirecting to login...</p>
        </div>
      )}
    </div>
  )
}

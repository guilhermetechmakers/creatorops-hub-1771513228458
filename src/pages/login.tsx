import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard'
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginForm) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        toast.error('Please verify your email before signing in.')
        navigate('/email-verification')
      } else {
        toast.error(error.message)
      }
      return
    }
    toast.success('Signed in successfully')
    navigate(from, { replace: true })
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md animate-in-up">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your CreatorOps Hub account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={cn('pl-10', errors.email && 'border-destructive focus-visible:ring-destructive')}
                  aria-label="Email address"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/password-reset"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={cn('pl-10', errors.password && 'border-destructive focus-visible:ring-destructive')}
                  aria-label="Password"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Sign in
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full"
              type="button"
              aria-label="Sign in with Google"
              isLoading={oauthLoading === 'google'}
              disabled={!!oauthLoading}
              onClick={async () => {
                setOauthLoading('google')
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    scopes: 'email profile',
                  },
                })
                if (error) {
                  toast.error(error.message)
                  setOauthLoading(null)
                }
              }}
            >
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              type="button"
              aria-label="Sign in with Apple"
              isLoading={oauthLoading === 'apple'}
              disabled={!!oauthLoading}
              onClick={async () => {
                setOauthLoading('apple')
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: 'apple',
                  options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                  },
                })
                if (error) {
                  toast.error(error.message)
                  setOauthLoading(null)
                }
              }}
            >
              Apple
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-medium text-foreground hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

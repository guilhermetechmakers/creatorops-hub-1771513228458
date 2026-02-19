import { useState } from 'react'
import { User, Key, Shield, LogOut, UserCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const editProfileSchema = z.object({
  fullName: z.string().min(1, 'Display name is required').max(100, 'Display name is too long'),
})

type EditProfileForm = z.infer<typeof editProfileSchema>

export function ProfilePage() {
  const { user, signOut, isLoading, refreshSession } = useAuth()
  const navigate = useNavigate()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? '',
    },
  })

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login', { replace: true })
      toast.success('Signed out successfully')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  const openEditDialog = () => {
    reset({
      fullName: user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? '',
    })
    setEditDialogOpen(true)
  }

  const onSubmitEdit = async (data: EditProfileForm) => {
    setIsUpdating(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: data.fullName },
      })
      if (error) throw error
      await refreshSession()
      setEditDialogOpen(false)
      toast.success('Profile updated successfully')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile'
      toast.error(message)
    } finally {
      setIsUpdating(false)
    }
  }

  const displayName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? 'User'
  const email = user?.email ?? '—'
  const avatarUrl = user?.user_metadata?.avatar_url
  const providers = user?.app_metadata?.providers ?? []
  const hasGoogle = providers.includes('google')
  const hasApple = providers.includes('apple')

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in-up">
        <div>
          <Skeleton className="mb-2 h-8 w-48" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="transition-all duration-300">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="mt-2 h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-10 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4 py-12 animate-in-up">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <UserCircle className="h-10 w-10 text-muted-foreground" aria-hidden />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-semibold">No session found</h2>
          <p className="text-muted-foreground max-w-sm">
            Sign in to view and manage your profile, connected accounts, and security settings.
          </p>
        </div>
        <Button asChild>
          <Link to="/login">Sign in</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">User Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Account management and admin controls
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="transition-all duration-300 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" aria-hidden />
              Profile
            </CardTitle>
            <CardDescription>Name, email, avatar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-secondary"
                role="img"
                aria-label={`Avatar for ${displayName}`}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`${displayName}'s avatar`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-muted-foreground">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium">{displayName}</div>
                <div className="text-sm text-muted-foreground">{email}</div>
              </div>
              <Button
                variant="outline"
                onClick={openEditDialog}
                aria-label="Edit profile information"
              >
                Edit profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" aria-hidden />
              Connected OAuth
            </CardTitle>
            <CardDescription>Google, Apple</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <span>Google</span>
                <span className={`text-sm ${hasGoogle ? 'text-success' : 'text-muted-foreground'}`}>
                  {hasGoogle ? 'Connected' : 'Not connected'}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <span>Apple</span>
                <span className={`text-sm ${hasApple ? 'text-success' : 'text-muted-foreground'}`}>
                  {hasApple ? 'Connected' : 'Not connected'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" aria-hidden />
              2FA & Security
            </CardTitle>
            <CardDescription>Two-factor authentication</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" aria-label="Enable two-factor authentication">
              Enable 2FA
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle>Billing overview</CardTitle>
            <CardDescription>Manage subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild aria-label="Go to billing and invoices">
              <Link to="/checkout">Billing & invoices</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 transition-all duration-300 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle>Sign out</CardTitle>
            <CardDescription>End your session on this device</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="text-accent hover:bg-accent/10 hover:text-accent"
              onClick={handleSignOut}
              aria-label="Sign out of your account"
            >
              <LogOut className="mr-2 h-4 w-4" aria-hidden />
              Sign out
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent aria-describedby="edit-profile-description">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription id="edit-profile-description">
              Update your display name. Email is managed by your authentication provider.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Display name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                {...register('fullName')}
              />
              {errors.fullName && (
                <p id="fullName-error" className="text-sm text-destructive" role="alert">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-readonly">Email</Label>
              <Input
                id="email-readonly"
                type="email"
                value={email}
                readOnly
                disabled
                className="bg-muted/50 cursor-not-allowed"
                aria-label="Email (read-only, managed by provider)"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                aria-label="Cancel editing profile"
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isUpdating} aria-label="Save profile changes">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

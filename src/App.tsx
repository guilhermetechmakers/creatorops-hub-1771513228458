import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { PublicLayout } from '@/components/layout/public-layout'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { LandingPage } from '@/pages/landing'
import { LoginPage } from '@/pages/login'
import { SignupPage } from '@/pages/signup'
import { PasswordResetPage } from '@/pages/password-reset'
import { EmailVerificationPage } from '@/pages/email-verification'
import { CheckoutPage } from '@/pages/checkout'
import { DashboardPage } from '@/pages/dashboard'
import { ProjectsPage } from '@/pages/projects'
import { FileLibraryPage } from '@/pages/file-library'
import { ContentStudioPage } from '@/pages/content-studio'
import { ResearchPage } from '@/pages/research'
import { PlannerPage } from '@/pages/planner'
import { InboxPage } from '@/pages/inbox'
import { AnalyticsPage } from '@/pages/analytics'
import { IntegrationsPage } from '@/pages/integrations'
import { SettingsPage } from '@/pages/settings'
import { ProfilePage } from '@/pages/profile'
import { AdminPage } from '@/pages/admin'
import { AboutPage } from '@/pages/about'
import { HelpPage } from '@/pages/help'
import { PrivacyPage } from '@/pages/privacy'
import { TermsPage } from '@/pages/terms'
import { NotFoundPage } from '@/pages/not-found'
import { ServerErrorPage } from '@/pages/server-error'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes with header */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/password-reset" element={<PasswordResetPage />} />
            <Route path="/email-verification" element={<EmailVerificationPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/500" element={<ServerErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Dashboard routes with sidebar */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="library" element={<FileLibraryPage />} />
            <Route path="studio" element={<ContentStudioPage />} />
            <Route path="research" element={<ResearchPage />} />
            <Route path="planner" element={<PlannerPage />} />
            <Route path="inbox" element={<InboxPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>

          {/* Checkout - standalone */}
          <Route path="/checkout" element={<DashboardLayout />}>
            <Route index element={<CheckoutPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  )
}

export default App

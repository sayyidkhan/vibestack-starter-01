import {
  createRootRoute,
  createRoute,
  createRouter,
  Navigate,
  Outlet,
} from '@tanstack/react-router'
import { Shell } from './components/layout/Shell'
import { ErrorBoundary } from './components/shared/ErrorBoundary'
import { LoadingState } from './components/shared/States'
import { Toaster } from './components/shared/Toaster'
import { AppStateProvider } from './context/app-state'
import { FeatureFlagsProvider, useFeatureFlags } from './context/feature-flags'
import { ToastProvider } from './context/toast'
import { AuthProvider, useAuth } from './lib/auth'
import { hasRole, isAuthenticated } from './lib/permissions'
import { AdminAuditLogsPage } from './pages/admin/audit-logs'
import { AdminPage } from './pages/admin'
import { AdminSettingsPage } from './pages/admin/settings'
import { AdminUsersPage } from './pages/admin/users'
import { AIAssistantPage } from './pages/ai/assistant'
import { DashboardPage } from './pages/dashboard'
import {
  AboutPage,
  ContactPage,
  LandingPage,
  LoginPage,
  PricingPage,
  PrivacyPage,
  SignupPage,
  StatusPage,
  TermsPage,
  NotFoundPage,
} from './pages/pages'
import { ProfilePage } from './pages/profile'
import { SettingsPage } from './pages/settings'

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loadingAuth } = useAuth()
  if (loadingAuth) return <LoadingState />
  if (!isAuthenticated(user)) return <Navigate to="/login" />
  return children
}

function FeatureFlagGate({
  flag,
  fallbackTo = '/dashboard',
  children,
}: {
  flag: 'AI_ASSISTANT' | 'ADMIN_PANEL' | 'AUDIT_LOGS' | 'EXAMPLE_CRUD' | 'USER_SETTINGS'
  fallbackTo?: string
  children: React.ReactNode
}) {
  const { loadingFlags, isEnabled } = useFeatureFlags()
  if (loadingFlags) return <LoadingState />
  if (!isEnabled(flag)) return <Navigate to={fallbackTo} />
  return children
}

function AdminOnly({ children }: { children: React.ReactNode }) {
  const { user, loadingAuth } = useAuth()
  if (loadingAuth) return <LoadingState />
  if (!isAuthenticated(user)) return <Navigate to="/login" />
  if (!hasRole(user, 'admin')) return <Navigate to="/dashboard" />
  return children
}

const rootRoute = createRootRoute({
  component: () => (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <FeatureFlagsProvider>
            <AppStateProvider>
              <Shell>
                <Outlet />
              </Shell>
              <Toaster />
            </AppStateProvider>
          </FeatureFlagsProvider>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  ),
  notFoundComponent: NotFoundPage,
})

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: LandingPage })
const pricingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/pricing', component: PricingPage })
const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about', component: AboutPage })
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/contact', component: ContactPage })
const privacyRoute = createRoute({ getParentRoute: () => rootRoute, path: '/privacy', component: PrivacyPage })
const termsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/terms', component: TermsPage })
const statusRoute = createRoute({ getParentRoute: () => rootRoute, path: '/status', component: StatusPage })
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: LoginPage })
const signupRoute = createRoute({ getParentRoute: () => rootRoute, path: '/signup', component: SignupPage })

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => <Protected><DashboardPage /></Protected>,
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => <Protected><ProfilePage /></Protected>,
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => (
    <Protected>
      <FeatureFlagGate flag="USER_SETTINGS">
        <SettingsPage />
      </FeatureFlagGate>
    </Protected>
  ),
})

const aiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ai/assistant',
  component: () => (
    <AdminOnly>
      <FeatureFlagGate flag="ADMIN_PANEL">
      <FeatureFlagGate flag="AI_ASSISTANT">
        <AIAssistantPage />
      </FeatureFlagGate>
      </FeatureFlagGate>
    </AdminOnly>
  ),
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminOnly>
      <FeatureFlagGate flag="ADMIN_PANEL">
        <AdminPage />
      </FeatureFlagGate>
    </AdminOnly>
  ),
})

const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: () => (
    <AdminOnly>
      <FeatureFlagGate flag="ADMIN_PANEL">
        <AdminUsersPage />
      </FeatureFlagGate>
    </AdminOnly>
  ),
})

const adminAuditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/audit-logs',
  component: () => (
    <AdminOnly>
      <FeatureFlagGate flag="ADMIN_PANEL">
        <FeatureFlagGate flag="AUDIT_LOGS">
          <AdminAuditLogsPage />
        </FeatureFlagGate>
      </FeatureFlagGate>
    </AdminOnly>
  ),
})

const adminSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/settings',
  component: () => (
    <AdminOnly>
      <FeatureFlagGate flag="ADMIN_PANEL">
        <AdminSettingsPage />
      </FeatureFlagGate>
    </AdminOnly>
  ),
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  pricingRoute,
  aboutRoute,
  contactRoute,
  privacyRoute,
  termsRoute,
  statusRoute,
  loginRoute,
  signupRoute,
  dashboardRoute,
  profileRoute,
  settingsRoute,
  aiRoute,
  adminRoute,
  adminUsersRoute,
  adminAuditRoute,
  adminSettingsRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

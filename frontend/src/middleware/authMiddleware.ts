import { useAuthStore } from '@/modules/auth/auth.store'
import type { Permission } from '@/modules/admin/types/admin.types'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

function normalizeStringArray(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string') as string[]
  return []
}

function normalizePermissionArray(value: unknown): Permission[] {
  if (!value) return []
  if (!Array.isArray(value)) return []
  return value.filter((v) => typeof v === 'string') as Permission[]
}

const unverifiedAuthRoutes = new Set([
  'EmailVerification',
  'Register',
  'Login',
  'ForgotPassword',
  'ResetPassword',
])

const guestAuthRoutes = new Set([
  'Login',
  'Register',
  'ForgotPassword',
  'ResetPassword',
])

export function authMiddleware(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const auth = useAuthStore()

  const requiresAuth = Boolean(to.meta.requiresAuth)
  const requiredRoles = normalizeStringArray(to.meta.roles)
  const requiredPermissions = normalizePermissionArray(to.meta.permissions)

  // Treat roles/permissions as implicitly protected (avoids misconfig footguns)
  const needsIdentity = requiresAuth || requiredRoles.length > 0 || requiredPermissions.length > 0

  // Ensure auth is initialized before making decisions (prevents route flashing).
  const run = async () => {
    if (!auth.initialized) {
      await auth.initialize()
    }

    const routeName = String(to.name || '')
    const userEmail = String(auth.user?.email || '').toLowerCase()
    const userRole = String(auth.user?.role || '').toLowerCase()
    const isAdminAccount = userEmail === 'admin@trc.local' || userRole === 'super_admin'

    if (auth.isAuthenticated && guestAuthRoutes.has(routeName)) {
      if (isAdminAccount || auth.user?.emailVerified) {
        return next({ path: auth.getPostLoginRoute() })
      }
      if (routeName !== 'EmailVerification') {
        return next({ name: 'EmailVerification', query: { email: auth.user?.email } })
      }
    }

    // ✅ Auth required
    if (needsIdentity && !auth.isAuthenticated) {
      return next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
    }

    // ✅ Status check (Handle email verification and pending approvals)
    if (auth.isAuthenticated) {
      // Super Admin bypass for verification/pending flows
      if (isAdminAccount) {
        return next()
      }

      const isEmailVerificationPage = to.name === 'EmailVerification'
      const isResearcherInfoPage = to.name === 'ResearcherInfo'
      const isPendingPage = to.name === 'PendingApproval'
      
      const emailVerified = auth.user?.emailVerified
      const isPendingStatus = auth.user?.status === 'pending'
      const isResearcher = userRole === 'researcher'

      // 1. Force Email Verification
      if (!emailVerified) {
        const routeName = String(to.name || '')
        if (!unverifiedAuthRoutes.has(routeName)) {
          return next({ name: 'EmailVerification', query: { email: auth.user?.email } })
        }
        return next()
      }

      // 2. Handle Researcher Flow (Researcher Info -> Pending Approval)
      if (isPendingStatus && isResearcher) {
        if (!isResearcherInfoPage && !isPendingPage) {
          return next({ name: 'ResearcherInfo' })
        }
        return next()
      }

      // 3. Handle Other Pending Statuses (e.g. general pending)
      if (isPendingStatus && !isResearcher && !isPendingPage) {
        return next({ name: 'PendingApproval' })
      }

      // 4. Redirect approved users away from pending pages
      if (!isPendingStatus && emailVerified && (isPendingPage || isEmailVerificationPage || isResearcherInfoPage)) {
        return next({ path: auth.getPostLoginRoute() })
      }
    }

    // ✅ Role required
    if (requiredRoles.length > 0) {
      const userRole = String(auth.user?.role || '').toLowerCase()
      const userEmail = String(auth.user?.email || '').toLowerCase()
      
      // Admin bypass
      if (userEmail === 'admin@trc.local') {
        return next()
      }

      if (!userRole || !requiredRoles.includes(userRole)) {
        return next({ name: 'Unauthorized' })
      }
    }

    // ✅ Permissions required (all-of)
    if (requiredPermissions.length > 0) {
      const userEmail = String(auth.user?.email || '').toLowerCase()
      if (userEmail === 'admin@trc.local') {
        return next()
      }

      const hasAll = requiredPermissions.every((p) => auth.can(p))
      if (!hasAll) {
        return next({ name: 'Unauthorized' })
      }
    }

    return next()
  }

  run().catch(() => next({ name: 'Login', query: { redirect: to.fullPath } }))
}


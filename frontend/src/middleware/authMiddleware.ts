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

    // ✅ Auth required
    if (needsIdentity && !auth.isAuthenticated) {
      return next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
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


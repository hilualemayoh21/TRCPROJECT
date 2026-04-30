import { useAuthStore } from "@/modules/auth/auth.store"
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router"

export function roleGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()

  const requiredRoles = to.meta.roles as string[] | undefined
  const userRole = authStore.user?.role

  // ✅ No role restriction
  if (!requiredRoles || requiredRoles.length === 0) {
    return next()
  }

  // ❌ Not authenticated (safety fallback)
  if (!authStore.isAuthenticated) {
    return next({ name: 'Login' })
  }

  // ❌ No role assigned
  if (!userRole) {
    return next({ name: 'Unauthorized' })
  }

  // ❌ Role not allowed
  if (!requiredRoles.includes(userRole)) {
    return next({ name: 'Unauthorized' })
  }

  // ✅ Access granted
  next()
}
import { useAuthStore } from "@/modules/auth/auth.store"
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router"

// ✅ Define allowed admin roles (extendable)
const ADMIN_ROLES = ['admin', 'super_admin']

export function adminGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()

  // ❌ Not authenticated
  if (!authStore.isAuthenticated) {
    return next({ name: "Login" })
  }

  const userRole = authStore.user?.role

  // ❌ Not an admin-level role
  if (!userRole || !ADMIN_ROLES.includes(userRole)) {
    return next({ name: "Unauthorized" })
  }

  // ✅ Authorized
  next()
}
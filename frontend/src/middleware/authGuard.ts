import { useAuthStore } from '@/modules/auth/auth.store'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

const publicPaths = new Set([
  '/login',
  '/register',
  '/forgot-password',
  '/support',
  '/privacy',
  '/terms'
])

export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()

  // ✅ Allow public routes
  if (publicPaths.has(to.path)) {
    return next()
  }

  // ❌ Not authenticated
  if (!authStore.isAuthenticated) {
    return next({
      name: 'Login',
      query: { redirect: to.fullPath } // 🔥 important for UX
    })
  }

  // ✅ Authenticated
  next()
}
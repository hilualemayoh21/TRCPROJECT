import { createRouter, createWebHistory } from "vue-router"

// ✅ Import module routes
import authRoutes from "@/modules/auth/auth.routes"
import userRoutes from "@/modules/user/user.routes"
import resourceRoutes from "@/modules/resource/resource.routes"
import adminRoutes from "@/modules/admin/admin.routes"

import Unauthorized from "@/pages/Unauthorized.vue"
import { authMiddleware } from "@/middleware/authMiddleware"
import { useAuthStore } from "@/modules/auth/auth.store"

const routes = [
  ...authRoutes,
  ...userRoutes,
  ...resourceRoutes,
  ...adminRoutes,
  {
    path: "/",
    redirect: (to) => {
      const auth = useAuthStore()
      return (auth.user?.role === 'admin' || auth.user?.role === 'super_admin' || auth.user?.email === 'admin@trc.local') 
        ? '/admin' 
        : '/dashboard'
    }
  },
  {
    path: "/unauthorized",
    name: "Unauthorized",
    component: Unauthorized,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ✅ Centralized middleware for auth + RBAC
router.beforeEach(authMiddleware)

export default router
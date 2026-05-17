import { createRouter, createWebHistory } from "vue-router"

// ✅ Import module routes
import authRoutes from "@/modules/auth/auth.routes"
import userRoutes from "@/modules/user/user.routes"
import resourceRoutes from "@/modules/resource/resource.routes"
import adminRoutes from "@/modules/admin/admin.routes"
import homeRoutes from "@/modules/home/home.routes"

import Unauthorized from "@/pages/Unauthorized.vue"
import { authMiddleware } from "@/middleware/authMiddleware"
import { useAuthStore } from "@/modules/auth/auth.store"

const routes = [
  ...homeRoutes,
  ...authRoutes,
  ...userRoutes,
  ...resourceRoutes,
  ...adminRoutes,
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
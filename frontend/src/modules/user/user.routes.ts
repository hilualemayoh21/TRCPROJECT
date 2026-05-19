export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('./pages/DashboardDispatcher.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('./pages/Profile.vue'),
    meta: { requiresAuth: true, layout: 'DashboardLayout' }
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('./pages/Notifications.vue'),
    meta: { requiresAuth: true, layout: 'DashboardLayout' }
  }
]

export default [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('./pages/DashboardDispatcher.vue'),
    meta: { requiresAuth: true }
  }
]

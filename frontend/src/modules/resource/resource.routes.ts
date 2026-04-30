export default [
  {
    path: '/search',
    name: 'ResourceSearch',
    component: () => import('./pages/Search.vue'),
    meta: { layout: 'DashboardLayout' }
  },
  {
    path: '/upload',
    name: 'UploadResource',
    component: () => import('./pages/UploadResource.vue'),
    meta: { layout: 'DashboardLayout', requiresAuth: true }
  }
]

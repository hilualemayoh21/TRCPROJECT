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
    meta: { layout: 'DashboardLayout', requiresAuth: true, permissions: ['create_resources'] }
  },
  {
    path: '/resources/:id',
    name: 'ResourceDetail',
    component: () => import('./pages/ResourceDetail.vue'),
    meta: { layout: 'DashboardLayout' }
  }
]

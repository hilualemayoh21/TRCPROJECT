export default [
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('./pages/AdminDashboard.vue'),
    meta: { 
      requiresAuth: true,
      roles: ['admin', 'super_admin']
    }
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('./pages/Users.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'super_admin'],
      permissions: ['manage_users']
    }
  },
  {
    path: '/admin/roles',
    name: 'admin-roles',
    component: () => import('./pages/RolesList.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'super_admin'],
      permissions: ['manage_roles']
    }
  },
  {
    path: '/admin/roles/:id',
    name: 'admin-role-details',
    component: () => import('./pages/RoleDetails.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'super_admin'],
      permissions: ['manage_roles']
    }
  },
  {
    path: '/admin/permission-matrix',
    name: 'admin-permission-matrix',
    component: () => import('./pages/PermissionMatrix.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'super_admin'],
      permissions: ['manage_roles']
    }
  },
  {
    path: '/admin/research-requests',
    name: 'admin-research-requests',
    component: () => import('./pages/ResearchRequests.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'super_admin'],
      permissions: ['approve_researchers']
    }
  },
  {
    path: '/admin/pending-resources',
    name: 'admin-pending-resources',
    component: () => import('./pages/PendingResources.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'super_admin'],
      permissions: ['approve_resources']
    }
  },
  {
    path: '/admin/reports',
    name: 'admin-reports',
    component: () => import('./pages/Reports.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'super_admin'],
      permissions: ['view_reports']
    }
  },
  {
    path: '/admin/audit-logs',
    name: 'admin-audit-logs',
    component: () => import('./pages/AuditLogs.vue'),
    meta: {
      requiresAuth: true,
      roles: ['admin', 'super_admin']
    }
  }
]

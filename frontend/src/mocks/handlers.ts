import { mockDb, persistMockDb, resetMockDb, type MockRole } from './db'

type MockContext = {
  url: string
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  params?: Record<string, unknown>
  data?: unknown
  headers?: Record<string, unknown>
}

function parseToken(headers?: Record<string, unknown>) {
  const value = String(headers?.Authorization || headers?.authorization || '')
  if (!value.startsWith('Bearer ')) return null
  return value.replace('Bearer ', '').trim()
}

function getAuthUser(headers?: Record<string, unknown>) {
  const token = parseToken(headers)
  if (!token) return null
  const userId = mockDb.tokens[token]
  if (!userId) return null
  return mockDb.users.find((u) => u.id === userId) || null
}

function assertSimulation() {
  if (mockDb.simulation.forceUnauthorized) throw { status: 401, message: 'Mock unauthorized' }
  if (mockDb.simulation.forceForbidden) throw { status: 403, message: 'Mock forbidden' }
}

function safePath(url: string) {
  return url.split('?')[0]
}

function makeToken(userId: string) {
  return `mock-token-${userId}-${Date.now()}`
}

function makeRefreshToken(userId: string) {
  return `mock-refresh-${userId}-${Date.now()}`
}

function toPublicUser(user: (typeof mockDb.users)[number]) {
  const { password: _password, ...rest } = user
  return rest
}

function withMessage<T>(data: T, message = 'Success') {
  return { data, message }
}

function paginate<T>(items: T[], page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return {
    items: items.slice(start, end),
    page,
    pageSize,
    total: items.length
  }
}

function prependAudit(action: string, actor?: string, context?: string) {
  mockDb.auditLogs.unshift({
    id: `log-${Date.now()}`,
    action,
    actor,
    context,
    createdAt: new Date().toISOString()
  })
}

export function handleMockRequest(ctx: MockContext): unknown {
  const path = safePath(ctx.url)

  if (path !== '/auth/login' && path !== '/auth/register') {
    assertSimulation()
  }

  // ---- Auth ----
  if (ctx.method === 'POST' && path === '/auth/login') {
    const body = (ctx.data || {}) as { email?: string; password?: string }
    const user = mockDb.users.find((u) => u.email === body.email && u.password === body.password)
    if (!user) {
      throw { status: 401, message: 'Invalid email or password' }
    }
    const accessToken = makeToken(user.id)
    const refreshToken = makeRefreshToken(user.id)
    const expiresAt = Date.now() + 60_000
    mockDb.tokens[accessToken] = user.id
    persistMockDb()
    return withMessage(
      {
        user: toPublicUser(user),
        token: accessToken,
        accessToken,
        refreshToken,
        expiresAt,
        permissions: user.permissions
      },
      'Login successful'
    )
  }

  if (ctx.method === 'POST' && path === '/auth/register') {
    const body = (ctx.data || {}) as {
      name?: string
      email?: string
      password?: string
      role?: MockRole
      institution?: string
    }

    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')
    const role = (body.role || 'public_user') as MockRole

    if (!name || !email || !password) {
      throw { status: 400, message: 'Name, email, and password are required' }
    }

    if (mockDb.users.some((u) => u.email.toLowerCase() === email)) {
      throw { status: 409, message: 'Email already exists' }
    }

    const userId = `u-${mockDb.users.length + 1}`
    const defaultPermissions =
      (mockDb.rolePermissions[role] || []).slice()

    const newUser = {
      id: userId,
      name,
      email,
      password,
      role,
      active: true,
      permissions: defaultPermissions,
      institution: body.institution
    }

    mockDb.users.push(newUser)

    const accessToken = makeToken(userId)
    const refreshToken = makeRefreshToken(userId)
    const expiresAt = Date.now() + 60_000
    mockDb.tokens[accessToken] = userId
    persistMockDb()

    return withMessage(
      {
        user: toPublicUser(newUser),
        token: accessToken,
        accessToken,
        refreshToken,
        expiresAt,
        permissions: newUser.permissions
      },
      'Registration successful'
    )
  }

  if (ctx.method === 'GET' && path === '/auth/me') {
    const user = getAuthUser(ctx.headers)
    if (!user) throw { status: 401, message: 'Unauthorized' }
    return withMessage(toPublicUser(user), 'Current user fetched')
  }

  if (ctx.method === 'POST' && path === '/auth/logout') {
    const token = parseToken(ctx.headers)
    if (token) delete mockDb.tokens[token]
    persistMockDb()
    return withMessage({ ok: true }, 'Logout successful')
  }

  if (ctx.method === 'POST' && path === '/auth/refresh') {
    const user = getAuthUser(ctx.headers)
    if (!user) throw { status: 401, message: 'Unauthorized' }
    const accessToken = makeToken(user.id)
    const refreshToken = makeRefreshToken(user.id)
    const expiresAt = Date.now() + 60_000
    mockDb.tokens[accessToken] = user.id
    persistMockDb()
    return withMessage({ token: accessToken, accessToken, refreshToken, expiresAt }, 'Token refreshed')
  }

  // ---- Dashboard ----
  if (ctx.method === 'GET' && path === '/analytics/overview') {
    return withMessage({
      totalUsers: mockDb.users.length,
      totalResources: 42,
      pendingApprovals:
        mockDb.researcherRequests.filter((r) => r.status === 'pending').length +
        mockDb.resourceRequests.filter((r) => r.status === 'pending').length,
      recentActivity: [
        { id: 'a1', action: 'Approved user', actor: 'Admin User', createdAt: 'Today 10:12' },
        { id: 'a2', action: 'Updated role', actor: 'Super Admin', createdAt: 'Today 09:40' }
      ]
    }, 'Overview fetched')
  }

  // ---- Users ----
  if (ctx.method === 'GET' && path === '/admin/users') {
    const q = String(ctx.params?.q || '').trim().toLowerCase()
    const page = Number(ctx.params?.page || 1)
    const pageSize = Number(ctx.params?.pageSize || 10)

    const filtered = mockDb.users
      .filter((u) => {
        if (!q) return true
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      })
      .map((u) => toPublicUser(u))

    return withMessage(paginate(filtered, page, pageSize), 'Users fetched')
  }

  const statusMatch = path.match(/^\/admin\/users\/([^/]+)\/status$/)
  if (ctx.method === 'PATCH' && statusMatch) {
    const userId = decodeURIComponent(statusMatch[1])
    const body = (ctx.data || {}) as { active?: boolean }
    const user = mockDb.users.find((u) => u.id === userId)
    if (!user) throw { status: 404, message: 'User not found' }
    user.active = Boolean(body.active)
    persistMockDb()
    return withMessage(toPublicUser(user), 'User status updated')
  }

  const assignRoleMatch = path.match(/^\/users\/([^/]+)\/roles$/)
  if (ctx.method === 'POST' && assignRoleMatch) {
    const userId = decodeURIComponent(assignRoleMatch[1])
    const body = (ctx.data || {}) as { role?: MockRole }
    const user = mockDb.users.find((u) => u.id === userId)
    if (!user) throw { status: 404, message: 'User not found' }
    if (!body.role) throw { status: 400, message: 'Role is required' }
    user.role = body.role
    user.permissions = (mockDb.rolePermissions[body.role] || []).slice()
    persistMockDb()
    return withMessage({ ok: true, user: toPublicUser(user) }, 'Role assigned')
  }

  if (ctx.method === 'GET' && path === '/roles') {
    return withMessage(
      mockDb.roles.map((role) => ({
        id: role.id,
        key: role.id,
        name: role.name,
        description: role.description,
        permissions: mockDb.rolePermissions[role.id] || [],
        isSystem: Boolean(role.isSystem)
      })),
      'Roles fetched'
    )
  }

  if (ctx.method === 'POST' && path === '/roles') {
    const actor = getAuthUser(ctx.headers)
    if (!actor) {
      throw { status: 401, message: 'Unauthorized' }
    }

    const body = (ctx.data || {}) as { name?: string; description?: string; permissions?: string[]; isSystem?: boolean }
    const name = String(body.name || '').trim().slice(0, 64)
    const description = body.description
    const permissions = Array.isArray(body.permissions) ? body.permissions.filter((p) => typeof p === 'string') : []

    if (!name) throw { status: 400, message: 'Role name is required' }
    if (mockDb.roles.some((r) => r.name.toLowerCase() === name.toLowerCase())) {
      throw { status: 409, message: 'Role name already exists' }
    }

    const id = `role-${Date.now()}`
    const role = { id, name, description, isSystem: Boolean(body.isSystem) }
    mockDb.roles.push(role)
    mockDb.rolePermissions[id] = permissions
    persistMockDb()
    return withMessage({ ...role, permissions }, 'Role created')
  }

  const roleUpdateMatch = path.match(/^\/roles\/([^/]+)$/)
  if (ctx.method === 'PATCH' && roleUpdateMatch) {
    const actor = getAuthUser(ctx.headers)
    if (!actor) {
      throw { status: 401, message: 'Unauthorized' }
    }

    const roleId = decodeURIComponent(roleUpdateMatch[1])
    const role = mockDb.roles.find((r) => r.id === roleId)
    if (!role) throw { status: 404, message: 'Role not found' }

    const body = (ctx.data || {}) as { name?: string; description?: string; permissions?: string[] }

    if (typeof body.name === 'string') {
      const nextName = body.name.trim().slice(0, 64)
      if (!nextName) throw { status: 400, message: 'Role name cannot be empty' }
      if (mockDb.roles.some((r) => r.id !== roleId && r.name.toLowerCase() === nextName.toLowerCase())) {
        throw { status: 409, message: 'Role name already exists' }
      }
      role.name = nextName
    }

    if (body.description !== undefined) {
      role.description = body.description
    }

    if (Array.isArray(body.permissions)) {
      mockDb.rolePermissions[roleId] = body.permissions.filter((p) => typeof p === 'string')
      mockDb.users.forEach((user) => {
        if (user.role === role.id) user.permissions = mockDb.rolePermissions[roleId].slice()
      })
    }

    persistMockDb()
    return withMessage(
      { id: role.id, name: role.name, description: role.description, permissions: mockDb.rolePermissions[roleId] || [], isSystem: Boolean(role.isSystem) },
      'Role updated'
    )
  }

  const roleDeleteMatch = path.match(/^\/roles\/([^/]+)$/)
  if (ctx.method === 'DELETE' && roleDeleteMatch) {
    const actor = getAuthUser(ctx.headers)
    if (!actor) {
      throw { status: 401, message: 'Unauthorized' }
    }

    const roleId = decodeURIComponent(roleDeleteMatch[1])
    if (roleId === 'super_admin') throw { status: 403, message: 'Cannot delete protected role' }

    if (mockDb.users.some((u) => u.role === roleId)) {
      throw { status: 409, message: 'Cannot delete role while users are assigned to it' }
    }

    const idx = mockDb.roles.findIndex((r) => r.id === roleId)
    if (idx === -1) throw { status: 404, message: 'Role not found' }

    const [removed] = mockDb.roles.splice(idx, 1)
    delete mockDb.rolePermissions[roleId]
    prependAudit('Role deleted', actor.name, `${roleId}: ${removed.name}`)
    persistMockDb()
    return withMessage({ ok: true }, 'Role deleted')
  }

  // ---- Permissions ----
  const rolePermMatch = path.match(/^\/roles\/([^/]+)\/permissions$/)
  if (rolePermMatch) {
    const roleId = decodeURIComponent(rolePermMatch[1])
    const role = mockDb.roles.find((r) => r.id === roleId)
    if (!role) throw { status: 404, message: 'Role not found' }

    if (!mockDb.rolePermissions[roleId]) mockDb.rolePermissions[roleId] = []
    const perms = mockDb.rolePermissions[roleId]

    const body = (ctx.data || {}) as { permission?: string }
    const permission = String(body.permission || '').trim()
    if (!permission) throw { status: 400, message: 'Permission is required' }

    if (ctx.method === 'POST') {
      if (!perms.includes(permission)) perms.push(permission)
      mockDb.users.forEach((user) => {
        if (user.role === roleId) user.permissions = perms.slice()
      })
      persistMockDb()
      return withMessage({ ok: true, permissions: perms }, 'Permission added')
    }

    if (ctx.method === 'DELETE') {
      mockDb.rolePermissions[roleId] = perms.filter((p) => p !== permission)
      mockDb.users.forEach((user) => {
        if (user.role === roleId) user.permissions = mockDb.rolePermissions[roleId].slice()
      })
      persistMockDb()
      return withMessage({ ok: true, permissions: mockDb.rolePermissions[roleId] }, 'Permission removed')
    }
  }

  // ---- Researcher approvals ----
  if (ctx.method === 'GET' && (path === '/admin/researcher-requests' || path === '/admin/researchers/requests')) {
    return withMessage(
      {
        items: mockDb.researcherRequests,
        page: 1,
        pageSize: mockDb.researcherRequests.length || 10,
        total: mockDb.researcherRequests.length
      },
      'Researcher requests fetched'
    )
  }

  const researcherActionMatch = path.match(/^\/admin\/(?:researcher-requests|researchers\/requests)\/([^/]+)\/(approve|reject)$/)
  if (ctx.method === 'POST' && researcherActionMatch) {
    const item = mockDb.researcherRequests.find((entry) => entry.id === decodeURIComponent(researcherActionMatch[1]))
    if (!item) throw { status: 404, message: 'Researcher request not found' }
    item.status = researcherActionMatch[2] === 'approve' ? 'approved' : 'rejected'
    prependAudit('Researcher request reviewed', getAuthUser(ctx.headers)?.name, `${item.id}: ${item.status}`)
    persistMockDb()
    return withMessage(item, `Researcher request ${item.status}`)
  }

  // ---- Resource approvals ----
  if (ctx.method === 'GET' && (path === '/admin/resource-requests' || path === '/admin/resources/pending')) {
    return withMessage(
      {
        items: mockDb.resourceRequests,
        page: 1,
        pageSize: mockDb.resourceRequests.length || 10,
        total: mockDb.resourceRequests.length
      },
      'Resource requests fetched'
    )
  }

  const resourceActionMatch = path.match(/^\/admin\/(?:resource-requests|resources)\/([^/]+)\/(approve|reject)$/)
  if (ctx.method === 'POST' && resourceActionMatch) {
    const item = mockDb.resourceRequests.find((entry) => entry.id === decodeURIComponent(resourceActionMatch[1]))
    if (!item) throw { status: 404, message: 'Resource request not found' }
    item.status = resourceActionMatch[2] === 'approve' ? 'approved' : 'rejected'
    prependAudit('Resource request reviewed', getAuthUser(ctx.headers)?.name, `${item.id}: ${item.status}`)
    persistMockDb()
    return withMessage(item, `Resource request ${item.status}`)
  }

  // ---- Reports ----
  if (ctx.method === 'GET' && path === '/admin/reports') {
    const page = Number(ctx.params?.page || 1)
    const pageSize = Number(ctx.params?.pageSize || 10)
    return withMessage(paginate(mockDb.reports, page, pageSize), 'Reports fetched')
  }

  const reportResolveMatch = path.match(/^\/admin\/reports\/([^/]+)\/resolve$/)
  if (ctx.method === 'POST' && reportResolveMatch) {
    const report = mockDb.reports.find((item) => item.id === decodeURIComponent(reportResolveMatch[1]))
    if (!report) throw { status: 404, message: 'Report not found' }
    report.status = 'resolved'
    prependAudit('Report resolved', getAuthUser(ctx.headers)?.name, report.id)
    persistMockDb()
    return withMessage(report, 'Report resolved')
  }

  // ---- Audit logs ----
  if (ctx.method === 'GET' && path === '/admin/audit-logs') {
    const page = Number(ctx.params?.page || 1)
    const pageSize = Number(ctx.params?.pageSize || 20)
    return withMessage(paginate(mockDb.auditLogs, page, pageSize), 'Audit logs fetched')
  }

  if (ctx.method === 'POST' && path === '/admin/audit-log') {
    const actor = getAuthUser(ctx.headers)
    if (!actor) throw { status: 401, message: 'Unauthorized' }
    const body = (ctx.data || {}) as { action?: string; context?: string }
    if (!body.action) throw { status: 400, message: 'Action is required' }
    
    const log = {
      id: `log-${Date.now()}`,
      action: body.action,
      actor: actor.name,
      context: body.context,
      createdAt: new Date().toISOString()
    }
    mockDb.auditLogs.unshift(log)
    persistMockDb()
    return withMessage(log, 'Audit log created')
  }

  // ---- Dev tools ----
  if (ctx.method === 'GET' && path === '/dev/mock/state') {
    return withMessage({
      users: mockDb.users.map(toPublicUser),
      roles: mockDb.roles,
      rolePermissions: mockDb.rolePermissions,
      simulation: mockDb.simulation
    }, 'Mock state fetched')
  }

  if (ctx.method === 'POST' && path === '/dev/mock/reset') {
    resetMockDb()
    return withMessage({ ok: true }, 'Mock DB reset')
  }

  if (ctx.method === 'POST' && path === '/dev/mock/switch-role') {
    const body = (ctx.data || {}) as { userId?: string; role?: MockRole }
    const user = mockDb.users.find((entry) => entry.id === body.userId)
    if (!user || !body.role) throw { status: 400, message: 'User and role are required' }
    user.role = body.role
    user.permissions = (mockDb.rolePermissions[body.role] || []).slice()
    persistMockDb()
    return withMessage(toPublicUser(user), 'Role switched')
  }

  if (ctx.method === 'POST' && path === '/dev/mock/toggle-permission') {
    const body = (ctx.data || {}) as { userId?: string; permission?: string }
    const user = mockDb.users.find((entry) => entry.id === body.userId)
    const permission = String(body.permission || '').trim()
    if (!user || !permission) throw { status: 400, message: 'User and permission are required' }
    if (user.permissions.includes(permission)) {
      user.permissions = user.permissions.filter((entry) => entry !== permission)
    } else {
      user.permissions = [...user.permissions, permission]
    }
    persistMockDb()
    return withMessage(toPublicUser(user), 'Permission toggled')
  }

  if (ctx.method === 'POST' && path === '/dev/mock/simulation') {
    const body = (ctx.data || {}) as Partial<typeof mockDb.simulation>
    mockDb.simulation = {
      ...mockDb.simulation,
      ...body
    }
    persistMockDb()
    return withMessage(mockDb.simulation, 'Simulation updated')
  }

  throw { status: 404, message: `Mock route not implemented: ${ctx.method} ${path}` }
}


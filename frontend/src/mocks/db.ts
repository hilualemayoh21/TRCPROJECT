export type MockRole = 'super_admin' | 'admin' | 'moderator' | 'researcher' | 'public_user'

export type MockUser = {
  id: string
  name: string
  email: string
  password: string
  role: MockRole
  active: boolean
  permissions: string[]
  institution?: string
}

export type MockRoleDef = {
  id: string
  name: string
  description?: string
  isSystem?: boolean
}

export type MockApprovalItem = {
  id: string
  name?: string
  email?: string
  institution?: string
  title?: string
  submittedBy?: string
  submittedAt?: string
  status: 'pending' | 'approved' | 'rejected'
}

export type MockSimulationState = {
  forceUnauthorized: boolean
  forceForbidden: boolean
  forceNetworkError: boolean
}

export type MockReport = {
  id: string
  reporter: string
  reason: string
  status: 'open' | 'resolved'
  createdAt: string
}

export type MockAuditLog = {
  id: string
  action: string
  actor?: string
  context?: string
  createdAt: string
}

type MockDbSnapshot = {
  users: MockUser[]
  roles: MockRoleDef[]
  rolePermissions: Record<string, string[]>
  researcherRequests: MockApprovalItem[]
  resourceRequests: MockApprovalItem[]
  reports: MockReport[]
  auditLogs: MockAuditLog[]
  tokens: Record<string, string>
  simulation: MockSimulationState
}

const MOCK_DB_STORAGE_KEY = 'trc_mock_db_v1'

const initialUsers: MockUser[] = [
  {
    id: 'u-1',
    name: 'Super Admin',
    email: 'super@trc.local',
    password: 'password123',
    role: 'super_admin',
    active: true,
    permissions: ['*']
  },
  {
    id: 'u-2',
    name: 'Admin User',
    email: 'admin@trc.local',
    password: 'password123',
    role: 'admin',
    active: true,
    permissions: ['manage_users', 'manage_roles', 'approve_resources', 'approve_researchers', 'view_reports', 'resolve_reports']
  },
  {
    id: 'u-3',
    name: 'Researcher One',
    email: 'researcher@trc.local',
    password: 'password123',
    role: 'researcher',
    active: true,
    permissions: ['upload_resource'],
    institution: 'Mekelle University'
  }
]

const initialRoles: MockRoleDef[] = [
  { id: 'super_admin', name: 'Super Admin', isSystem: true },
  { id: 'admin', name: 'Admin', isSystem: true },
  { id: 'moderator', name: 'Moderator', isSystem: true },
  { id: 'researcher', name: 'Researcher', isSystem: true },
  { id: 'public_user', name: 'Public User', isSystem: true }
]

const initialRolePermissionsMap: Record<string, string[]> = {
  super_admin: ['*'],
  admin: ['manage_users', 'manage_roles', 'approve_resources', 'approve_researchers', 'view_reports', 'resolve_reports'],
  moderator: ['approve_resources', 'view_reports'],
  researcher: ['upload_resource'],
  public_user: []
}

const initialResearcherRequests: MockApprovalItem[] = [
  {
    id: 'rr-1',
    name: 'Abel Tesfay',
    email: 'abel@trc.local',
    institution: 'Aksum University',
    submittedAt: '2026-04-26T09:00:00Z',
    status: 'pending'
  }
]

const initialResourceRequests: MockApprovalItem[] = [
  {
    id: 'res-1',
    title: 'Aksum Heritage Survey',
    submittedBy: 'Researcher One',
    submittedAt: '2026-04-26T10:15:00Z',
    status: 'pending'
  }
]

const initialReports: MockReport[] = [
  {
    id: 'rep-1',
    reporter: 'Public User',
    reason: 'Suspected duplicate historical file',
    status: 'open',
    createdAt: '2026-04-26T11:00:00Z'
  },
  {
    id: 'rep-2',
    reporter: 'Researcher One',
    reason: 'Metadata mismatch',
    status: 'resolved',
    createdAt: '2026-04-25T16:20:00Z'
  }
]

const initialAuditLogs: MockAuditLog[] = [
  {
    id: 'log-1',
    action: 'User role changed',
    actor: 'Admin User',
    context: 'u-3 -> researcher',
    createdAt: '2026-04-26T12:10:00Z'
  },
  {
    id: 'log-2',
    action: 'Resource approved',
    actor: 'Admin User',
    context: 'res-1',
    createdAt: '2026-04-26T12:00:00Z'
  }
]

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

export const mockDb: {
  users: MockUser[]
  roles: MockRoleDef[]
  rolePermissions: Record<string, string[]>
  researcherRequests: MockApprovalItem[]
  resourceRequests: MockApprovalItem[]
  reports: MockReport[]
  auditLogs: MockAuditLog[]
  tokens: Record<string, string>
  simulation: MockSimulationState
} = {
  users: clone(initialUsers),
  roles: clone(initialRoles),
  rolePermissions: clone(initialRolePermissionsMap),
  researcherRequests: clone(initialResearcherRequests),
  resourceRequests: clone(initialResourceRequests),
  reports: clone(initialReports),
  auditLogs: clone(initialAuditLogs),
  tokens: {},
  simulation: {
    forceUnauthorized: false,
    forceForbidden: false,
    forceNetworkError: false
  }
}

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function snapshotMockDb(): MockDbSnapshot {
  return {
    users: clone(mockDb.users),
    roles: clone(mockDb.roles),
    rolePermissions: clone(mockDb.rolePermissions),
    researcherRequests: clone(mockDb.researcherRequests),
    resourceRequests: clone(mockDb.resourceRequests),
    reports: clone(mockDb.reports),
    auditLogs: clone(mockDb.auditLogs),
    tokens: clone(mockDb.tokens),
    simulation: clone(mockDb.simulation)
  }
}

function applySnapshot(snapshot: Partial<MockDbSnapshot>) {
  if (snapshot.users) mockDb.users = snapshot.users
  if (snapshot.roles) mockDb.roles = snapshot.roles
  if (snapshot.rolePermissions) mockDb.rolePermissions = snapshot.rolePermissions
  if (snapshot.researcherRequests) mockDb.researcherRequests = snapshot.researcherRequests
  if (snapshot.resourceRequests) mockDb.resourceRequests = snapshot.resourceRequests
  if (snapshot.reports) mockDb.reports = snapshot.reports
  if (snapshot.auditLogs) mockDb.auditLogs = snapshot.auditLogs
  if (snapshot.tokens) mockDb.tokens = snapshot.tokens
  if (snapshot.simulation) mockDb.simulation = snapshot.simulation
}

export function persistMockDb() {
  if (!canUseLocalStorage()) return
  localStorage.setItem(MOCK_DB_STORAGE_KEY, JSON.stringify(snapshotMockDb()))
}

export function seedMockDb() {
  if (!canUseLocalStorage()) return
  const raw = localStorage.getItem(MOCK_DB_STORAGE_KEY)
  if (!raw) {
    persistMockDb()
    return
  }

  try {
    const parsed = JSON.parse(raw) as Partial<MockDbSnapshot>
    applySnapshot(parsed)
  } catch {
    // Corrupted snapshot -> reset with defaults
    persistMockDb()
  }
}

export function resetMockDb() {
  mockDb.users = clone(initialUsers)
  mockDb.roles = clone(initialRoles)
  mockDb.rolePermissions = clone(initialRolePermissionsMap)
  mockDb.researcherRequests = clone(initialResearcherRequests)
  mockDb.resourceRequests = clone(initialResourceRequests)
  mockDb.reports = clone(initialReports)
  mockDb.auditLogs = clone(initialAuditLogs)
  mockDb.tokens = {}
  mockDb.simulation = {
    forceUnauthorized: false,
    forceForbidden: false,
    forceNetworkError: false
  }
  persistMockDb()
}

// Load persisted state at startup (browser only), seed if missing.
seedMockDb()


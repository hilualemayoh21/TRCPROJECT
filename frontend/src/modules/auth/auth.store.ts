import { defineStore } from 'pinia'
import * as authService from './auth.service'
import { permissionsMap } from '@/utils/permissions'
import type { Permission, RoleKey } from '@/modules/admin/types/admin.types'
import { getErrorMessage } from '@/utils/getErrorMessage'
import type { RefreshResponse } from '@/services/api.schemas'

type AuthUser = {
  id: string
  name?: string
  email?: string
  role: RoleKey | string
  permissions: Permission[]
  active?: boolean
  institution?: string
}

type AuthTokens = {
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
}

const AUTH_STORAGE_KEY = 'auth_session_v1'
const REFRESH_SAFETY_WINDOW_MS = 7_000
let refreshTimer: ReturnType<typeof setTimeout> | null = null
let storageListener: ((event: StorageEvent) => void) | null = null
let unloadListener: (() => void) | null = null
let isHandlingStorageEvent = false
let initializePromise: Promise<void> | null = null

function sanitizeEmail(value: string) {
  return value.trim().toLowerCase().slice(0, 254)
}

function sanitizeText(value: string, max = 256) {
  return value.trim().slice(0, max)
}

function unwrapPayload<T>(payload: any): T {
  return (payload?.data ?? payload) as T
}

function readPersistedSession(): { user: AuthUser | null; tokens: AuthTokens } | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { user: AuthUser | null; tokens: AuthTokens }
    return parsed
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    tokens: {
      accessToken: null,
      refreshToken: null,
      expiresAt: null
    } as AuthTokens,
    initialized: false,
    loading: false,
    error: null as string | null
  }),

  getters: {
    accessToken: (state) => state.tokens.accessToken,
    isAuthenticated: (state) => Boolean(state.tokens.accessToken),

    resolvedPermissions(state): string[] {
      const role = String(state.user?.role || '').toLowerCase()
      const email = String(state.user?.email || '').toLowerCase()

      // Primary admin bypass
      if (email === 'admin@trc.local' || role === 'super_admin') {
        return ['*']
      }

      if (!role) return []
      const rolePermissions = permissionsMap[role] || []
      const userPermissions = state.user?.permissions || []
      return Array.from(new Set([...rolePermissions, ...userPermissions]))
    },

    // ✅ RBAC helpers
    hasRole: (state) => (role: string) => {
      return state.user?.role === role
    },

    hasAnyRole: (state) => (roles: string[]) => {
      return roles.includes(state.user?.role || '')
    },

    can(): (permission: Permission | string) => boolean {
      return (permission: Permission | string) => {
        const resolved = this.resolvedPermissions
        if (resolved.includes('*')) return true
        return resolved.includes(String(permission))
      }
    },
  },

  actions: {
    persistSession() {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          user: this.user,
          tokens: this.tokens
        })
      )
    },

    clearPersistedSession() {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    },

    hydrateFromStorage() {
      const session = readPersistedSession()
      if (!session) return false
      this.user = session.user
      this.tokens = session.tokens
      return true
    },

    setTokens(payload: Partial<AuthTokens>) {
      this.tokens = {
        accessToken: payload.accessToken !== undefined ? payload.accessToken : this.tokens.accessToken,
        refreshToken: payload.refreshToken !== undefined ? payload.refreshToken : this.tokens.refreshToken,
        expiresAt: payload.expiresAt !== undefined ? payload.expiresAt : this.tokens.expiresAt
      }
      this.persistSession()
    },

    clearTokens() {
      this.tokens = {
        accessToken: null,
        refreshToken: null,
        expiresAt: null
      }
    },

    stopTokenTimer() {
      if (refreshTimer) {
        clearTimeout(refreshTimer)
        refreshTimer = null
      }
    },

    applyLocalLoggedOutState() {
      this.stopTokenTimer()
      this.user = null
      this.clearTokens()
    },

    startStorageSync() {
      if (typeof window === 'undefined' || storageListener) return

      storageListener = async (event: StorageEvent) => {
        if (event.key !== AUTH_STORAGE_KEY) return
        if (isHandlingStorageEvent) return

        isHandlingStorageEvent = true
        try {
          await this.initialize(true)
          // If a logout happened in another tab while we're on a protected route, redirect immediately.
          if (!this.isAuthenticated) {
            try {
              const { default: router } = await import('@/router')
              const current = router.currentRoute.value
              if (current?.meta?.requiresAuth) {
                await router.replace({ name: 'Login', query: { redirect: current.fullPath } })
              }
            } catch {
              // ignore
            }
          }
        } finally {
          isHandlingStorageEvent = false
        }
      }

      unloadListener = () => {
        this.stopStorageSync()
      }

      window.addEventListener('storage', storageListener)
      window.addEventListener('beforeunload', unloadListener)
    },

    stopStorageSync() {
      if (typeof window === 'undefined') return
      if (storageListener) {
        window.removeEventListener('storage', storageListener)
        storageListener = null
      }
      if (unloadListener) {
        window.removeEventListener('beforeunload', unloadListener)
        unloadListener = null
      }
    },

    startTokenTimer() {
      this.stopTokenTimer()
      if (!this.tokens.expiresAt || !this.tokens.accessToken) return

      const msUntilRefresh = this.tokens.expiresAt - Date.now() - REFRESH_SAFETY_WINDOW_MS
      const scheduleIn = Math.max(0, msUntilRefresh)
      refreshTimer = setTimeout(async () => {
        try {
          await this.refreshToken()
        } catch {
          await this.logout()
        }
      }, scheduleIn)
    },

    async refreshToken() {
      if (!this.tokens.refreshToken) throw new Error('No refresh token available')

      const res = await authService.refresh(this.tokens.refreshToken)
      const payload = unwrapPayload<RefreshResponse>(res.data)

      this.setTokens({
        accessToken: payload.token || payload.accessToken,
        refreshToken: payload.refreshToken ?? this.tokens.refreshToken,
        expiresAt: payload.expiresAt ?? Date.now() + 60_000
      })
      this.startTokenTimer()
      return payload
    },

    async validateSessionWithMe() {
      const meRes = await authService.me()
      this.user = unwrapPayload<AuthUser>(meRes.data)
      this.persistSession()
    },

    async initialize(isFromStorageEvent = false) {
      if (initializePromise) return initializePromise

      initializePromise = (async () => {
      this.startStorageSync()

      const hasSession = this.hydrateFromStorage()
      if (!hasSession || !this.tokens.accessToken) {
        this.applyLocalLoggedOutState()
        this.initialized = true
        return
      }

      const isExpired = !this.tokens.expiresAt || this.tokens.expiresAt <= Date.now()

      try {
        if (isExpired) {
          await this.refreshToken()
        }
        await this.validateSessionWithMe()
        this.startTokenTimer()
        this.initialized = true
      } catch {
        if (isFromStorageEvent) {
          this.applyLocalLoggedOutState()
          this.initialized = true
          return
        }
        await this.logout()
      }
      })().finally(() => {
        initializePromise = null
      })

      return initializePromise
    },

    setUser(user: AuthUser) {
      this.user = user
      this.persistSession()
    },

    updateCurrentUser(patch: Partial<AuthUser>) {
      if (!this.user) return
      this.user = {
        ...this.user,
        ...patch,
        permissions: patch.permissions ?? this.user.permissions
      }
      this.persistSession()
    },

    getPostLoginRoute() {
      const role = String(this.user?.role || '').toLowerCase();
      const email = String(this.user?.email || '').toLowerCase();
      console.info('[AuthStore] Determining post-login route for:', { email, role });
      
      // Safety fallback for the primary admin account
      const isAdminEmail = email === 'admin@trc.local';
      const isAdminRole = role === 'admin' || role === 'super_admin';
      
      const route = (isAdminEmail || isAdminRole) ? '/admin' : '/dashboard';
      console.info('[AuthStore] Selected route:', route);
      return route;
    },

    // ✅ Login
    async login(credentials: { email: string; password: string }) {
      this.loading = true
      this.error = null

      try {
        const res = await authService.login({
          email: sanitizeEmail(credentials.email),
          password: sanitizeText(credentials.password, 512)
        })
        const payload = unwrapPayload<{
          user: AuthUser
          token?: string
          accessToken?: string
          refreshToken?: string
          expiresAt?: number
          permissions?: Permission[]
        }>(res.data)

        this.user = {
          ...payload.user,
          permissions: payload.permissions ?? payload.user.permissions ?? []
        }
        this.setTokens({
          accessToken: payload.token || payload.accessToken || null,
          refreshToken: payload.refreshToken || null,
          expiresAt: payload.expiresAt ?? Date.now() + 60_000
        })
        this.startTokenTimer()
        this.persistSession()

        return res
      } catch (err: any) {
        this.error = getErrorMessage(err, 'Login failed')
        throw err
      } finally {
        this.loading = false
      }
    },

    // ✅ Register
    async register(data: {
      name: string
      email: string
      password: string
      role?: RoleKey | string
      institution?: string
    }) {
      this.loading = true
      this.error = null

      try {
        const res = await authService.register({
          ...data,
          name: sanitizeText(data.name, 128),
          email: sanitizeEmail(data.email),
          password: sanitizeText(data.password, 512),
          institution: data.institution ? sanitizeText(data.institution, 128) : undefined
        })
        const payload = unwrapPayload<{
          user: AuthUser
          token?: string
          accessToken?: string
          refreshToken?: string
          expiresAt?: number
          permissions?: Permission[]
        }>(res.data)

        this.user = {
          ...payload.user,
          permissions: payload.permissions ?? payload.user.permissions ?? []
        }
        this.setTokens({
          accessToken: payload.token || payload.accessToken || null,
          refreshToken: payload.refreshToken || null,
          expiresAt: payload.expiresAt ?? Date.now() + 60_000
        })
        this.startTokenTimer()
        this.persistSession()

        return res
      } catch (err: any) {
        this.error = getErrorMessage(err, 'Registration failed')
        throw err
      } finally {
        this.loading = false
      }
    },

    // ✅ Logout
    async logout() {
      this.stopTokenTimer()
      try {
        await authService.logout()
      } catch {
        // ignore backend failure
      }

      this.applyLocalLoggedOutState()
      this.clearPersistedSession()
      this.initialized = true
    }
  }
})
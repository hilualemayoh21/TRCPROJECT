import { api } from '@/services/api.adapter'
import type {
  AuthResponse,
  RefreshResponse,
  User as AuthUserResponse
} from '@/services/api.schemas'

// ✅ Login
export const login = (data: { email: string; password: string }) => {
  return api.post<AuthResponse>('/auth/login', data)
}

// ✅ Register
export const register = (data: {
  name: string
  email: string
  password: string
  role?: string
  institution?: string
}) => {
  return api.post<AuthResponse>('/auth/register', data)
}

// ✅ Current user
export const me = () => {
  return api.get<AuthUserResponse>('/auth/me')
}

// ✅ Refresh token
export const refresh = (refreshToken?: string) => {
  return api.post<RefreshResponse>('/auth/refresh', refreshToken ? { refreshToken } : undefined)
}

// ✅ Logout
export const logout = () => {
  return api.post('/auth/logout')
}
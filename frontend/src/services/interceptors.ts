import type { AxiosError, AxiosInstance } from 'axios'
import { useAuthStore } from '@/modules/auth/auth.store'

export function registerInterceptors(api: AxiosInstance) {
  // ✅ Attach token
  api.interceptors.request.use((config) => {
    const auth = useAuthStore()

    if (auth.accessToken) {
      config.headers = (config.headers ?? {}) as any
      config.headers.Authorization = `Bearer ${auth.accessToken}`
    }

    return config
  })

  // ✅ Handle response
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<any>) => {
      const auth = useAuthStore()
      const status = error.response?.status

      // 🌐 Network / CORS / timeout (no response)
      if (!error.response) {
        return Promise.reject({ message: 'Server is starting up — please wait a moment and try again.' })
      }

      // 🔐 Unauthorized → logout + redirect
      if (status === 401) {
        await auth.logout()
        try {
          const { default: router } = await import('@/router')
          const redirect = `${window.location.pathname}${window.location.search}${window.location.hash}`
          await router.replace({ name: 'Login', query: { redirect } })
        } catch {
          window.location.href = '/login'
        }
        return Promise.reject(error.response.data || { message: 'Unauthorized' })
      }

      // ⛔ Forbidden → unauthorized
      if (status === 403) {
        try {
          const { default: router } = await import('@/router')
          await router.replace({ name: 'Unauthorized' })
        } catch {
          window.location.href = '/unauthorized'
        }
        return Promise.reject(error.response.data || { message: 'Forbidden' })
      }

      return Promise.reject(error.response.data || { message: 'Request failed' })
    }
  )
}
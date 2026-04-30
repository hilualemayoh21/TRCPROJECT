import { useAuthStore } from '@/modules/auth/auth.store'
import { storeToRefs } from 'pinia'

export const useAuth = () => {
  const store = useAuthStore()
   // ✅ make state reactive
  const { user, loading, error } = storeToRefs(store)

  const login = async (email: string, password: string) => {
    return store.login({ email, password })
  }

  const register = async (name: string, email: string, password: string, role?: string, institution?: string) => {
    return store.register({ name, email, password, role, institution })
  }

  return {
    user,
    loading,
    error,
    login,
    register
  }
}
import { useAuthStore } from '@/modules/auth/auth.store'

export async function bootstrapModules() {
  const authStore = useAuthStore()

  await authStore.initialize()
}
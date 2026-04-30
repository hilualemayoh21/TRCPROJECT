<template>
  <aside
    v-if="enabled"
    class="fixed bottom-4 right-4 z-[70] w-[320px] rounded-2xl border border-violet-200 bg-white/95 p-4 shadow-2xl backdrop-blur"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-black uppercase tracking-widest text-violet-700">Mock Dev Panel</h3>
      <button class="text-xs font-bold text-gray-400 hover:text-gray-700" @click="open = !open">
        {{ open ? 'Hide' : 'Show' }}
      </button>
    </div>

    <div v-if="open" class="mt-4 space-y-4">
      <div v-if="message" class="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
        {{ message }}
      </div>

      <div>
        <label class="text-[0.65rem] font-black uppercase tracking-widest text-gray-400">Current role</label>
        <select
          v-model="selectedRole"
          class="mt-2 h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700 outline-none"
          @change="switchRole"
        >
          <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
        </select>
      </div>

      <div>
        <p class="text-[0.65rem] font-black uppercase tracking-widest text-gray-400">Manual permissions</p>
        <div class="mt-2 grid grid-cols-1 gap-2">
          <label v-for="permission in permissions" :key="permission" class="flex items-center gap-2 text-xs font-bold text-gray-700">
            <input
              type="checkbox"
              class="h-4 w-4 accent-violet-600"
              :checked="currentPermissions.includes(permission)"
              @change="togglePermission(permission)"
            />
            {{ permission }}
          </label>
        </div>
      </div>

      <div>
        <p class="text-[0.65rem] font-black uppercase tracking-widest text-gray-400">Simulation</p>
        <div class="mt-2 space-y-2">
          <label v-for="flag in simulationFlags" :key="flag.key" class="flex items-center justify-between text-xs font-bold text-gray-700">
            <span>{{ flag.label }}</span>
            <input type="checkbox" class="h-4 w-4 accent-violet-600" :checked="flag.value" @change="updateSimulation(flag.key, !flag.value)" />
          </label>
        </div>
      </div>

      <button
        type="button"
        class="h-10 w-full rounded-xl bg-gray-900 text-sm font-black text-white hover:bg-gray-800 transition"
        @click="resetDb"
      >
        Reset Mock DB
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { get, post } from '@/services/http'
import { useAuthStore } from '@/modules/auth/auth.store'
import { getErrorMessage } from '@/utils/getErrorMessage'

const enabled = String(import.meta.env.VITE_USE_MOCK_API || 'false').toLowerCase() === 'true'
const authStore = useAuthStore()
const open = ref(true)
const message = ref('')

const roles = ['super_admin', 'admin', 'moderator', 'researcher', 'public_user']
const permissions = ['manage_users', 'approve_resources', 'approve_researchers', 'view_reports', 'resolve_reports', 'upload_resource']

const selectedRole = ref(String(authStore.user?.role || 'public_user'))
const simulation = ref({
  forceUnauthorized: false,
  forceForbidden: false,
  forceNetworkError: false
})

const currentPermissions = computed(() => authStore.user?.permissions || [])
const simulationFlags = computed(() => [
  { key: 'forceUnauthorized', label: '401 unauthorized', value: simulation.value.forceUnauthorized },
  { key: 'forceForbidden', label: '403 forbidden', value: simulation.value.forceForbidden },
  { key: 'forceNetworkError', label: 'Network error', value: simulation.value.forceNetworkError }
])

async function refreshState() {
  if (!enabled) return
  try {
    const state = await get<{ users: Array<{ id: string; role: string }>; simulation: typeof simulation.value }>('/dev/mock/state')
    simulation.value = state.simulation
  } catch {}
}

async function switchRole() {
  if (!authStore.user?.id) return
  try {
    const user = await post<any>('/dev/mock/switch-role', { userId: authStore.user.id, role: selectedRole.value })
    authStore.setUser({
      ...authStore.user,
      ...user,
      permissions: user.permissions || []
    })
    message.value = `Role changed to ${selectedRole.value}`
  } catch (e) {
    message.value = getErrorMessage(e, 'Failed to switch role.')
  }
}

async function togglePermission(permission: string) {
  if (!authStore.user?.id) return
  try {
    const user = await post<any>('/dev/mock/toggle-permission', { userId: authStore.user.id, permission })
    authStore.setUser({
      ...authStore.user,
      ...user,
      permissions: user.permissions || []
    })
    message.value = `Permission updated: ${permission}`
  } catch (e) {
    message.value = getErrorMessage(e, 'Failed to toggle permission.')
  }
}

async function resetDb() {
  try {
    await post('/dev/mock/reset')
    message.value = 'Mock DB reset. Please log in again if needed.'
    authStore.logout()
  } catch (e) {
    message.value = getErrorMessage(e, 'Failed to reset mock DB.')
  }
}

async function updateSimulation(key: 'forceUnauthorized' | 'forceForbidden' | 'forceNetworkError', value: boolean) {
  try {
    const next = await post<typeof simulation.value>('/dev/mock/simulation', { [key]: value })
    simulation.value = next
    message.value = 'Simulation updated.'
  } catch (e) {
    message.value = getErrorMessage(e, 'Failed to update simulation.')
  }
}

refreshState()
</script>


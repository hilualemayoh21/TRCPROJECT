<template>
  <div
    class="group flex items-center justify-between gap-6 rounded-[1.5rem] border border-gray-100 bg-white p-5 transition-all duration-300 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/5 dark:border-white/5 dark:bg-[#0d1117] dark:hover:border-violet-500/30"
  >
    <div class="flex items-center gap-5 min-w-0">
      <!-- Icon Indicator -->
      <div 
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-500"
        :class="localEnabled ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'bg-gray-50 text-gray-400 dark:bg-white/5'"
      >
        <svg v-if="localEnabled" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      </div>

      <div class="min-w-0 space-y-1">
        <div class="flex items-center gap-3">
          <p class="text-base font-black capitalize tracking-tight text-gray-900 truncate dark:text-white">{{ permissionLabel }}</p>
          <div 
            v-if="localEnabled"
            class="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-widest text-emerald-500 ring-1 ring-inset ring-emerald-500/20"
          >
            <span class="h-1 w-1 rounded-full bg-emerald-500 animate-pulse"></span>
            Active
          </div>
        </div>
        <p class="text-xs font-medium leading-relaxed text-gray-500 line-clamp-2 dark:text-gray-400">
          {{ description || (localEnabled ? 'Currently active for this role.' : 'Inactive for this role.') }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-4 shrink-0">
      <button
        type="button"
        class="relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-500 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed"
        :class="localEnabled ? 'bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30' : 'bg-gray-200 dark:bg-white/10'"
        :disabled="!canManageRoles || loading"
        @click="toggle()"
        :aria-pressed="localEnabled"
      >
        <span
          class="inline-block h-6 w-6 transform rounded-full bg-white shadow-xl transition-transform duration-500 ease-spring"
          :class="localEnabled ? 'translate-x-7' : 'translate-x-1'"
        >
          <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
            <svg class="h-3 w-3 animate-spin text-violet-600" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Permission } from '@/modules/admin/types/admin.types'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useAuthStore } from '@/modules/auth/auth.store'
import { notifyAdminError, notifyAdminSuccess } from '@/modules/admin/utils/feedback'
import { adminApi } from '@/modules/admin/services/admin.api'

const props = defineProps<{
  roleId: string
  permission: string
  enabled: boolean
  description?: string
}>()

const emit = defineEmits<{
  (e: 'update:enabled', value: boolean): void
  (e: 'updated', payload: { permission: string; enabled: boolean; permissions?: string[] }): void
}>()

const authStore = useAuthStore()

const error = ref<string | null>(null)
const canManageRoles = computed(() => authStore.can('manage_roles'))

const localEnabled = ref(Boolean(props.enabled))
const loading = ref(false)

const roleId = computed(() => props.roleId)
const permissionKey = computed(() => String(props.permission || '').trim() as Permission)
const description = computed(() => props.description)

watch(
  () => props.enabled,
  (next) => {
    if (loading.value) return
    localEnabled.value = Boolean(next)
  }
)

const permissionLabel = computed(() => permissionKey.value.replace(/_/g, ' '))

async function addPermission(permission: Permission) {
  return adminApi.addRolePermission(roleId.value, permission)
}

async function removePermission(permission: Permission) {
  return adminApi.removeRolePermission(roleId.value, permission)
}

async function toggle() {
  error.value = null

  if (!authStore.can('manage_roles')) {
    const msg = 'You are not allowed to update role permissions.'
    error.value = msg
    notifyAdminError(new Error(msg), msg)
    return
  }

  if (!roleId.value) {
    error.value = 'Missing roleId.'
    return
  }

  const permission = permissionKey.value
  if (!permission) {
    error.value = 'Missing permission.'
    return
  }

  if (loading.value) return

  const wasEnabled = localEnabled.value
  const nextEnabled = !wasEnabled

  // ✅ Optimistic UI update
  localEnabled.value = nextEnabled
  emit('update:enabled', nextEnabled)

  loading.value = true
  try {
    let result: { ok: boolean; permissions: string[] } | undefined
    if (wasEnabled) {
      result = await removePermission(permission as Permission)
    } else {
      result = await addPermission(permission as Permission)
    }

    if (authStore.user?.role === roleId.value && result?.permissions) {
      // Refresh authStore immediately for current user.
      authStore.updateCurrentUser({ permissions: result.permissions as Permission[] })
    }

    emit('updated', { permission, enabled: nextEnabled, permissions: result?.permissions })
    notifyAdminSuccess(wasEnabled ? 'Permission removed' : 'Permission added')
    adminApi.createAuditLog({ action: wasEnabled ? 'Role permission removed' : 'Role permission added', context: `${roleId.value}: ${permission}` }).catch(() => {})
  } catch (e: any) {
    // 🔁 Roll back optimistic update
    localEnabled.value = wasEnabled
    emit('update:enabled', wasEnabled)

    error.value = getErrorMessage(e, 'Failed to update permission. Please try again.')
    notifyAdminError(e, 'Failed to update permission. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>


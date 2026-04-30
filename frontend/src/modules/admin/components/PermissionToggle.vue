<template>
  <div class="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3">
    <div class="min-w-0">
      <div class="flex items-center gap-2">
        <p class="text-sm font-black text-gray-900 truncate">{{ permissionLabel }}</p>
        <button
          v-if="description"
          type="button"
          class="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition"
          :title="description"
          aria-label="Permission description"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-7h2v7zm0-9h-2V7h2v3z"
            />
          </svg>
        </button>
      </div>
      <p v-if="error" class="mt-1 text-xs font-bold text-red-600">{{ error }}</p>
      <p v-else class="mt-1 text-xs font-semibold text-gray-500">
        {{ localEnabled ? 'Enabled' : 'Disabled' }}
      </p>
    </div>

    <div class="flex items-center gap-3 shrink-0">
      <span
        class="text-[0.7rem] font-black uppercase tracking-widest"
        :class="localEnabled ? 'text-trc' : 'text-gray-400'"
      >
        {{ localEnabled ? 'ON' : 'OFF' }}
      </span>

      <button
        type="button"
        class="relative inline-flex h-7 w-12 items-center rounded-full transition disabled:opacity-60 disabled:cursor-not-allowed"
        :class="localEnabled ? 'bg-trc' : 'bg-gray-300'"
        :disabled="!canManageRoles || loading"
        @click="toggle()"
        :aria-pressed="localEnabled"
        :aria-label="`Toggle ${permissionLabel}`"
      >
        <span
          class="inline-block h-6 w-6 transform rounded-full bg-white shadow transition"
          :class="localEnabled ? 'translate-x-5' : 'translate-x-1'"
        />
      </button>

      <span v-if="loading" class="text-xs font-bold text-gray-400">Saving…</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { del, post } from '@/services/http'
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
  return post<{ ok: boolean; permissions: string[] }>(
    `/roles/${encodeURIComponent(roleId.value)}/permissions`,
    { permission }
  )
}

async function removePermission(permission: Permission) {
  // Some backends accept body in DELETE; if yours expects query params, we can adjust.
  return del<{ ok: boolean; permissions: string[] }>(
    `/roles/${encodeURIComponent(roleId.value)}/permissions`,
    { data: { permission } }
  )
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


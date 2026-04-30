<template>
  <div class="space-y-8 animate-fade-up">
    <!-- Header Section -->
    <div class="flex flex-wrap items-start justify-between gap-4 relative">
      <div class="space-y-2 z-10">
        <h1 class="text-3xl font-black tracking-tight text-slate-900 drop-shadow-sm flex items-center gap-3">
          <div class="p-2 rounded-xl bg-trc-muted text-trc">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          Permission Matrix
        </h1>
        <p class="text-sm font-medium text-slate-500 max-w-2xl pl-12">
          Enterprise access control. Rows represent specific actions, columns define roles. Toggle individual cells to securely grant or revoke permissions.
        </p>
      </div>
    </div>

    <!-- Error State -->
    <ErrorState
      v-if="rolesQuery.isError"
      title="Failed to load roles"
      :description="errorText"
      @retry="rolesQuery.refetch()"
      class="animate-fade-in"
    />

    <!-- Main Matrix Container -->
    <div v-else class="relative overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white/70 backdrop-blur-2xl shadow-trc-card transition-all duration-500">
      
      <!-- Decorative Gradients -->
      <div class="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-trc-light/10 blur-3xl pointer-events-none mix-blend-multiply"></div>
      <div class="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-trc-accent/10 blur-3xl pointer-events-none mix-blend-multiply"></div>

      <div class="overflow-x-auto relative z-10 custom-scrollbar">
        <table class="min-w-full text-left border-collapse">
          <thead>
            <tr>
              <!-- Sticky Top-Left Corner -->
              <th class="sticky left-0 top-0 z-30 bg-slate-50/95 backdrop-blur-md border-b border-r border-slate-200/60 px-6 py-6 text-xs font-black uppercase tracking-widest text-slate-500 w-[320px] shadow-[1px_0_0_0_rgba(226,232,240,0.6)]">
                Permissions & Capabilities
              </th>
              
              <!-- Role Columns -->
              <th
                v-for="role in roles"
                :key="role.id"
                class="bg-slate-50/95 backdrop-blur-md border-b border-slate-200/60 px-6 py-6 text-center min-w-[180px] group transition-colors hover:bg-slate-100/50"
              >
                <div class="flex flex-col items-center gap-2 relative">
                  <span 
                    class="text-sm font-black uppercase tracking-widest transition-all duration-300"
                    :class="role.id === 'super_admin' ? 'text-transparent bg-clip-text bg-gradient-to-r from-trc to-trc-accent drop-shadow-sm' : 'text-slate-600'"
                  >
                    {{ role.name }}
                  </span>
                  
                  <div class="h-6 flex items-center justify-center">
                    <span
                      v-if="role.id === 'super_admin'"
                      class="rounded-full bg-trc-muted px-3 py-1 text-[0.65rem] font-black uppercase tracking-widest text-trc-dark shadow-inner border border-white/50 animate-fade-in"
                    >
                      Read-only
                    </span>
                  </div>
                </div>
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100/80">
            <!-- Loading State -->
            <tr v-if="rolesQuery.isLoading">
              <td class="px-6 py-20 text-center" :colspan="roles.length + 1">
                <div class="flex flex-col items-center justify-center gap-4">
                  <div class="relative flex items-center justify-center">
                    <div class="absolute h-12 w-12 rounded-full border-4 border-trc-muted border-t-trc animate-spin"></div>
                    <div class="h-8 w-8 rounded-full border-4 border-trc-light/30 border-b-trc-accent animate-spin-slow"></div>
                  </div>
                  <p class="text-sm font-semibold text-slate-500 animate-pulse tracking-wide">Synchronizing permissions...</p>
                </div>
              </td>
            </tr>

            <!-- Permission Rows -->
            <tr 
              v-else 
              v-for="(perm) in PERMISSIONS" 
              :key="perm.key" 
              v-memo="[perm.key, roles.length, permissionsVersion]"
              class="group/row hover:bg-trc-muted/10 transition-colors duration-300"
            >
              <!-- Sticky Row Header -->
              <td class="sticky left-0 z-20 bg-white/95 backdrop-blur-md group-hover/row:bg-slate-50/95 border-r border-slate-200/60 px-6 py-5 shadow-[1px_0_0_0_rgba(226,232,240,0.6)] transition-colors duration-300">
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2">
                    <p class="text-[0.9rem] font-black text-slate-800 tracking-tight">{{ formatKey(perm.key) }}</p>
                    
                    <!-- Tooltip -->
                    <div class="relative flex items-center group/tooltip">
                      <button
                        type="button"
                        class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-trc-muted hover:text-trc transition-colors duration-200 focus:outline-none"
                        aria-label="Permission description"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-7h2v7zm0-9h-2V7h2v3z"/>
                        </svg>
                      </button>
                      <div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden w-56 rounded-xl bg-slate-800 px-3.5 py-2.5 text-xs font-medium leading-relaxed text-slate-100 shadow-xl group-hover/tooltip:block z-50 animate-fade-up">
                        {{ perm.description }}
                        <div class="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-slate-800"></div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Bulk Actions (Hover Revealed) -->
                  <div class="flex items-center gap-2 h-7 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 transform translate-y-1 group-hover/row:translate-y-0">
                    <button
                      v-if="canManageRoles"
                      type="button"
                      class="rounded-lg bg-trc-muted hover:bg-trc hover:text-white px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wider text-trc-dark transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                      :disabled="bulkLoading[perm.key] === true"
                      @click="bulkSet(perm.key, true)"
                      title="Enable for all roles (except super_admin)"
                    >
                      Enable All
                    </button>
                    <button
                      v-if="canManageRoles"
                      type="button"
                      class="rounded-lg bg-slate-100 hover:bg-slate-200 hover:text-slate-700 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wider text-slate-500 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                      :disabled="bulkLoading[perm.key] === true"
                      @click="bulkSet(perm.key, false)"
                      title="Disable for all roles (except super_admin)"
                    >
                      Disable All
                    </button>
                    <div v-if="bulkLoading[perm.key]" class="flex items-center gap-1.5 pl-1 text-[0.65rem] font-bold text-trc animate-fade-in">
                      <svg class="animate-spin h-3 w-3" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Applying
                    </div>
                  </div>
                </div>
              </td>

              <!-- Data Cells -->
              <td v-for="role in roles" :key="role.id" class="px-6 py-5">
                <div class="flex items-center justify-center">
                  <button
                    type="button"
                    class="relative inline-flex h-[1.75rem] w-[3.25rem] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-4 focus-visible:ring-trc-light/50 disabled:cursor-not-allowed disabled:opacity-50"
                    :class="isEnabled(role.id, perm.key) ? 'bg-trc shadow-inner' : 'bg-slate-200 shadow-inner hover:bg-slate-300'"
                    :disabled="!canManageRoles || role.id === 'super_admin' || isCellLoading(role.id, perm.key)"
                    @click="toggleCell(role.id, perm.key)"
                    :aria-pressed="isEnabled(role.id, perm.key)"
                    :title="role.id === 'super_admin' ? 'super_admin is read-only' : ''"
                  >
                    <span class="sr-only">Toggle {{ perm.key }} for {{ role.name }}</span>
                    
                    <!-- Loading Spinner inside switch -->
                    <span 
                      v-if="isCellLoading(role.id, perm.key)" 
                      class="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                    >
                      <svg class="h-3.5 w-3.5 animate-spin text-white drop-shadow-md" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>

                    <!-- Switch thumb -->
                    <span
                      class="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                      :class="[
                        isEnabled(role.id, perm.key) ? 'translate-x-[1.35rem]' : 'translate-x-0',
                        isCellLoading(role.id, perm.key) ? 'scale-50 opacity-0' : 'scale-100 opacity-100'
                      ]"
                    />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { del, post } from '@/services/http'
import { useAuthStore } from '@/modules/auth/auth.store'
import { notifyAdminError, notifyAdminSuccess } from '@/modules/admin/utils/feedback'
import { getErrorMessage } from '@/utils/getErrorMessage'
import ErrorState from '@/components/common/ErrorState.vue'
import type { Permission } from '@/modules/admin/types/admin.types'
import { useRolesQuery } from '@/modules/admin/queries/useRolesQuery'

const authStore = useAuthStore()
const canManageRoles = computed(() => authStore.can('manage_roles'))

const PERMISSIONS: Array<{ key: Permission; description: string }> = [
  { key: 'manage_users', description: 'Create, edit, activate/deactivate, and assign roles to users.' },
  { key: 'manage_roles', description: 'Create, edit, and delete roles and manage their permissions.' },
  { key: 'approve_resources', description: 'Approve or reject submitted resources before publishing.' },
  { key: 'approve_researchers', description: 'Approve or reject researcher access requests.' },
  { key: 'view_reports', description: 'View abuse/issue reports submitted by users.' }
]

const formatKey = (key: string) => {
  return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const rolesQuery = useRolesQuery()
const roles = computed(() => rolesQuery.data.value ?? [])
const errorText = computed(() => getErrorMessage(rolesQuery.error.value, 'Failed to fetch roles.'))

// roleId -> Set(permission)
const localOverrides = reactive<Record<string, Set<string> | undefined>>({})
const loadingCells = reactive<Record<string, boolean>>({})
const bulkLoading = reactive<Record<string, boolean>>({})
const permissionsVersion = ref(0)

const basePermissionsMap = computed(() => {
  const map: Record<string, Set<string>> = {}
  for (const role of roles.value) {
    map[role.id] = new Set(role.permissions ?? [])
  }
  return map
})

function effectiveSet(roleId: string) {
  return localOverrides[roleId] ?? basePermissionsMap.value[roleId] ?? new Set<string>()
}

function cellKey(roleId: string, permission: string) {
  return `${roleId}:${permission}`
}

function isCellLoading(roleId: string, permission: string) {
  return loadingCells[cellKey(roleId, permission)] === true
}

function isEnabled(roleId: string, permission: Permission) {
  return effectiveSet(roleId).has(permission)
}

async function addPermission(roleId: string, permission: Permission) {
  return post<{ ok: boolean; permissions: string[] }>(
    `/roles/${encodeURIComponent(roleId)}/permissions`,
    { permission }
  )
}

async function removePermission(roleId: string, permission: Permission) {
  return del<{ ok: boolean; permissions: string[] }>(
    `/roles/${encodeURIComponent(roleId)}/permissions`,
    { data: { permission } }
  )
}

async function toggleCell(roleId: string, permission: Permission) {
  if (!canManageRoles.value) {
    notifyAdminError(new Error('You are not allowed to manage roles.'), 'You are not allowed to manage roles.')
    return
  }
  if (roleId === 'super_admin') return
  if (!roleId || !permission) return

  const key = cellKey(roleId, permission)
  if (loadingCells[key]) return

  const before = new Set(effectiveSet(roleId))
  const wasEnabled = before.has(permission)
  const optimistic = new Set(before)
  if (wasEnabled) optimistic.delete(permission)
  else optimistic.add(permission)
  localOverrides[roleId] = optimistic
  permissionsVersion.value++

  loadingCells[key] = true
  try {
    const result = wasEnabled ? await removePermission(roleId, permission) : await addPermission(roleId, permission)
    localOverrides[roleId] = new Set(result.permissions ?? [])
    permissionsVersion.value++

    if (authStore.user?.role === roleId && Array.isArray(result.permissions)) {
      authStore.updateCurrentUser({ permissions: result.permissions as Permission[] })
    }
    notifyAdminSuccess(wasEnabled ? 'Permission revoked' : 'Permission granted')
  } catch (e) {
    localOverrides[roleId] = before
    permissionsVersion.value++
    notifyAdminError(e, 'Failed to update permission.')
  } finally {
    loadingCells[key] = false
  }
}

async function bulkSet(permission: Permission, enable: boolean) {
  if (!canManageRoles.value) {
    notifyAdminError(new Error('You are not allowed to manage roles.'), 'You are not allowed to manage roles.')
    return
  }
  if (bulkLoading[permission]) return

  bulkLoading[permission] = true
  try {
    const targets = roles.value.filter((r) => r.id !== 'super_admin').map((r) => r.id)
    await Promise.all(
      targets.map(async (roleId) => {
        const current = effectiveSet(roleId).has(permission)
        if (enable === current) return
        await toggleCell(roleId, permission)
      })
    )
  } finally {
    bulkLoading[permission] = false
  }
}
</script>

<style scoped>
/* Optional custom scrollbar for the table container */
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(203, 213, 225, 0.5); /* slate-300 */
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(148, 163, 184, 0.8); /* slate-400 */
}
</style>


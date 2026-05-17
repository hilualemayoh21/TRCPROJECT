<template>
  <DashboardLayout>
    <div class="space-y-8 pb-20 bg-white dark:bg-[#0f1117] min-h-screen -m-6 md:-m-8 p-6 md:p-8">
      <!-- Premium Glass Header -->
      <div
        class="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-lg transition-all duration-500 hover:border-violet-500/30 dark:border-white/10 dark:bg-[#1a1d26]/60 dark:shadow-violet-900/10 dark:backdrop-blur-2xl"
      >
        <!-- Mesh Gradient Background -->
        <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/10 blur-[100px] opacity-0 dark:opacity-100"></div>
        <div class="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-600/5 blur-[100px] opacity-0 dark:opacity-100"></div>

        <div class="relative flex flex-wrap items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <span class="rounded-full bg-violet-500/10 px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-violet-600 ring-1 ring-inset ring-violet-500/20 dark:text-violet-400">
                Identity & Access
              </span>
            </div>
            <h1 class="text-4xl font-black tracking-tighter text-gray-900 dark:text-white lg:text-5xl">
              {{ role?.name || 'Role Authority' }}
            </h1>
            <p class="max-w-md text-sm font-medium leading-relaxed text-gray-500 dark:text-gray-400">
              Configure specialized access levels and governance rules. Changes propagate through the system in real-time.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button
              class="group flex h-12 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 text-[0.7rem] font-black uppercase tracking-widest text-gray-600 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-95 dark:border-white/5 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
              @click="router.push({ name: 'admin-roles' })"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Grid
            </button>
            <button
              v-if="canManageRoles"
              class="group flex h-12 items-center gap-2 rounded-2xl bg-red-500/10 px-6 text-[0.7rem] font-black uppercase tracking-widest text-red-500 ring-1 ring-inset ring-red-500/20 transition-all hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 active:scale-95 disabled:opacity-20 disabled:pointer-events-none"
              :disabled="role?.isSystem || roleId === 'super_admin' || isDeletingRole"
              @click="onDelete()"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.34 12m-4.72 0-.34-12M4.75 6.75h14.5M9 3.75h6m-12 3h18l-1.5 14.25a2.25 2.25 0 0 1-2.25 2.25H7.5a2.25 2.25 0 0 1-2.25-2.25L3 6.75Z" />
              </svg>
              Terminate Role
            </button>
          </div>
        </div>
      </div>

      <ErrorState
        v-if="showLoadError"
        title="Access Sync Failed"
        :description="errorText"
        class="rounded-[2.5rem] border-2 border-red-500/10 bg-red-500/5 p-12 backdrop-blur-md"
        @retry="rolesQuery.refetch()"
      />

      <div v-else class="grid gap-8 lg:grid-cols-12">
        <!-- Role Settings Card -->
        <div class="lg:col-span-4 space-y-6">
          <div class="rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-2xl shadow-gray-200/50 dark:border-white/5 dark:bg-[#1a1d26] dark:shadow-none">
            <div class="mb-8 flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-200 dark:shadow-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.67 2.67 0 1113.5 24.75L7.67 19M15 12h.01M18 12h.01M21 12h.01M12 3h.01M12 6h.01M12 9h.01" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-black tracking-tight text-gray-900 dark:text-white">Profile Control</h2>
                <p class="text-xs font-bold text-gray-400">Core role metadata</p>
              </div>
            </div>

            <div class="space-y-6">
              <div class="space-y-2">
                <label class="text-[0.65rem] font-black uppercase tracking-widest text-gray-400">Display Name</label>
                <div class="relative group">
                  <input 
                    v-model="editName" 
                    type="text"
                    :disabled="!canManageRoles || role?.isSystem"
                    class="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-4 py-3.5 text-sm font-black text-gray-900 transition-all focus:border-violet-500 focus:bg-white focus:outline-none dark:border-white/5 dark:bg-[#0f1117] dark:text-white dark:focus:border-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="e.g. Lead Moderator"
                  />
                  <div v-if="nameError" class="mt-2 text-[0.65rem] font-bold text-red-500">{{ nameError }}</div>
                </div>
              </div>

              <div class="rounded-2xl bg-gray-50/50 p-4 dark:bg-[#0f1117]">
                <span class="text-[0.6rem] font-black uppercase tracking-widest text-gray-400">Unique Identifier</span>
                <p class="mt-1 font-mono text-[0.7rem] font-bold text-violet-500">{{ role?.id }}</p>
              </div>
            </div>

            <div class="mt-10 flex gap-3">
              <button
                class="flex-1 rounded-2xl border border-gray-200 bg-white py-3.5 text-[0.7rem] font-black uppercase tracking-widest text-gray-600 transition-all hover:bg-gray-50 active:scale-95 dark:border-white/5 dark:bg-white/5 dark:text-gray-300 disabled:opacity-50 disabled:pointer-events-none"
                :disabled="!canManageRoles || isUpdatingRole || role?.isSystem"
                @click="resetName()"
              >
                Reset
              </button>
              <button
                class="flex-[2] rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-[0.7rem] font-black uppercase tracking-widest text-white shadow-lg shadow-violet-200 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:pointer-events-none dark:shadow-none"
                :disabled="!canManageRoles || isUpdatingRole || role?.isSystem"
                @click="saveName()"
              >
                <span v-if="!isUpdatingRole">Sync Changes</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Permissions Grid -->
        <div class="lg:col-span-8 space-y-4">
          <div class="mb-2 rounded-[2.5rem] border border-slate-100 bg-white p-6 px-10 shadow-2xl dark:border-white/5 dark:bg-[#1a1d26]">
            <div class="flex items-center justify-between">
              <div class="space-y-1">
                <h2 class="text-xl font-black tracking-tight text-gray-900 dark:text-white">System Privileges</h2>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Toggle specific capabilities for this security group.</p>
              </div>
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-lg font-black text-white shadow-lg shadow-violet-200 dark:shadow-none">
                {{ (role?.permissions ?? []).length }}
              </div>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-1">
            <PermissionToggle
              v-for="perm in ALL_PERMISSIONS"
              :key="perm.key"
              :role-id="role!.id"
              :permission="perm.key"
              :description="perm.description"
              :enabled="(role!.permissions ?? []).includes(perm.key)"
              :disabled="role?.isSystem"
              @updated="onPermissionToggled"
            />
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQueryClient } from '@tanstack/vue-query'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuthStore } from '@/modules/auth/auth.store'
import { getErrorMessage } from '@/utils/getErrorMessage'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import PermissionToggle from '@/modules/admin/components/PermissionToggle.vue'
import type { AdminRole, Permission } from '@/modules/admin/types/admin.types'
import { useDeleteRoleMutation, useRolesQuery, useUpdateRoleMutation } from '@/modules/admin/queries/useRolesQuery'

const ROLES_QUERY_KEY = ['roles'] as const

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const queryClient = useQueryClient()

const roleId = computed(() => String(route.params.id || ''))
const canManageRoles = computed(() => authStore.can('update_roles'))

const rolesQuery = useRolesQuery()
const roles = computed(() => {
  const data = rolesQuery.data.value as any
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.items)) return data.items
  if (Array.isArray(data?.roles)) return data.roles
  return []
})
const role = computed(() => roles.value.find((r) => r.id === roleId.value) || null)

const updateRole = useUpdateRoleMutation()
const deleteRole = useDeleteRoleMutation()

const errorText = computed(() => getErrorMessage(rolesQuery.error.value, 'Failed to fetch roles.'))
const showLoadError = computed(() => rolesQuery.isError.value && roles.value.length === 0)
const isRolesLoading = computed(
  () => rolesQuery.isLoading.value || rolesQuery.isPending.value || (rolesQuery.isFetching.value && roles.value.length === 0)
)
const isUpdatingRole = computed(() => updateRole.isPending.value)
const isDeletingRole = computed(() => deleteRole.isPending.value)

const editName = ref('')
const nameError = ref<string | null>(null)

const ALL_PERMISSIONS: Array<{ key: Permission; description: string }> = [
  // Users
  { key: 'view_users', description: 'View user list and details.' },
  { key: 'create_users', description: 'Create new users manually.' },
  { key: 'update_users', description: 'Edit users, change roles and status.' },
  { key: 'delete_users', description: 'Remove user accounts permanently.' },
  // Roles
  { key: 'view_roles', description: 'View existing roles and permissions.' },
  { key: 'create_roles', description: 'Create custom roles.' },
  { key: 'update_roles', description: 'Edit roles and change permissions.' },
  { key: 'delete_roles', description: 'Delete custom roles.' },
  // Resources
  { key: 'view_resources', description: 'View all submitted resources.' },
  { key: 'create_resources', description: 'Upload new resources.' },
  { key: 'update_resources', description: 'Edit resource metadata.' },
  { key: 'delete_resources', description: 'Remove resources from the platform.' },
  { key: 'approve_resources', description: 'Approve or reject pending resources.' },
  // Reports
  { key: 'view_reports', description: 'View user-submitted reports.' },
  { key: 'resolve_reports', description: 'Resolve reports and take action.' },
  // Researchers
  { key: 'view_researchers', description: 'View researcher verification requests.' },
  { key: 'approve_researchers', description: 'Approve or reject researcher access.' },
  // System
  { key: 'view_audit_logs', description: 'View system audit logs and activity.' },
  { key: 'view_dashboard', description: 'View the admin analytics dashboard.' }
]

watch(
  () => role.value?.name,
  (next) => {
    if (typeof next === 'string') editName.value = next
  },
  { immediate: true }
)

function resetName() {
  nameError.value = null
  editName.value = role.value?.name ?? ''
}

async function saveName() {
  nameError.value = null
  if (!canManageRoles.value) return
  const next = editName.value.trim()
  if (!next) {
    nameError.value = 'Name is required.'
    return
  }
  if (!role.value) return
  await updateRole.mutateAsync({ id: role.value.id, name: next })
}

async function onDelete() {
  if (!role.value) return
  if (!canManageRoles.value) return
  if (role.value.id === 'super_admin') return

  const ok = window.confirm(`Delete role \"${role.value.name}\"? This cannot be undone.`)
  if (!ok) return

  await deleteRole.mutateAsync({ id: role.value.id })
  router.replace({ name: 'admin-roles' })
}

function onPermissionToggled(payload: { permission: string; enabled: boolean; permissions?: string[] }) {
  if (!role.value) return
  const next = payload.permissions
  if (!next) return
  // Do not PATCH the whole role here: system roles (e.g. super_admin) reject full role updates on many backends.
  queryClient.setQueryData<AdminRole[]>(ROLES_QUERY_KEY, (prev) => {
    if (!prev) return prev
    return prev.map((r) =>
      r.id === role.value!.id ? { ...r, permissions: [...next] as Permission[] } : r
    )
  })
}
</script>


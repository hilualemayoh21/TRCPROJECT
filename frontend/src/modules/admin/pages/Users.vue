<template>
  <DashboardLayout>
    <div class="space-y-6">

      <!-- Page header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black tracking-tight text-gray-900 dark:text-white">User Management</h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage accounts, roles and access levels.
          </p>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error"
        class="rounded-2xl border px-5 py-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
        <p class="text-sm font-bold text-red-600 dark:text-red-400">{{ error }}</p>
      </div>

      <!-- Table card -->
      <section
        class="rounded-2xl border overflow-hidden shadow-sm transition-colors
               border-slate-200 bg-white dark:border-white/5 dark:bg-[#1a1d26]"
      >
        <!-- Toolbar -->
        <div class="flex flex-wrap items-center justify-between gap-3 px-6 py-4
                    border-b border-slate-100 dark:border-white/5">
          <!-- Search -->
          <div class="flex items-center gap-2 rounded-xl border px-4 py-2.5 w-full sm:w-72
                      bg-slate-50 border-slate-200 text-slate-400
                      dark:bg-white/5 dark:border-white/10 focus-within:ring-2 focus-within:ring-trc/30 transition-all">
            <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="query.q"
              type="text"
              placeholder="Search users, emails..."
              class="bg-transparent outline-none text-sm w-full font-medium text-gray-700 dark:text-gray-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
              @keydown.enter="refresh()"
            />
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="flex items-center gap-2 h-10 rounded-xl px-4 text-sm font-black transition
                     bg-slate-100 text-slate-600 hover:bg-slate-200
                     dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
              @click="refresh()"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" d="M3 12a9 9 0 109-9M3 3v5h5"/>
              </svg>
              <span class="hidden sm:inline">Filter</span>
            </button>
            <button
              v-if="canManageUsers"
              type="button"
              class="flex items-center gap-2 h-10 rounded-xl px-5 text-sm font-black
                     bg-trc text-white hover:bg-trc-dark shadow-lg shadow-trc/25 transition"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" d="M12 5v14M5 12h14"/>
              </svg>
              Add User
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <!-- Skeleton -->
          <div v-if="loading" class="p-6 space-y-3">
            <div v-for="i in 5" :key="i"
              class="h-16 rounded-xl animate-pulse bg-slate-100 dark:bg-white/5"></div>
          </div>

          <table v-else class="min-w-[700px] w-full">
            <thead>
              <tr class="border-b border-slate-100 dark:border-white/5">
                <th class="px-6 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">Name</th>
                <th class="px-6 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">Email Address</th>
                <th class="px-6 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">Role</th>
                <th class="px-6 py-3 text-left text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">Status</th>
                <th class="px-6 py-3 text-right text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-white/5">
              <tr
                v-for="u in users"
                :key="u.id"
                class="hover:bg-slate-50/80 dark:hover:bg-white/2 transition-colors"
              >
                <!-- Name + Avatar -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <img
                      :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=6C2BD9&color=fff&size=80&rounded=true`"
                      class="h-9 w-9 rounded-full shadow-sm shrink-0"
                    />
                    <span class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ u.name }}</span>
                  </div>
                </td>

                <!-- Email -->
                <td class="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {{ u.email }}
                </td>

                <!-- Role -->
                <td class="px-6 py-4">
                  <select
                    :value="u.role || 'public_user'"
                    :disabled="rowLoading[u.id]?.assignRole || !canManageUsers"
                    @change="handleRoleChange(u, ($event.target as HTMLSelectElement).value as RoleKey)"
                    class="rounded-lg border px-3 py-1.5 text-xs font-bold outline-none transition
                           border-slate-200 bg-slate-50 text-gray-700
                           dark:border-white/10 dark:bg-white/5 dark:text-gray-200
                           focus:ring-2 focus:ring-trc/30 disabled:opacity-50"
                  >
                    <option v-for="r in ROLE_OPTIONS" :key="r" :value="r">{{ r }}</option>
                  </select>
                </td>

                <!-- Status -->
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center rounded-full px-3 py-1 text-xs font-black"
                    :class="u.active
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                      : 'bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400'"
                  >
                    <span class="mr-1.5 h-1.5 w-1.5 rounded-full"
                      :class="u.active ? 'bg-emerald-500' : 'bg-red-500'"></span>
                    {{ u.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      v-if="canManageUsers"
                      type="button"
                      :disabled="rowLoading[u.id]?.status"
                      @click="toggleStatus(u.id)"
                      class="h-8 w-8 flex items-center justify-center rounded-lg border transition
                             border-slate-200 text-slate-400 hover:text-trc hover:border-trc/30
                             dark:border-white/10 dark:text-slate-500 dark:hover:text-trc"
                      :title="u.active ? 'Deactivate' : 'Activate'"
                    >
                      <svg v-if="rowLoading[u.id]?.status" class="h-4 w-4 animate-spin text-trc" viewBox="0 0 24 24" fill="none">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button
                      v-if="canManageUsers"
                      type="button"
                      class="h-8 w-8 flex items-center justify-center rounded-lg border transition
                             border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200
                             dark:border-white/10 dark:text-slate-500 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="users.length === 0 && !loading">
                <td colspan="5" class="py-16 text-center">
                  <p class="text-sm font-bold text-slate-400 dark:text-slate-600">No users found.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-white/5">
          <p class="text-xs font-bold text-slate-400 dark:text-slate-600">
            Showing {{ users.length }} of {{ pagination.total }} users
          </p>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="h-9 w-9 flex items-center justify-center rounded-xl border font-black text-sm transition
                     border-slate-200 text-slate-500 hover:bg-slate-50
                     dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5 disabled:opacity-40"
              :disabled="pagination.page <= 1 || loading"
              @click="goToPage(pagination.page - 1)"
            >‹</button>
            <span class="text-xs font-bold text-slate-400 dark:text-slate-500 px-2">
              {{ pagination.page }} / {{ totalPages }}
            </span>
            <button
              type="button"
              class="h-9 w-9 flex items-center justify-center rounded-xl border font-black text-sm transition
                     border-slate-200 text-slate-500 hover:bg-slate-50
                     dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5 disabled:opacity-40"
              :disabled="pagination.page >= totalPages || loading"
              @click="goToPage(pagination.page + 1)"
            >›</button>
          </div>
        </div>
      </section>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuthStore } from '@/modules/auth/auth.store'
import { getErrorMessage } from '@/utils/getErrorMessage'
import type { AdminUser, RoleKey } from '@/modules/admin/types/admin.types'
import {
  useAssignRoleMutation, useUpdateUserStatusMutation, useUsersQuery
} from '@/modules/admin/queries/useUsersQuery'

const router = useRouter()
const authStore = useAuthStore()
const canManageUsers = computed(() => authStore.can('manage_users'))

const query = reactive({ page: 1, pageSize: 10, q: '' })
const users = ref<AdminUser[]>([])
const error = ref<string | null>(null)
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const totalPages = computed(() => Math.max(1, Math.ceil((pagination.total || 0) / Math.max(1, pagination.pageSize))))
const ROLE_OPTIONS: RoleKey[] = ['super_admin', 'admin', 'moderator', 'researcher', 'public_user']
const rowLoading = reactive<Record<string, { status?: boolean; assignRole?: boolean }>>({})

const queryParams = computed(() => ({ page: query.page, pageSize: query.pageSize, q: query.q || undefined }))
const usersQuery = useUsersQuery(queryParams)
const updateStatusMutation = useUpdateUserStatusMutation()
const assignRoleMutation = useAssignRoleMutation()
const loading = computed(() => usersQuery.isPending.value || usersQuery.isFetching.value)

watch(() => usersQuery.data.value, (data) => {
  if (!data) return
  users.value = data.items
  pagination.page = data.page
  pagination.pageSize = data.pageSize
  pagination.total = data.total
}, { immediate: true })

watch(() => usersQuery.error.value, (queryError) => {
  if (!queryError) return
  error.value = getErrorMessage(queryError, 'Failed to load users.')
})

function setRowLoading(id: string, patch: { status?: boolean; assignRole?: boolean }) {
  rowLoading[id] = { ...(rowLoading[id] || {}), ...patch }
}

async function fetchUsers() {
  error.value = null
  await usersQuery.refetch()
}

function goToPage(page: number) {
  query.page = Math.min(Math.max(1, page), totalPages.value)
  fetchUsers()
}

function refresh() {
  query.page = 1
  fetchUsers()
}

async function toggleStatus(userId: string) {
  const u = users.value.find((x) => x.id === userId)
  if (!u) return
  setRowLoading(userId, { status: true })
  error.value = null
  const nextActive = !u.active
  try {
    const updated = await updateStatusMutation.mutateAsync({ userId, active: nextActive })
    u.active = updated.active
    if (authStore.user?.id === userId) authStore.updateCurrentUser({ active: updated.active })
  } catch (e: any) {
    error.value = getErrorMessage(e, 'Failed to update user status.')
  } finally {
    setRowLoading(userId, { status: false })
  }
}

async function handleRoleChange(user: AdminUser, newRole: RoleKey) {
  if (!canManageUsers.value) return
  const previousRole = user.role || 'public_user'
  if (previousRole === newRole) return
  user.role = newRole
  setRowLoading(user.id, { assignRole: true })
  error.value = null
  try {
    const result = await assignRoleMutation.mutateAsync({ userId: user.id, role: newRole })
    if (result?.user?.permissions) user.permissions = result.user.permissions as any
    if (authStore.user?.id === user.id)
      authStore.updateCurrentUser({ role: newRole, permissions: (result?.user?.permissions || []) as any })
  } catch (e: any) {
    user.role = previousRole
    error.value = getErrorMessage(e, 'Failed to assign role.')
  } finally {
    setRowLoading(user.id, { assignRole: false })
  }
}

if (!canManageUsers.value) router.replace({ name: 'Unauthorized' })
</script>

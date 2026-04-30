<template>
  <DashboardLayout>
    <div v-if="canManageUsers" class="space-y-6">
      <header class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 class="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Users</h1>
          <p class="mt-1 text-sm font-medium text-gray-500">
            Manage accounts, activate/deactivate users, and assign roles.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <input
            v-model="query.q"
            class="h-11 w-full md:w-80 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-trc/20"
            placeholder="Search by name or email…"
            @keydown.enter="refresh()"
          />
          <button
            type="button"
            class="h-11 rounded-2xl bg-gray-900 px-5 text-sm font-black text-white hover:bg-gray-800 transition disabled:opacity-60"
            :disabled="loading"
            @click="refresh()"
          >
            Refresh
          </button>
        </div>
      </header>

      <div v-if="error" class="rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
        <p class="text-sm font-bold text-red-700">{{ error }}</p>
      </div>

      <section class="rounded-[2rem] bg-white p-6 md:p-8 shadow-sm border border-gray-100">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Total</span>
            <span class="text-sm font-black text-gray-900 tabular-nums">{{ pagination.total }}</span>
          </div>

          <div class="flex items-center gap-2">
            <label class="text-xs font-black uppercase tracking-widest text-gray-400">Page size</label>
            <select
              v-model.number="query.pageSize"
              class="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700 outline-none"
              @change="goToPage(1)"
            >
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="mt-6 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4">
          <p class="text-sm font-bold text-gray-500">Loading users…</p>
        </div>

        <div v-else class="mt-6 overflow-x-auto">
          <table class="min-w-[960px] w-full">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="px-6 py-3 text-left text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400">
                  Name
                </th>
                <th class="px-6 py-3 text-left text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400">
                  Email
                </th>
                <th class="px-6 py-3 text-left text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400">
                  Role
                </th>
                <th class="px-6 py-3 text-left text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400">
                  Status
                </th>
                <th class="px-6 py-3 text-right text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="u in users"
                :key="u.id"
                class="border-b border-gray-50 hover:bg-gray-50/60 transition"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="h-10 w-10 rounded-xl bg-[#f3f1ff] text-trc flex items-center justify-center font-black"
                    >
                      {{ initials(u.name) }}
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-black text-gray-900 truncate">{{ u.name }}</p>
                      <p class="text-xs font-semibold text-gray-400">ID: {{ u.id }}</p>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4">
                  <p class="text-sm font-semibold text-gray-700">{{ u.email }}</p>
                </td>

                <td class="px-6 py-4">
                  <div class="flex items-center gap-3 relative">
                    <select
                      :value="u.role || 'public_user'"
                      @change="handleRoleChange(u, ($event.target as HTMLSelectElement).value as RoleKey)"
                      class="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-trc/20 disabled:opacity-50 disabled:bg-gray-50 transition-colors"
                      :disabled="rowLoading[u.id]?.assignRole === true || !canManageUsers"
                      :class="{'cursor-not-allowed': !canManageUsers}"
                      :title="!canManageUsers ? 'You do not have permission to change roles' : 'Assign role'"
                    >
                      <option v-for="r in ROLE_OPTIONS" :key="r" :value="r">{{ r }}</option>
                    </select>
                    
                    <!-- Loading Indicator -->
                    <div v-if="rowLoading[u.id]?.assignRole" class="flex items-center text-trc" title="Updating role...">
                      <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center rounded-lg border px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-widest"
                    :class="
                      u.active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-gray-50 text-gray-500 border-gray-100'
                    "
                  >
                    {{ u.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>

                <td class="px-6 py-4 text-right">
                  <button
                    v-if="canManageUsers"
                    type="button"
                    class="h-10 rounded-xl px-4 text-[0.7rem] font-black uppercase tracking-widest transition disabled:opacity-60"
                    :class="
                      u.active
                        ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white'
                    "
                    :disabled="rowLoading[u.id]?.status === true"
                    @click="toggleStatus(u.id)"
                  >
                    {{ rowLoading[u.id]?.status ? 'Saving…' : u.active ? 'Deactivate' : 'Activate' }}
                  </button>
                </td>
              </tr>

              <tr v-if="users.length === 0">
                <td colspan="5" class="py-10 text-center">
                  <p class="text-sm font-bold text-gray-500">No users found.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer class="mt-6 flex items-center justify-between gap-4">
          <p class="text-xs font-bold text-gray-400">
            Page {{ pagination.page }} of {{ totalPages }}
          </p>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="h-10 w-10 rounded-xl border border-gray-200 bg-white text-gray-700 font-black hover:bg-gray-50 transition disabled:opacity-50"
              :disabled="pagination.page <= 1 || loading"
              @click="goToPage(pagination.page - 1)"
            >
              ‹
            </button>
            <button
              type="button"
              class="h-10 w-10 rounded-xl border border-gray-200 bg-white text-gray-700 font-black hover:bg-gray-50 transition disabled:opacity-50"
              :disabled="pagination.page >= totalPages || loading"
              @click="goToPage(pagination.page + 1)"
            >
              ›
            </button>
          </div>
        </footer>
      </section>
    </div>

    <div v-else class="rounded-xl border border-gray-100 bg-white shadow-sm p-8">
      <h1 class="text-xl font-black tracking-tight text-gray-900">Users</h1>
      <p class="mt-2 text-sm font-medium text-gray-500">
        You don’t have permission to view this page.
      </p>
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
  useAssignRoleMutation,
  useUpdateUserStatusMutation,
  useUsersQuery
} from '@/modules/admin/queries/useUsersQuery'

const router = useRouter()
const authStore = useAuthStore()

const canManageUsers = computed(() => authStore.can('manage_users'))

type UsersQuery = {
  page: number
  pageSize: number
  q: string
}

const query = reactive<UsersQuery>({
  page: 1,
  pageSize: 10,
  q: ''
})

const users = ref<AdminUser[]>([])
const error = ref<string | null>(null)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const totalPages = computed(() => {
  const size = Math.max(1, pagination.pageSize)
  return Math.max(1, Math.ceil((pagination.total || 0) / size))
})

const ROLE_OPTIONS: RoleKey[] = ['super_admin', 'admin', 'moderator', 'researcher', 'public_user']
const rowLoading = reactive<Record<string, { status?: boolean; assignRole?: boolean }>>({})

const queryParams = computed(() => ({
  page: query.page,
  pageSize: query.pageSize,
  q: query.q || undefined
}))

const usersQuery = useUsersQuery(queryParams)
const updateStatusMutation = useUpdateUserStatusMutation()
const assignRoleMutation = useAssignRoleMutation()

const loading = computed(() => usersQuery.isPending.value || usersQuery.isFetching.value)

watch(
  () => usersQuery.data.value,
  (data) => {
    if (!data) return
    users.value = data.items
    pagination.page = data.page
    pagination.pageSize = data.pageSize
    pagination.total = data.total
  },
  { immediate: true }
)

watch(
  () => usersQuery.error.value,
  (queryError) => {
    if (!queryError) return
    error.value = getErrorMessage(queryError, 'Failed to load users.')
  }
)

function initials(name: string) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean)
  const a = parts[0]?.[0] ?? '?'
  const b = parts[1]?.[0] ?? ''
  return (a + b).toUpperCase()
}

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
    if (authStore.user?.id === userId) {
      authStore.updateCurrentUser({ active: updated.active })
    }
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

  // Optimistic update
  user.role = newRole
  setRowLoading(user.id, { assignRole: true })
  error.value = null

  try {
    const result = await assignRoleMutation.mutateAsync({ userId: user.id, role: newRole })

    // Sync permissions from result
    if (result?.user?.permissions) {
      user.permissions = result.user.permissions as any
    }

    // Sync with authStore if current user
    if (authStore.user?.id === user.id) {
      authStore.updateCurrentUser({
        role: newRole,
        permissions: (result?.user?.permissions || []) as any
      })
    }
  } catch (e: any) {
    // Revert optimistic update on failure
    user.role = previousRole
    error.value = getErrorMessage(e, 'Failed to assign role.')
  } finally {
    setRowLoading(user.id, { assignRole: false })
  }
}
if (!canManageUsers.value) {
  router.replace({ name: 'Unauthorized' })
}
</script>


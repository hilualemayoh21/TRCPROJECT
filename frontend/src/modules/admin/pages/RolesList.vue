<template>
  <DashboardLayout>
    <div class="space-y-8 pb-20 bg-white dark:bg-[#0f1117] min-h-screen -m-6 md:-m-8 p-6 md:p-8">
      <!-- Premium Header Section -->
      <header
        class="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-lg transition-all duration-500 hover:border-violet-500/30 dark:border-white/10 dark:bg-[#1a1d26] dark:shadow-violet-900/10"
      >
        <!-- Background Accents -->
        <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/5 blur-[100px] opacity-0 dark:opacity-100"></div>

        <div class="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <h1 class="text-4xl font-black tracking-tighter text-gray-900 dark:text-white lg:text-5xl">Roles</h1>
            <p class="max-w-md text-sm font-medium leading-relaxed text-gray-500 dark:text-gray-400">
              Create and manage administrative roles. Open a role to configure its granular permission set.
            </p>
          </div>

          <BaseButton
            v-if="canManageRoles"
            :full-width="false"
            size="md"
            label="New role"
            variant="primary"
            class="self-start shadow-xl shadow-violet-500/20 sm:self-auto"
            @click="openCreate()"
          >
            <template #icon>
              <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" d="M12 5v14M5 12h14" />
              </svg>
            </template>
          </BaseButton>
        </div>
      </header>

      <!-- Filters Section -->
      <div class="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-[#1a1d26]">
        <RolesFilters 
          v-model="filters"
        />
      </div>

      <!-- Enhanced Error State -->
      <div v-if="showLoadError" class="rounded-[2.5rem] border border-red-500/10 bg-red-500/5 p-12 text-center backdrop-blur-md">
        <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-red-500/5">
          <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-xl font-black text-gray-900 dark:text-white mb-2">Failed to load roles</h3>
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8">{{ errorText }}</p>
        <BaseButton
          :full-width="false"
          size="md"
          label="Retry Connection"
          variant="secondary"
          @click="rolesQuery.refetch()"
        />
      </div>

      <!-- Loading State -->
      <RolesSkeleton v-if="isRolesLoading" :rows="5" />

      <!-- Empty State -->
      <RolesEmptyState 
        v-else-if="filteredRoles.length === 0"
        :can-manage-roles="canManageRoles"
        @create="openCreate"
      />

      <!-- Roles Table Container -->
      <div v-else class="overflow-hidden rounded-2xl md:rounded-[2.5rem] border border-slate-200 bg-white shadow-lg dark:border-white/5 dark:bg-[#1a1d26]">
        <div class="overflow-x-auto">
          <table class="min-w-full text-left">
            <thead class="border-b border-slate-100 bg-slate-50/50 dark:border-white/5 dark:bg-white/5">
              <tr>
                <th class="px-4 md:px-6 py-3 md:py-4 text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500">Name</th>
                <th class="hidden md:table-cell px-6 py-4 text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500">ID</th>
                <th class="hidden lg:table-cell px-6 py-4 text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500">Description</th>
                <th class="hidden xl:table-cell px-6 py-4 text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500">Permissions</th>
                <th class="px-4 md:px-6 py-3 md:py-4 text-right text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 dark:divide-white/5">
              <tr v-for="role in filteredRoles" :key="role.id" class="group transition-all duration-200 hover:bg-slate-50 dark:hover:bg-violet-500/10">
                <td class="px-4 md:px-6 py-3 md:py-4">
                  <div class="flex flex-col gap-1.5">
                    <div class="flex min-w-0 items-center gap-2">
                      <p
                        class="shrink-0 truncate text-sm font-black text-gray-900 dark:text-white"
                        :title="role.name"
                      >
                        {{ role.name }}
                      </p>
                      <div class="flex shrink-0 flex-wrap items-center gap-1.5">
                        <span
                          v-if="role.isSystem"
                          class="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-widest text-blue-600 ring-1 ring-inset ring-blue-500/20 dark:text-blue-400"
                        >
                          System
                        </span>
                        <span
                          v-if="role.id === 'super_admin'"
                          class="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-widest text-purple-600 ring-1 ring-inset ring-purple-500/20 dark:text-purple-400"
                        >
                          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                          </svg>
                          Protected
                        </span>
                      </div>
                    </div>
                    <!-- Mobile-only info -->
                    <div class="md:hidden flex flex-col gap-1">
                      <code class="w-fit rounded-lg bg-gray-50 px-2 py-0.5 text-[0.65rem] font-bold text-gray-500 ring-1 ring-inset ring-gray-200 dark:bg-[#0f1117] dark:text-gray-400 dark:ring-white/5">{{ role.id }}</code>
                      <p class="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[200px]">{{ role.description || 'No description provided' }}</p>
                    </div>
                  </div>
                </td>
                <td class="hidden md:table-cell px-6 py-4">
                  <code class="rounded-lg bg-gray-50 px-2 py-1 text-[0.7rem] font-bold text-gray-500 ring-1 ring-inset ring-gray-200 dark:bg-[#0f1117] dark:text-gray-400 dark:ring-white/5">{{ role.id }}</code>
                </td>
                <td class="hidden lg:table-cell px-6 py-4">
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {{ role.description || 'No description provided' }}
                  </p>
                </td>
                <td class="hidden xl:table-cell px-6 py-4">
                  <PermissionTooltip :permissions="role.permissions" />
                </td>
                <td class="px-4 md:px-6 py-3 md:py-4">
                  <div class="flex flex-wrap items-center justify-end gap-2 md:gap-3">
                    <button
                      type="button"
                      class="rounded-lg md:rounded-xl border border-slate-200 bg-white px-3 md:px-4 py-1.5 md:py-2 text-[0.6rem] md:text-[0.65rem] font-black uppercase tracking-widest text-gray-600 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
                      @click="openEdit(role)"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      class="rounded-lg md:rounded-xl bg-violet-600 px-3 md:px-4 py-1.5 md:py-2 text-[0.6rem] md:text-[0.65rem] font-black uppercase tracking-widest text-white shadow-lg shadow-violet-500/20 transition-all hover:bg-violet-500 hover:scale-[1.02] active:scale-95"
                      @click="goToDetails(role.id)"
                    >
                      Perms
                    </button>
                    <button
                      v-if="canManageRoles"
                      type="button"
                      class="rounded-lg md:rounded-xl px-3 md:px-4 py-1.5 md:py-2 text-[0.6rem] md:text-[0.65rem] font-black uppercase tracking-widest text-red-500 transition-all hover:bg-red-500/10 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
                      :disabled="role.id === 'super_admin' || isDeletingRole"
                      @click="confirmDelete(role)"
                    >
                      Del
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <RoleForm
        v-if="modalOpen"
        :initial-data="selectedRole"
        :loading="isRoleFormLoading"
        @close="closeModal"
        @submit="submitRole"
      />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuthStore } from '@/modules/auth/auth.store'
import { getErrorMessage } from '@/utils/getErrorMessage'
import BaseButton from '@/components/ui/BaseButton.vue'
import RolesFilters from '@/modules/admin/components/RolesFilters.vue'
import PermissionTooltip from '@/modules/admin/components/PermissionTooltip.vue'
import RolesSkeleton from '@/modules/admin/components/RolesSkeleton.vue'
import RolesEmptyState from '@/modules/admin/components/RolesEmptyState.vue'
import RoleForm from '@/modules/admin/components/RoleForm.vue'
import type { AdminRole } from '@/modules/admin/types/admin.types'
import { useCreateRoleMutation, useDeleteRoleMutation, useRolesQuery, useUpdateRoleMutation } from '@/modules/admin/queries/useRolesQuery'

const router = useRouter()
const authStore = useAuthStore()

const canManageRoles = computed(() => authStore.can('manage_roles'))

// Filter state
type FilterType = 'all' | 'system' | 'custom' | 'protected'
const filters = ref({ search: '', type: 'all' as FilterType })

const rolesQuery = useRolesQuery()
const roles = computed(() => {
  const data = rolesQuery.data.value as any
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.items)) return data.items
  if (Array.isArray(data?.roles)) return data.roles
  return []
})

// 🔥 STEP 1 - LOG REAL DATA
watch(roles, (newRoles) => {
  console.log("🔍 ROLES DATA:", newRoles)
  if (newRoles.length > 0) {
    console.log("🔍 FIRST ROLE STRUCTURE:", newRoles[0])
    console.log("🔍 isSystem VALUES:", newRoles.map(r => ({ name: r.name, isSystem: r.isSystem })))
  }
}, { immediate: true })

watch(filters, (newFilters) => {
  console.log("🔍 FILTER STATE:", newFilters)
}, { deep: true, immediate: true })

// 🔥 STEP 2 - FORCE CORRECT DATA SHAPE
const normalizedRoles = computed(() => {
  return roles.value.map(role => ({
    ...role,
    isSystem: role.isSystem ?? role.type === "SYSTEM" ?? false,
    isProtected: role.isProtected ?? role.id === "super_admin" ?? role.name === "super_admin" ?? false
  }))
})

// 🔥 STEP 3 - REWRITE FILTER LOGIC CLEANLY
const filteredRoles = computed(() => {
  const normalized = normalizedRoles.value
  if (!normalized || normalized.length === 0) return []
  
  console.log("🔍 NORMALIZED ROLES:", normalized)
  console.log("🔍 CURRENT FILTER TYPE:", filters.value.type)
  
  let result = normalized
  
  // Apply search filter first
  if (filters.value.search) {
    const searchLower = filters.value.search.toLowerCase()
    result = result.filter(role => 
      role.name.toLowerCase().includes(searchLower) ||
      role.id.toLowerCase().includes(searchLower) ||
      (role.description && role.description.toLowerCase().includes(searchLower))
    )
  }
  
  // Apply type filter
  switch (filters.value.type) {
    case "system":
      result = result.filter(r => r.isSystem === true)
      break
    case "protected":
      result = result.filter(r => r.isProtected === true)
      break
    case "custom":
      result = result.filter(r => r.isSystem !== true)
      break
    case "all":
    default:
      // No filtering
      break
  }
  
  console.log("🔍 FILTERED RESULT:", result)
  return result
}, [normalizedRoles, filters])

const createRole = useCreateRoleMutation()
const updateRole = useUpdateRoleMutation()
const deleteRole = useDeleteRoleMutation()

const errorText = computed(() => getErrorMessage(rolesQuery.error.value, 'Failed to fetch roles.'))
const showLoadError = computed(() => rolesQuery.isError.value && roles.value.length === 0)
const isRolesLoading = computed(
  () => rolesQuery.isLoading.value || rolesQuery.isPending.value || (rolesQuery.isFetching.value && roles.value.length === 0)
)
const isDeletingRole = computed(() => deleteRole.isPending.value)
const isRoleFormLoading = computed(() => createRole.isPending.value || updateRole.isPending.value)

const modalOpen = ref(false)
const selectedRole = ref<AdminRole | null>(null)

function openCreate() {
  selectedRole.value = null
  modalOpen.value = true
}

function openEdit(role: AdminRole) {
  selectedRole.value = { ...role }
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  selectedRole.value = null
}

async function submitRole(payload: { name: string; description?: string }) {
  try {
    if (selectedRole.value) {
      await updateRole.mutateAsync({ 
        id: selectedRole.value.id, 
        name: payload.name, 
        description: payload.description 
      })
    } else {
      await createRole.mutateAsync({ 
        name: payload.name, 
        description: payload.description, 
        permissions: [] 
      })
    }
    closeModal()
  } catch (e) {
    // Errors are already handled globally by the mutation with a toast
  }
}

function goToDetails(id: string) {
  router.push({ name: 'admin-role-details', params: { id } })
}

async function confirmDelete(role: AdminRole) {
  if (role.id === 'super_admin') return
  if (!authStore.can('manage_roles')) return

  const ok = window.confirm(`Delete role \"${role.name}\"? This cannot be undone.`)
  if (!ok) return
  await deleteRole.mutateAsync({ id: role.id })
}
</script>


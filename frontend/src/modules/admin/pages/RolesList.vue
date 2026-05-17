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
            v-if="canCreateRoles"
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
        :can-manage-roles="canCreateRoles"
        @create="openCreate"
      />

      <!-- Roles List Container -->
      <div v-else class="flex flex-col gap-4">
        <div
          v-for="role in filteredRoles"
          :key="role.id"
          class="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-violet-200 hover:shadow-violet-500/5 dark:border-white/5 dark:bg-[#1a1d26] dark:hover:border-violet-500/30 dark:hover:bg-[#1e212b]"
        >
          <!-- Left: Info -->
          <div class="flex items-start sm:items-center gap-5 min-w-0">
            <!-- Role Icon -->
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition-transform duration-300 group-hover:scale-110 dark:bg-violet-500/10 dark:text-violet-400">
              <svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <div class="flex flex-col gap-1.5 min-w-0">
              <div class="flex flex-wrap items-center gap-3">
                <h3 class="truncate text-xl font-black tracking-tight text-gray-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
                  {{ role.name }}
                </h3>
                <div class="flex shrink-0 items-center gap-2">
                  <span
                    v-if="role.isSystem"
                    class="inline-flex items-center rounded-lg bg-blue-500/10 px-2 py-1 text-[0.65rem] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400"
                  >
                    System
                  </span>
                  <span
                    v-if="role.id === 'super_admin'"
                    class="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 px-2 py-1 text-[0.65rem] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400"
                  >
                    <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    Protected
                  </span>
                </div>
              </div>
              
              <div class="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                <code class="rounded-md bg-slate-100 px-2 py-0.5 text-[0.7rem] font-bold text-slate-600 dark:bg-white/5 dark:text-slate-400">
                  {{ role.id }}
                </code>
                <span class="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                <p class="truncate max-w-sm">{{ role.description || 'No description provided' }}</p>
              </div>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex flex-row items-center justify-between sm:justify-end gap-6 sm:pl-4">
            <!-- Permissions Count/Tooltip -->
            <div class="hidden lg:flex flex-col items-center justify-center shrink-0 min-w-[80px]">
              <span class="text-[0.6rem] font-black uppercase tracking-widest text-slate-400 mb-1.5">Perms</span>
              <PermissionTooltip :permissions="role.permissions" />
            </div>

            <div class="h-10 w-px bg-slate-200 dark:bg-white/5 hidden sm:block"></div>

            <!-- Buttons -->
            <div class="flex items-center gap-2.5">
              <button
                v-if="canUpdateRoles"
                type="button"
                class="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-gray-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10 disabled:opacity-40 disabled:pointer-events-none"
                :disabled="role.isSystem || role.id === 'super_admin'"
                @click="openEdit(role)"
              >
                Edit
              </button>
              
              <button
                type="button"
                class="flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-105 hover:bg-violet-500 active:scale-95"
                @click="goToDetails(role.id)"
              >
                Configure
              </button>
              
              <button
                v-if="canDeleteRoles"
                type="button"
                class="flex h-11 w-11 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 active:scale-95 disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                :disabled="role.isSystem || role.id === 'super_admin' || isDeletingRole"
                title="Delete Role"
                @click="confirmDelete(role)"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
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

const canViewRoles = computed(() => authStore.can('view_roles'))
const canCreateRoles = computed(() => authStore.can('create_roles'))
const canUpdateRoles = computed(() => authStore.can('update_roles'))
const canDeleteRoles = computed(() => authStore.can('delete_roles'))

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
  if (!authStore.can('delete_roles')) return

  const ok = window.confirm(`Delete role \"${role.name}\"? This cannot be undone.`)
  if (!ok) return
  await deleteRole.mutateAsync({ id: role.id })
}
</script>


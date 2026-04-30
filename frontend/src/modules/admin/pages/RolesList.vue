<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-xl font-black tracking-tight text-gray-900">Roles</h1>
        <p class="mt-1 text-sm font-medium text-gray-500">
          Create and manage roles. Edit permissions in role details.
        </p>
      </div>

      <BaseButton
        v-if="canManageRoles"
        class="w-auto"
        label="Create Role"
        variant="primary"
        @click="openCreate()"
      />
    </div>

    <ErrorState
      v-if="rolesQuery.isError"
      title="Failed to load roles"
      :description="errorText"
      @retry="rolesQuery.refetch()"
    />

    <div v-else class="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="min-w-full text-left">
          <thead class="border-b border-gray-100 bg-gray-50/60">
            <tr>
              <th class="px-6 py-4 text-[0.7rem] font-black uppercase tracking-widest text-gray-400">Name</th>
              <th class="px-6 py-4 text-[0.7rem] font-black uppercase tracking-widest text-gray-400">ID</th>
              <th class="px-6 py-4 text-[0.7rem] font-black uppercase tracking-widest text-gray-400">Permissions</th>
              <th class="px-6 py-4 text-right text-[0.7rem] font-black uppercase tracking-widest text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="rolesQuery.isLoading">
              <td class="px-6 py-6 text-sm font-semibold text-gray-500" colspan="4">Loading roles…</td>
            </tr>
            <tr v-else-if="roles.length === 0">
              <td class="px-6 py-10" colspan="4">
                <EmptyState title="No roles yet" description="Create your first role to get started." />
              </td>
            </tr>
            <tr v-else v-for="role in roles" :key="role.id" class="hover:bg-gray-50/50 transition">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <p class="text-sm font-black text-gray-900">{{ role.name }}</p>
                  <span
                    v-if="role.isSystem"
                    class="rounded-full bg-gray-100 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-widest text-gray-500"
                  >
                    System
                  </span>
                  <span
                    v-if="role.id === 'super_admin'"
                    class="rounded-full bg-violet-50 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-widest text-violet-700"
                  >
                    Protected
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <code class="text-xs font-bold text-gray-500">{{ role.id }}</code>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm font-semibold text-gray-600">
                  {{ role.permissions?.length ?? 0 }}
                </p>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button
                    class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition"
                    @click="openEdit(role)"
                  >
                    Edit
                  </button>
                  <button
                    class="rounded-xl border border-trc-light/30 bg-trc-muted px-3 py-2 text-xs font-black uppercase tracking-widest text-trc-dark hover:bg-trc hover:text-white transition"
                    @click="goToDetails(role.id)"
                  >
                    Permissions
                  </button>
                  <button
                    v-if="canManageRoles"
                    class="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="role.id === 'super_admin' || deleteRole.isPending"
                    @click="confirmDelete(role)"
                  >
                    Delete
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
      :loading="createRole.isPending || updateRole.isPending"
      @close="closeModal"
      @submit="submitRole"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/auth.store'
import { getErrorMessage } from '@/utils/getErrorMessage'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import RoleForm from '@/modules/admin/components/RoleForm.vue'
import type { AdminRole } from '@/modules/admin/types/admin.types'
import { useCreateRoleMutation, useDeleteRoleMutation, useRolesQuery, useUpdateRoleMutation } from '@/modules/admin/queries/useRolesQuery'

const router = useRouter()
const authStore = useAuthStore()

const canManageRoles = computed(() => authStore.can('manage_roles'))

const rolesQuery = useRolesQuery()
const roles = computed(() => rolesQuery.data.value ?? [])

const createRole = useCreateRoleMutation()
const updateRole = useUpdateRoleMutation()
const deleteRole = useDeleteRoleMutation()

const errorText = computed(() => getErrorMessage(rolesQuery.error.value, 'Failed to fetch roles.'))

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


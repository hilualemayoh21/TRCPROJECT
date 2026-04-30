<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-xs font-black uppercase tracking-widest text-gray-400">Role</p>
        <h1 class="mt-1 text-xl font-black tracking-tight text-gray-900">
          {{ role?.name || 'Role details' }}
        </h1>
        <p class="mt-1 text-sm font-medium text-gray-500">
          Edit role name and permissions. Changes apply immediately.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          class="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition"
          @click="router.push({ name: 'admin-roles' })"
        >
          Back
        </button>
        <button
          v-if="canManageRoles"
          class="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="roleId === 'super_admin' || deleteRole.isPending"
          @click="onDelete()"
        >
          Delete
        </button>
      </div>
    </div>

    <ErrorState
      v-if="rolesQuery.isError"
      title="Failed to load roles"
      :description="errorText"
      @retry="rolesQuery.refetch()"
    />

    <div v-else-if="rolesQuery.isLoading" class="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
      <p class="text-sm font-semibold text-gray-500">Loading…</p>
    </div>

    <div v-else-if="!role" class="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
      <p class="text-sm font-semibold text-gray-600">Role not found.</p>
    </div>

    <div v-else class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-1 rounded-xl border border-gray-100 bg-white shadow-sm p-6">
        <h2 class="text-base font-black tracking-tight text-gray-900">Role info</h2>
        <p class="mt-1 text-sm font-medium text-gray-500">Update the role name.</p>

        <div class="mt-5">
          <BaseInput v-model="editName" label="Name" :disabled="!canManageRoles" :error="nameError" />
          <p class="mt-2 text-xs font-bold text-gray-400">ID: <code>{{ role.id }}</code></p>
        </div>

        <div class="mt-6 flex items-center justify-end gap-3">
          <BaseButton
            class="w-auto"
            variant="secondary"
            label="Reset"
            :disabled="!canManageRoles || updateRole.isPending"
            @click="resetName()"
          />
          <BaseButton
            class="w-auto"
            variant="primary"
            label="Save"
            :loading="updateRole.isPending"
            :disabled="!canManageRoles"
            @click="saveName()"
          />
        </div>
      </div>

      <div class="lg:col-span-2 space-y-3">
        <div class="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
          <h2 class="text-base font-black tracking-tight text-gray-900">Permissions</h2>
          <p class="mt-1 text-sm font-medium text-gray-500">Assign or remove permissions with the switches.</p>
        </div>

        <PermissionToggle
          v-for="perm in ALL_PERMISSIONS"
          :key="perm.key"
          :role-id="role.id"
          :permission="perm.key"
          :description="perm.description"
          :enabled="role.permissions.includes(perm.key)"
          @updated="onPermissionToggled"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/auth.store'
import { getErrorMessage } from '@/utils/getErrorMessage'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import PermissionToggle from '@/modules/admin/components/PermissionToggle.vue'
import type { Permission } from '@/modules/admin/types/admin.types'
import { useDeleteRoleMutation, useRolesQuery, useUpdateRoleMutation } from '@/modules/admin/queries/useRolesQuery'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const roleId = computed(() => String(route.params.id || ''))
const canManageRoles = computed(() => authStore.can('manage_roles'))

const rolesQuery = useRolesQuery()
const roles = computed(() => rolesQuery.data.value ?? [])
const role = computed(() => roles.value.find((r) => r.id === roleId.value) || null)

const updateRole = useUpdateRoleMutation()
const deleteRole = useDeleteRoleMutation()

const errorText = computed(() => getErrorMessage(rolesQuery.error.value, 'Failed to fetch roles.'))

const editName = ref('')
const nameError = ref<string | null>(null)

const ALL_PERMISSIONS: Array<{ key: Permission; description: string }> = [
  { key: 'manage_users', description: 'Create, edit, activate/deactivate, and assign roles to users.' },
  { key: 'manage_roles', description: 'Create, edit, and delete roles and manage their permissions.' },
  { key: 'approve_resources', description: 'Approve or reject submitted resources before publishing.' },
  { key: 'approve_researchers', description: 'Approve or reject researcher access requests.' },
  { key: 'view_reports', description: 'View abuse/issue reports submitted by users.' },
  { key: 'resolve_reports', description: 'Mark reports as resolved and take moderation actions.' }
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

async function onPermissionToggled(payload: { permission: string; enabled: boolean; permissions?: string[] }) {
  // Backend response returns the server-authoritative permissions; keep Vue Query cache in sync.
  if (!role.value) return
  if (!payload.permissions) return
  await updateRole.mutateAsync({ id: role.value.id, permissions: payload.permissions as Permission[] })
}
</script>


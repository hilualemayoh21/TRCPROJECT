import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { adminApi } from '@/modules/admin/services/admin.api'
import { useAuthStore } from '@/modules/auth/auth.store'
import { notifyAdminError, notifyAdminSuccess } from '@/modules/admin/utils/feedback'
import type { AdminRole, Permission } from '@/modules/admin/types/admin.types'

const ROLES_QUERY_KEY = ['roles']

export function useRolesQuery() {
  return useQuery({
    queryKey: ROLES_QUERY_KEY,
    queryFn: () => adminApi.listRoles(),
    staleTime: 30_000,
    retry: 1
  })
}

export function useCreateRoleMutation() {
  const queryClient = useQueryClient()
  const authStore = useAuthStore()

  return useMutation({
    mutationFn: async (payload: { name: string; description?: string; permissions?: Permission[] }) => {
      if (!authStore.can('manage_roles')) {
        throw new Error('You are not allowed to manage roles.')
      }
      const name = String(payload.name || '').trim().slice(0, 64)
      if (!name) throw new Error('Role name is required.')
      return adminApi.createRole({ name, description: payload.description, permissions: payload.permissions ?? [] })
    },
    onSuccess: async (data) => {
      notifyAdminSuccess('Role created')
      await queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY })
      adminApi.createAuditLog({ action: 'Role created', context: `${data.id}: ${data.name}` }).catch(() => {})
    },
    onError: (e) => notifyAdminError(e, 'Failed to create role.')
  })
}

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient()
  const authStore = useAuthStore()

  return useMutation({
    mutationFn: async (payload: { id: string; name?: string; description?: string; permissions?: Permission[] }) => {
      if (!authStore.can('manage_roles')) {
        throw new Error('You are not allowed to manage roles.')
      }
      const id = String(payload.id || '').trim()
      if (!id) throw new Error('Missing role id.')

      const patch: Partial<Pick<AdminRole, 'name' | 'description' | 'permissions'>> = {}
      if (typeof payload.name === 'string') patch.name = payload.name.trim().slice(0, 64)
      if (payload.description !== undefined) patch.description = payload.description
      if (Array.isArray(payload.permissions)) patch.permissions = payload.permissions

      if (!patch.name && patch.description === undefined && !patch.permissions) throw new Error('Nothing to update.')
      return adminApi.updateRole(id, patch)
    },
    onSuccess: async (data) => {
      notifyAdminSuccess('Role updated')
      await queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY })
      adminApi.createAuditLog({ action: 'Role updated', context: data.id }).catch(() => {})
    },
    onError: (e) => notifyAdminError(e, 'Failed to update role.')
  })
}

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient()
  const authStore = useAuthStore()

  return useMutation({
    mutationFn: async (payload: { id: string }) => {
      if (!authStore.can('manage_roles')) {
        throw new Error('You are not allowed to manage roles.')
      }
      const id = String(payload.id || '').trim()
      if (!id) throw new Error('Missing role id.')
      if (id === 'super_admin') throw new Error('You cannot delete the protected super_admin role.')
      return adminApi.deleteRole(id)
    },
    onSuccess: async () => {
      notifyAdminSuccess('Role deleted')
      await queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY })
    },
    onError: (e) => notifyAdminError(e, 'Failed to delete role.')
  })
}

export function useRoleById(roles: AdminRole[] | undefined, id: string | undefined) {
  return computed(() => {
    if (!id) return null
    return (roles ?? []).find((r) => r.id === id) || null
  })
}


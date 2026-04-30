import { computed, type ComputedRef } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { adminApi } from '@/modules/admin/services/admin.api'
import { post } from '@/services/http'
import type { AdminPaginated, AdminUser, RoleKey } from '@/modules/admin/types/admin.types'
import { notifyAdminError, notifyAdminSuccess } from '@/modules/admin/utils/feedback'
import { useAuthStore } from '@/modules/auth/auth.store'

export type UsersQueryInput = {
  page: number
  pageSize: number
  q?: string
}

export const adminQueryKeys = {
  users: (query: UsersQueryInput) => ['admin', 'users', query] as const
}

export function useUsersQuery(query: ComputedRef<UsersQueryInput>) {
  const key = computed(() => adminQueryKeys.users(query.value))

  return useQuery<AdminPaginated<AdminUser>>({
    queryKey: key,
    queryFn: () => adminApi.listUsers(query.value),
    placeholderData: (previousData) => previousData,
    retry: 2
  })
}

export function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient()
  const authStore = useAuthStore()
  return useMutation({
    mutationFn: async ({ userId, active }: { userId: string; active: boolean }) => {
      if (!authStore.can('manage_users')) {
        throw new Error('You are not allowed to manage users.')
      }
      return adminApi.setUserActive(userId, active)
    },
    onSuccess: async (_data, variables) => {
      notifyAdminSuccess(variables.active ? 'User activated' : 'User deactivated')
      await queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    }
    ,
    onError: (error) => {
      notifyAdminError(error, 'Failed to update user status.')
    }
  })
}

export function useAssignRoleMutation() {
  const queryClient = useQueryClient()
  const authStore = useAuthStore()
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: RoleKey }) => {
      if (!authStore.can('manage_users')) {
        throw new Error('You are not allowed to update roles.')
      }
      return post<{ ok: boolean; user: AdminUser & { permissions?: string[] } }>(
        `/users/${encodeURIComponent(userId)}/roles`,
        { role }
      )
    },
    onSuccess: async (_data, variables) => {
      notifyAdminSuccess('User role updated')
      await queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      adminApi.createAuditLog({ action: 'User role changed', context: `${variables.userId} -> ${variables.role}` }).catch(() => {})
    }
    ,
    onError: (error) => {
      notifyAdminError(error, 'Failed to assign role.')
    }
  })
}


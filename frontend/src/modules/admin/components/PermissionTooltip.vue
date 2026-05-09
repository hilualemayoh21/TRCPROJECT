<template>
  <div class="relative inline-block">
    <!-- Permission Badge -->
    <button
      type="button"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
      @click="toggleDrawer"
      class="inline-flex min-w-8 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-500/20 px-2.5 py-1 text-xs font-black text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 transition-all duration-150 cursor-pointer"
    >
      {{ permissions?.length ?? 0 }}
    </button>

    <!-- Tooltip -->
    <div
      v-if="tooltipVisible"
      class="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 dark:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-lg z-50 max-w-xs"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
    >
      <div class="space-y-1">
        <div class="font-semibold text-gray-300 dark:text-gray-400 mb-1">Permissions:</div>
        <div v-if="permissions && permissions.length > 0" class="space-y-0.5">
          <div v-for="permission in permissions.slice(0, 3)" :key="permission" class="flex items-center gap-1">
            <svg class="h-3 w-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span class="text-gray-200 dark:text-gray-300">{{ formatPermission(permission) }}</span>
          </div>
          <div v-if="permissions.length > 3" class="text-gray-400 dark:text-gray-500 text-xs pt-1">
            +{{ permissions.length - 3 }} more...
          </div>
        </div>
        <div v-else class="text-gray-400 dark:text-gray-500">
          No permissions
        </div>
      </div>
      
      <!-- Tooltip Arrow -->
      <div class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
        <div class="w-2 h-2 bg-gray-900 dark:bg-slate-800 transform rotate-45"></div>
      </div>
    </div>

    <!-- Permission Drawer -->
    <div
      v-if="drawerVisible"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click="closeDrawer"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
      
      <!-- Drawer Content -->
      <div class="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-h-[80vh] overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h3 class="text-lg font-black text-gray-900 dark:text-white">
            Role Permissions
          </h3>
          <button
            type="button"
            @click="closeDrawer"
            class="rounded-lg p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Permissions List -->
        <div class="p-6 overflow-y-auto max-h-[60vh]">
          <div v-if="permissions && permissions.length > 0" class="space-y-3">
            <div
              v-for="permission in permissions"
              :key="permission"
              class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600"
            >
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center">
                  <svg class="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <div class="font-medium text-gray-900 dark:text-white">
                  {{ formatPermission(permission) }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ getPermissionDescription(permission) }}
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <div class="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p class="text-gray-500 dark:text-gray-400">No permissions assigned</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Permission } from '@/modules/admin/types/admin.types'

interface Props {
  permissions?: Permission[] | null
}

const props = defineProps<Props>()

const tooltipVisible = ref(false)
const drawerVisible = ref(false)

let tooltipTimeout: NodeJS.Timeout | null = null

const permissions = computed(() => props.permissions || [])

function formatPermission(permission: Permission): string {
  return permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function getPermissionDescription(permission: Permission): string {
  const descriptions: Record<Permission, string> = {
    'manage_users': 'Create, edit, activate/deactivate users and assign roles',
    'manage_roles': 'Create, edit, delete roles and manage their permissions',
    'approve_resources': 'Approve or reject submitted resources before publishing',
    'approve_researchers': 'Approve or reject researcher access requests',
    'view_reports': 'View abuse/issue reports submitted by users',
    'resolve_reports': 'Mark reports as resolved and take moderation actions'
  }
  return descriptions[permission] || 'System permission'
}

function showTooltip() {
  if (tooltipTimeout) {
    clearTimeout(tooltipTimeout)
  }
  tooltipVisible.value = true
}

function hideTooltip() {
  tooltipTimeout = setTimeout(() => {
    tooltipVisible.value = false
  }, 100)
}

function toggleDrawer() {
  drawerVisible.value = !drawerVisible.value
  tooltipVisible.value = false
}

function closeDrawer() {
  drawerVisible.value = false
}
</script>

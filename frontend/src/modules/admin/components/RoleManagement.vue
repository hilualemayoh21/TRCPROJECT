<template>
  <DashboardLayout>
    <div class="space-y-6 bg-white dark:bg-slate-900 min-h-screen -m-6 md:-m-8 p-6 md:p-8">
    <!-- Header -->
    <header
      class="flex flex-col gap-4 rounded-3xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 px-6 py-6 shadow-xl backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:py-5 dark:shadow-2xl dark:shadow-black/20"
    >
      <div class="min-w-0">
        <h1 class="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-[2rem] bg-gradient-to-r from-violet-500 to-indigo-500 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">{{ state.name }}</h1>
        <p class="mt-2 max-w-none text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          Manage role details and permissions
        </p>
      </div>

      <button
        @click="state.deleteModalOpen = true"
        class="rounded-lg border border-transparent px-4 py-2 text-sm font-bold uppercase tracking-wide text-red-400 hover:bg-red-500/20 transition-all duration-150 transform hover:scale-105"
      >
        Delete Role
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Panel - Role Info -->
      <div class="overflow-hidden rounded-3xl border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/95 backdrop-blur-sm p-6 shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
        <div class="mb-6">
          <h2 class="text-xl font-black text-gray-900 dark:text-white mb-2">Role Info</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Manage role details and configuration</p>
        </div>

        <!-- Role Name Input -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Role Name</label>
          <input
            v-model="state.name"
            type="text"
            class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-150"
            placeholder="Role Name"
          />
        </div>

        <!-- Role ID Badge -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Role ID</label>
          <div class="inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-600/50 rounded-xl">
            <code class="rounded bg-gray-100 dark:bg-slate-700/50 px-2 py-1 text-xs font-bold text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-slate-600/50">{{ state.slug }}</code>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3">
          <button
            @click="handleReset"
            class="rounded-lg border border-gray-300 dark:border-slate-600/50 bg-gray-100 dark:bg-slate-800/50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-slate-500 hover:bg-gray-200 dark:hover:bg-slate-700/50 transition-all duration-150 transform hover:scale-105"
          >
            Reset
          </button>
          <button
            @click="handleSave"
            :disabled="!state.isDirty || state.isSaving"
            class="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-sm shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500 transition-all duration-150 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
          >
            <svg v-if="state.isSaving" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <svg v-else-if="state.saveSuccess" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ state.isSaving ? 'Saving...' : state.saveSuccess ? 'Saved' : 'Save' }}</span>
          </button>
        </div>
      </div>

      <!-- Right Panel - Permissions -->
      <div class="overflow-hidden rounded-3xl border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/95 backdrop-blur-sm p-6 shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
        <div class="mb-6">
          <h2 class="text-xl font-black text-gray-900 dark:text-white mb-2">Permissions</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Configure role permissions and access levels</p>
        </div>

        <div class="space-y-4">
          <div
            v-for="(permission, index) in state.permissions"
            :key="permission.id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700/30 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-500/10 hover:border-violet-200 dark:hover:border-violet-500/20 transition-all duration-150"
          >
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <h3 class="font-black text-gray-900 dark:text-white">{{ permission.name }}</h3>
                <div class="relative">
                  <button
                    @mouseenter="tooltipVisible[permission.id] = true"
                    @mouseleave="tooltipVisible[permission.id] = false"
                    class="text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-500/10 rounded-full p-1 transition-all duration-150"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <div
                    v-if="tooltipVisible[permission.id]"
                    class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 dark:bg-slate-800/90 border border-gray-700 dark:border-slate-700/50 rounded-xl shadow-xl backdrop-blur-sm z-50"
                  >
                    <p class="text-xs text-white">{{ permission.description }}</p>
                    <div class="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div class="border-4 border-transparent border-t-gray-900 dark:border-t-slate-800/90"></div>
                    </div>
                  </div>
                </div>
              </div>
              <span class="inline-flex items-center rounded-full px-3 py-1 text-[0.65rem] font-black uppercase tracking-widest mt-2"
                :class="permission.enabled 
                  ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 border border-violet-300 dark:border-violet-500/30' 
                  : 'bg-gray-100 dark:bg-slate-700/50 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-slate-600/50'"
              >
                {{ permission.enabled ? 'Enabled' : 'Not granted' }}
              </span>
            </div>
            
            <button
              @click="togglePermission(permission.id, !permission.enabled)"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              :class="permission.enabled 
                ? 'bg-violet-600' 
                : 'bg-gray-300 dark:bg-slate-700'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 ease-out"
                :class="permission.enabled ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Unsaved Changes Banner -->
    <div
      v-if="state.showUnsavedBanner && state.isDirty"
      class="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800/90 border-t border-gray-200 dark:border-slate-700/50 shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] z-40 backdrop-blur-sm"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-900 dark:text-white">You have unsaved changes</p>
          <div class="flex space-x-3">
            <button
              @click="handleReset"
              class="rounded-lg border border-gray-300 dark:border-slate-600/50 bg-gray-100 dark:bg-slate-800/50 px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-slate-500 hover:bg-gray-200 dark:hover:bg-slate-700/50 transition-all duration-150 transform hover:scale-105"
            >
              Discard
            </button>
            <button
              @click="handleSave"
              :disabled="state.isSaving"
              class="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1.5 text-sm font-bold uppercase tracking-wide text-white shadow-sm shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500 transition-all duration-150 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="state.deleteModalOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div class="max-w-md w-full p-6 bg-white dark:bg-slate-800/90 border border-gray-200 dark:border-slate-700/50 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-sm">
        <h3 class="text-lg font-black text-gray-900 dark:text-white mb-2">Delete Role</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          This action cannot be undone. This will permanently delete the "{{ state.name }}" role and remove all associated permissions.
        </p>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Type <code class="bg-gray-100 dark:bg-slate-900/50 px-2 py-1 rounded text-xs font-bold text-violet-500 dark:text-violet-400 border border-gray-300 dark:border-slate-600/50">content manager</code> to confirm
          </label>
          <input
            v-model="state.deleteConfirmation"
            type="text"
            class="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-150"
            placeholder="content manager"
          />
        </div>

        <div class="flex space-x-3">
          <button
            @click="state.deleteModalOpen = false"
            class="flex-1 rounded-lg border border-gray-300 dark:border-slate-600/50 bg-gray-100 dark:bg-slate-800/50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-slate-500 hover:bg-gray-200 dark:hover:bg-slate-700/50 transition-all duration-150 transform hover:scale-105"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            :disabled="state.deleteConfirmation !== 'content manager'"
            class="flex-1 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-sm shadow-red-500/25 hover:from-red-500 hover:to-red-600 transition-all duration-150 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Delete Role
          </button>
        </div>
      </div>
    </div>
  </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

interface Permission {
  id: string
  name: string
  description: string
  enabled: boolean
}

interface RoleState {
  name: string
  slug: string
  permissions: Permission[]
  isDirty: boolean
  isSaving: boolean
  saveSuccess: boolean
  deleteModalOpen: boolean
  deleteConfirmation: string
  showUnsavedBanner: boolean
}

const initialPermissions: Permission[] = [
  { id: 'manage_users', name: 'Manage Users', description: 'Create, edit, and delete user accounts', enabled: false },
  { id: 'manage_roles', name: 'Manage Roles', description: 'Create, modify, and remove role permissions', enabled: false },
  { id: 'approve_resources', name: 'Approve Resources', description: 'Review and approve resource submissions', enabled: true },
  { id: 'approve_researchers', name: 'Approve Researchers', description: 'Verify and approve researcher applications', enabled: false },
  { id: 'view_analytics', name: 'View Analytics', description: 'Access dashboard analytics and reports', enabled: false },
  { id: 'manage_settings', name: 'Manage Settings', description: 'Configure system-wide settings and preferences', enabled: false },
]

const state = ref<RoleState>({
  name: 'content manager',
  slug: 'content_manager',
  permissions: initialPermissions,
  isDirty: false,
  isSaving: false,
  saveSuccess: false,
  deleteModalOpen: false,
  deleteConfirmation: '',
  showUnsavedBanner: false
})

const tooltipVisible = ref<Record<string, boolean>>({})

const generateSlug = (name: string): string => {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim() || 'content_manager'
}

watch(() => state.value.name, (newName) => {
  state.value.slug = generateSlug(newName)
  state.value.isDirty = true
  state.value.showUnsavedBanner = true
})

const handleSave = async () => {
  state.value.isSaving = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  state.value.isSaving = false
  state.value.saveSuccess = true
  state.value.isDirty = false
  state.value.showUnsavedBanner = false
  
  // Reset success state after 2 seconds
  setTimeout(() => {
    state.value.saveSuccess = false
  }, 2000)
}

const handleReset = () => {
  state.value.name = 'content manager'
  state.value.slug = 'content_manager'
  state.value.isDirty = false
  state.value.showUnsavedBanner = false
}

const handleDelete = async () => {
  if (state.value.deleteConfirmation === 'content manager') {
    // Simulate delete API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Role deleted')
    state.value.deleteModalOpen = false
  }
}

const togglePermission = (permissionId: string, enabled: boolean) => {
  const permission = state.value.permissions.find(p => p.id === permissionId)
  if (permission) {
    permission.enabled = enabled
    state.value.isDirty = true
    state.value.showUnsavedBanner = true
  }
}
</script>

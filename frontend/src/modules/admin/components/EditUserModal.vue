<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50" @click="close"></div>
    
    <!-- Modal -->
    <div class="relative w-full max-w-md mx-4 bg-white dark:bg-[#1a1d26] rounded-2xl shadow-xl border border-slate-200 dark:border-white/5">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
        <h2 class="text-lg font-black text-gray-900 dark:text-white">Edit User</h2>
        <button
          type="button"
          @click="close"
          class="h-8 w-8 flex items-center justify-center rounded-lg border transition
                 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50
                 dark:border-white/10 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-white/5"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-black text-gray-700 dark:text-gray-200 mb-2">
            Full Name
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full rounded-lg border px-4 py-2.5 text-sm font-medium outline-none transition
                   border-slate-200 bg-white text-gray-700 placeholder:text-slate-400
                   dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder:text-slate-600
                   focus:ring-2 focus:ring-trc/30"
            placeholder="Enter full name"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-black text-gray-700 dark:text-gray-200 mb-2">
            Email Address
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full rounded-lg border px-4 py-2.5 text-sm font-medium outline-none transition
                   border-slate-200 bg-white text-gray-700 placeholder:text-slate-400
                   dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:placeholder:text-slate-600
                   focus:ring-2 focus:ring-trc/30"
            placeholder="Enter email address"
          />
        </div>

        <!-- Role -->
        <div>
          <label class="block text-sm font-black text-gray-700 dark:text-gray-200 mb-2">
            Role
          </label>
          <select
            v-model="form.role"
            required
            class="w-full rounded-lg border px-4 py-2.5 text-sm font-medium outline-none transition
                   border-slate-200 bg-white text-gray-700
                   dark:border-white/10 dark:bg-white/5 dark:text-gray-200
                   focus:ring-2 focus:ring-trc/30"
          >
            <option value="">Select a role</option>
            <option v-for="role in roleOptions" :key="role" :value="role">
              {{ role }}
            </option>
          </select>
        </div>

        <!-- Error -->
        <div v-if="error" class="rounded-lg border px-4 py-3 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
          <p class="text-sm font-bold text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            @click="close"
            class="h-10 rounded-xl px-5 text-sm font-black transition
                   bg-slate-100 text-slate-600 hover:bg-slate-200
                   dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting || !hasChanges"
            class="h-10 rounded-xl px-5 text-sm font-black
                   bg-trc text-white hover:bg-trc-dark shadow-lg shadow-trc/25 transition
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting" class="flex items-center gap-2">
              <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Saving...
            </span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import type { RoleKey, AdminUser } from '@/modules/admin/types/admin.types'

interface Props {
  isOpen: boolean
  roleOptions: RoleKey[]
  user: AdminUser | null
}

interface Emits {
  (e: 'close'): void
  (e: 'submit', data: { id: string; name: string; email: string; role: RoleKey }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = reactive({
  name: '',
  email: '',
  role: '' as RoleKey
})

const error = ref<string | null>(null)
const isSubmitting = ref(false)

const hasChanges = computed(() => {
  if (!props.user) return false
  return (
    form.name.trim() !== (props.user.name || '').trim() ||
    form.email.trim() !== (props.user.email || '').trim() ||
    form.role !== ((props.user.role as RoleKey) || '')
  )
})

watch(() => props.isOpen, (open) => {
  if (open && props.user) {
    form.name = props.user.name || ''
    form.email = props.user.email || ''
    form.role = (props.user.role as RoleKey) || ''
    error.value = null
  }
})

function close() {
  error.value = null
  emit('close')
}

async function handleSubmit() {
  if (!hasChanges.value) {
    close()
    return
  }

  if (!form.name || !form.email || !form.role) {
    error.value = 'Please fill in all required fields'
    return
  }

  if (!props.user) return

  error.value = null
  isSubmitting.value = true
  
  try {
    await emit('submit', { id: props.user.id, ...form })
    close()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to update user'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="close()" />
    
    <div class="relative w-full max-w-lg rounded-xl bg-white shadow-2xl animate-fade-up overflow-hidden border border-slate-100">
      <!-- Decorative Header Background -->
      <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-trc-muted/50 to-transparent pointer-events-none"></div>

      <div class="relative p-8">
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-1">
            <h2 class="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              <div class="p-1.5 rounded-lg bg-trc text-white">
                <svg v-if="isEdit" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              {{ isEdit ? 'Edit Role' : 'Create Role' }}
            </h2>
            <p class="text-sm font-medium text-slate-500">
              {{ isEdit ? 'Update the role details below.' : 'Define a new role for the system.' }}
            </p>
          </div>
          <button
            type="button"
            class="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-trc-light/50"
            @click="close()"
            aria-label="Close"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submit" class="mt-8 space-y-6">
          <div class="space-y-4">
            <BaseInput
              v-model="form.name"
              label="Role Name"
              placeholder="e.g. Content Moderator"
              :error="errors.name"
              autocomplete="off"
            />

            <div class="space-y-1.5">
              <label class="block text-xs font-black uppercase tracking-widest text-slate-500">
                Description <span class="text-slate-400 font-semibold normal-case tracking-normal">(Optional)</span>
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-trc-light focus:ring-4 focus:ring-trc-light/10 resize-none"
                placeholder="What capabilities does this role grant?"
              ></textarea>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-end gap-3 pt-2">
            <BaseButton
              type="button"
              class="w-auto"
              variant="secondary"
              label="Cancel"
              @click="close()"
            />
            <BaseButton
              type="submit"
              class="w-auto shadow-trc-btn hover:shadow-trc-btn-hover"
              variant="primary"
              :label="isEdit ? 'Save Changes' : 'Create Role'"
              :loading="loading"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import type { AdminRole } from '@/modules/admin/types/admin.types'

const props = defineProps<{
  initialData?: Partial<AdminRole> | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: { name: string; description?: string }): void
}>()

const isEdit = computed(() => !!props.initialData?.id)

const form = reactive({
  name: props.initialData?.name || '',
  description: props.initialData?.description || ''
})

const errors = reactive({
  name: ''
})

function validate() {
  let valid = true
  errors.name = ''

  const name = form.name.trim()
  if (!name) {
    errors.name = 'Role name is required.'
    valid = false
  }
  
  return valid
}

function submit() {
  if (!validate()) return
  
  emit('submit', {
    name: form.name.trim(),
    description: form.description.trim() || undefined
  })
}

function close() {
  emit('close')
}
</script>

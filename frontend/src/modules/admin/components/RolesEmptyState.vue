<template>
  <div class="overflow-hidden rounded-3xl border border-gray-200/50 bg-white/95 backdrop-blur-sm shadow-[0_20px_60px_rgba(17,24,39,0.08)] dark:border-white/8 dark:bg-[#1a1d26]/95 dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
    <div class="flex flex-col items-center justify-center py-16 px-6">
      <!-- Icon -->
      <div class="w-16 h-16 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-500/20 dark:to-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
        <svg class="w-8 h-8 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>

      <!-- Content -->
      <div class="text-center max-w-sm">
        <h3 class="text-lg font-black text-gray-900 dark:text-white mb-2">
          No roles found
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Get started by creating your first role. Roles help you manage permissions and access control for your users.
        </p>

        <!-- Action Button -->
        <BaseButton
          v-if="canManageRoles"
          :full-width="false"
          size="sm"
          label="Create Role"
          variant="primary"
          class="shadow-lg shadow-violet-500/25 ring-2 ring-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300"
          @click="$emit('create')"
        >
          <template #icon>
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25">
              <path stroke-linecap="round" d="M12 5v14M5 12h14" />
            </svg>
          </template>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'

interface Props {
  canManageRoles?: boolean
}

interface Emits {
  (e: 'create'): void
}

withDefaults(defineProps<Props>(), {
  canManageRoles: false
})

defineEmits<Emits>()
</script>

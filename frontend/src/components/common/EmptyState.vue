<template>
  <div class="flex flex-col items-center justify-center text-center">
    <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 7h18M3 12h18M3 17h18" />
      </svg>
    </div>
    <h3 class="mt-4 text-sm font-black tracking-tight text-gray-900">{{ title }}</h3>
    <p v-if="description" class="mt-1 max-w-md text-sm font-medium text-gray-500">{{ description }}</p>
    <div v-if="$slots.action" class="mt-5">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: 'Nothing here yet',
    description: ''
  }
)
</script>


<template>
  <div class="rounded-2xl border border-red-100 bg-red-50 p-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0">
        <h3 class="text-sm font-black tracking-tight text-red-800">{{ title }}</h3>
        <p v-if="description" class="mt-1 text-sm font-semibold text-red-700">
          {{ description }}
        </p>
      </div>
      <button
        v-if="showRetry"
        class="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-widest text-red-700 hover:bg-red-100 transition"
        type="button"
        @click="$emit('retry')"
      >
        Retry
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
    showRetry?: boolean
  }>(),
  {
    title: 'Something went wrong',
    description: '',
    showRetry: true
  }
)

defineEmits<{
  (e: 'retry'): void
}>()
</script>


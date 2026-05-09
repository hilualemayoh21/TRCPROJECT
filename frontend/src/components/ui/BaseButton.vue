<template>
  <button
    v-bind="$attrs"
    :type="type"
    :disabled="disabled || loading"
    class="relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-4 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
    :class="[fullWidth ? 'w-full' : 'w-auto shrink-0', variantClasses]"
    @click="$emit('click', $event)"
  >
    <!-- Loading spinner -->
    <span
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
    </span>

    <!-- Content (hidden while loading) -->
    <span
      class="flex items-center justify-center gap-2 transition-opacity duration-150"
      :class="loading ? 'opacity-0' : 'opacity-100'"
    >
      <slot name="icon" />
      <span><slot>{{ label }}</slot></span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'social'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  /** When false, button sizes to content (toolbar / header actions). Default true for form-style full-width buttons. */
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  fullWidth: true,
})

defineEmits<{ click: [e: MouseEvent] }>()

const variantClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'px-3.5 py-2 text-[0.7rem] font-black uppercase tracking-widest',
    md: 'px-5 py-3.5 text-sm font-black uppercase tracking-widest',
    lg: 'px-8 py-4 text-base font-black uppercase tracking-widest',
  }
  const variants: Record<string, string> = {
    primary:
      'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:scale-[1.02] hover:shadow-violet-500/30 focus-visible:ring-violet-500/40 dark:shadow-none',
    danger:
      'bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 focus-visible:ring-red-500/40 dark:shadow-none',
    secondary:
      'border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:ring-gray-300 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10 dark:focus-visible:ring-white/10',
    ghost:
      'bg-transparent text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-200 dark:text-gray-400 dark:hover:bg-white/5',
    social:
      'border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 focus-visible:ring-gray-300 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10',
  }
  return [sizes[props.size], variants[props.variant]].join(' ')
})
</script>

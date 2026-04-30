<template>
  <button
    v-bind="$attrs"
    :type="type"
    :disabled="disabled || loading"
    class="relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-4 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
    :class="variantClasses"
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
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
})

defineEmits<{ click: [e: MouseEvent] }>()

const variantClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'px-4 py-2.5 text-sm',
    md: 'px-5 py-3.5 text-sm',
    lg: 'px-6 py-4 text-base',
  }
  const variants: Record<string, string> = {
    primary:
      'bg-trc text-white shadow-trc-btn hover:shadow-trc-btn-hover focus-visible:ring-trc-light/40',
    danger:
      'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500/40',
    secondary:
      'border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-gray-300',
    ghost:
      'bg-transparent text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-200',
    social:
      'border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 focus-visible:ring-gray-300',
  }
  return [sizes[props.size], variants[props.variant]].join(' ')
})
</script>

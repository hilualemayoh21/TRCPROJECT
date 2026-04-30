<template>
  <div class="inline-flex items-center gap-3">
    <svg class="h-9 w-9" :class="iconClass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="22" x2="21" y2="22"></line>
      <line x1="6" y1="18" x2="6" y2="11"></line>
      <line x1="10" y1="18" x2="10" y2="11"></line>
      <line x1="14" y1="18" x2="14" y2="11"></line>
      <line x1="18" y1="18" x2="18" y2="11"></line>
      <polygon points="12 2 20 7 4 7"></polygon>
    </svg>
    <span class="text-3xl font-extrabold tracking-tight" :class="textClass">TRC</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  theme: {
    type: String,
    default: 'light'
  }
})

const iconClass = computed(() => {
  return props.theme === 'light' ? 'text-[#6C2BD9]' : 'text-white'
})

const textClass = computed(() => {
  return props.theme === 'light' ? 'text-[#6C2BD9]' : 'text-white'
})
</script>

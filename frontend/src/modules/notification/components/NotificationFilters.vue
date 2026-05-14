<template>
  <div class="flex items-center gap-2 bg-gray-100/50 p-1.5 rounded-2xl">
    <button
      v-for="filter in filters"
      :key="filter"
      class="px-5 py-2 rounded-xl text-[0.7rem] font-black uppercase tracking-[0.1em] transition-all"
      :class="[
        modelValue === filter 
          ? 'bg-white text-trc shadow-sm shadow-trc/5 translate-y-[-1px]' 
          : 'text-gray-400 hover:text-gray-600'
      ]"
      @click="$emit('update:modelValue', filter)"
    >
      {{ filter }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits(['update:modelValue'])

const filters = ['All', 'Unread', 'System', 'Activity', 'Security']
</script>

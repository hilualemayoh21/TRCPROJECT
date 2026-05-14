<template>
  <div class="rounded-3xl bg-white p-6 shadow-sm border border-gray-50 flex flex-col justify-between h-full transition-all hover:shadow-md">
    <div>
      <div class="flex items-center justify-between mb-2">
        <span class="text-[0.7rem] font-bold uppercase tracking-wider text-gray-400">{{ label }}</span>
        <span v-if="trend" :style="{ backgroundColor: badgeBgColor, color: badgeTextColor }" class="text-[0.65rem] font-black px-2 py-0.5 rounded-full">
          {{ trend }}
        </span>
      </div>
      <div class="flex items-baseline gap-1">
        <h3 class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ value }}</h3>
        <span v-if="suffix" class="text-xs font-bold text-gray-400">{{ suffix }}</span>
      </div>
    </div>
    
    <!-- Avatars Row (Image 1 Bookmarks style) -->
    <div v-if="avatars" class="mt-4 flex -space-x-2 overflow-hidden">
      <div v-for="i in avatars" :key="i" class="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center">
        <svg class="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
      </div>
    </div>

    <div v-if="updatedAt" class="mt-4 flex items-center gap-1.5 text-[0.65rem] font-medium text-gray-400">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      Updated {{ updatedAt }}
    </div>

    <div v-if="chart" class="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
      <div class="h-full bg-trc" :style="{ width: chart + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: string
  suffix?: string
  trend?: string
  updatedAt?: string
  chart?: number
  avatars?: number
  badgeType?: 'success' | 'warning' | 'purple'
}>()

const badgeBgColor = computed(() => {
  if (props.badgeType === 'purple') return '#f5f3ff'
  if (props.badgeType === 'warning') return '#fffbeb'
  return '#f0fdf4'
})

const badgeTextColor = computed(() => {
  if (props.badgeType === 'purple') return '#7c3aed'
  if (props.badgeType === 'warning') return '#b45309'
  return '#15803d'
})
</script>

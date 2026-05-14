<template>
  <div class="rounded-3xl bg-white p-8 shadow-sm border border-gray-50 flex flex-col h-full">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-xl font-extrabold text-gray-900 tracking-tight">{{ title }}</h2>
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2">
           <span class="h-3 w-3 rounded-full bg-trc"></span>
           <span class="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider">Active</span>
        </div>
        <div class="flex items-center gap-2">
           <span class="h-3 w-3 rounded-full bg-[#E9D5FF]"></span>
           <span class="text-[0.7rem] font-bold text-gray-500 uppercase tracking-wider">Archived</span>
        </div>
      </div>
    </div>

    <div class="mt-auto flex items-end justify-between gap-4 h-[200px]">
      <div v-for="(bar, index) in data" :key="index" class="flex-1 flex flex-col gap-1 items-center group">
        <div class="w-full flex flex-col-reverse gap-0 rounded-xl overflow-hidden shadow-sm transition-all group-hover:shadow-md">
           <div class="w-full bg-trc transition-all duration-500" :style="{ height: bar.active + 'px' }"></div>
           <div class="w-full bg-[#E9D5FF] transition-all duration-500" :style="{ height: bar.archived + 'px' }"></div>
        </div>
        <span v-if="bar.label" class="mt-4 text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">{{ bar.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface BarData {
  active: number
  archived: number
  label?: string
}

defineProps<{
  title: string
  data: BarData[]
}>()
</script>

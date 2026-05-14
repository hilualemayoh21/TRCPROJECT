<template>
  <div class="rounded-3xl bg-white p-8 shadow-sm border border-gray-50 h-full overflow-hidden flex flex-col">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-xl font-extrabold text-gray-900 tracking-tight">{{ title }}</h2>
      <button class="text-[0.7rem] font-bold uppercase tracking-widest text-trc hover:opacity-80 transition">View All</button>
    </div>

    <div class="flex flex-col gap-8 overflow-y-auto pr-2 custom-scrollbar">
      <div v-for="(item, index) in items" :key="index" class="flex gap-4 group cursor-pointer">
        <div :class="[
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105',
          item.type === 'upload' ? 'bg-[#F3F1FF] text-trc' : 
          item.type === 'comment' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
        ]">
          <component :is="getIcon(item.type)" class="h-6 w-6" />
        </div>
        
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
             <h4 class="text-[0.95rem] font-bold text-gray-900 truncate pr-4">{{ item.title }}</h4>
             <span class="text-[0.65rem] font-bold text-gray-400 whitespace-nowrap">{{ item.time }}</span>
          </div>
          <p class="text-[0.85rem] font-medium text-gray-500 leading-relaxed italic truncate">
             {{ item.description }}
          </p>
          
          <div v-if="item.meta" class="mt-2 flex items-center justify-between">
            <span class="text-[0.7rem] font-bold text-gray-400 uppercase tracking-wider">{{ item.meta.label }}</span>
            <span v-if="item.meta.tag" class="text-[0.6rem] font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 uppercase">
              {{ item.meta.tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'

const FileIcon = () => h('svg', { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "2.5", 'stroke-linecap': "round", 'stroke-linejoin': "round" }, [
  h('path', { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
  h('polyline', { points: "14 2 14 8 20 8" }),
  h('line', { x1: "16", y1: "13", x2: "8", y2: "13" }),
  h('line', { x1: "16", y1: "17", x2: "8", y2: "17" }),
  h('polyline', { points: "10 9 9 9 8 9" })
])

const CommentIcon = () => h('svg', { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "2.5", 'stroke-linecap': "round", 'stroke-linejoin': "round" }, [
  h('path', { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" })
])

const CheckIcon = () => h('svg', { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 'stroke-width': "2.5", 'stroke-linecap': "round", 'stroke-linejoin': "round" }, [
  h('circle', { cx: "12", cy: "12", r: "10" }),
  h('polyline', { points: "16 12 12 8 8 12" }),
  h('line', { x1: "12", y1: "16", x2: "12", y2: "8" })
])

interface ActivityItem {
  title: string
  description: string
  time: string
  type: 'upload' | 'comment' | 'system'
  meta?: { label: string; tag?: string }
}

defineProps<{
  title: string
  items: ActivityItem[]
}>()

const getIcon = (type: string) => {
  if (type === 'upload') return FileIcon
  if (type === 'comment') return CommentIcon
  return CheckIcon
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f1f1f1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #e5e5e5;
}
</style>

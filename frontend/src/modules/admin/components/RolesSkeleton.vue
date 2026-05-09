<template>
  <div class="overflow-hidden rounded-3xl border border-gray-200/50 bg-white/95 backdrop-blur-sm shadow-[0_20px_60px_rgba(17,24,39,0.08)] dark:border-white/8 dark:bg-[#1a1d26]/95 dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
    <div class="overflow-x-auto">
      <table class="min-w-full text-left">
        <thead class="border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-violet-50/50 backdrop-blur-sm dark:border-white/8 dark:from-white/5 dark:to-violet-950/10">
          <tr>
            <th class="px-6 py-4 text-[0.7rem] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Name</th>
            <th class="px-6 py-4 text-[0.7rem] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">ID</th>
            <th class="px-6 py-4 text-[0.7rem] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Description</th>
            <th class="px-6 py-4 text-[0.7rem] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Permissions</th>
            <th class="px-6 py-4 text-right text-[0.7rem] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100/50 dark:divide-white/5">
          <!-- Skeleton Rows -->
          <tr v-for="i in rows" :key="i" class="animate-pulse">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <!-- Name skeleton -->
                <div class="h-4 w-32 rounded bg-gray-200 dark:bg-slate-700"></div>
                <!-- Badge skeletons -->
                <div class="flex gap-2">
                  <div class="h-5 w-12 rounded-full bg-gray-200 dark:bg-slate-700"></div>
                  <div class="h-5 w-16 rounded-full bg-gray-200 dark:bg-slate-700"></div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="h-4 w-24 rounded bg-gray-200 dark:bg-slate-700"></div>
            </td>
            <td class="px-6 py-4">
              <div class="h-4 w-40 rounded bg-gray-200 dark:bg-slate-700"></div>
            </td>
            <td class="px-6 py-4">
              <div class="h-6 w-8 rounded-full bg-gray-200 dark:bg-slate-700"></div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-end gap-2">
                <div class="h-7 w-12 rounded bg-gray-200 dark:bg-slate-700"></div>
                <div class="h-7 w-16 rounded bg-gray-200 dark:bg-slate-700"></div>
                <div class="h-7 w-12 rounded bg-gray-200 dark:bg-slate-700"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  rows?: number
}

withDefaults(defineProps<Props>(), {
  rows: 5
})
</script>

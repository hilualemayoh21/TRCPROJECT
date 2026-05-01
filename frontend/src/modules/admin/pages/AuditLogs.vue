<template>
  <DashboardLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Audit Logs</h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Track administrative actions and system events.</p>
        </div>
        <button
          class="h-10 rounded-xl px-5 text-sm font-black transition
                 bg-trc text-white hover:bg-trc-dark shadow-lg shadow-trc/25"
          :disabled="loading"
          @click="fetchLogs"
        >Refresh</button>
      </div>

      <div v-if="error"
        class="rounded-2xl border px-5 py-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
        <p class="text-sm font-bold text-red-600 dark:text-red-400">{{ error }}</p>
      </div>

      <section class="rounded-2xl border overflow-hidden shadow-sm transition-colors
                      border-slate-200 bg-white dark:border-white/5 dark:bg-[#1a1d26]">
        <div class="px-6 py-5 border-b border-slate-100 dark:border-white/5">
          <h2 class="text-base font-black text-gray-900 dark:text-white">System Events</h2>
        </div>

        <div v-if="loading" class="p-6 space-y-3">
          <div v-for="i in 8" :key="i"
            class="h-14 rounded-xl animate-pulse bg-slate-100 dark:bg-white/5"></div>
        </div>

        <div v-else class="divide-y divide-slate-50 dark:divide-white/5">
          <div
            v-for="log in logs"
            :key="log.id"
            class="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors"
          >
            <div class="h-9 w-9 rounded-xl bg-trc/10 dark:bg-trc/20 flex items-center justify-center shrink-0">
              <svg class="h-4 w-4 text-trc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ log.action }}</p>
              <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {{ log.actor || 'System' }}<span v-if="log.context"> · {{ log.context }}</span>
              </p>
            </div>
            <p class="shrink-0 text-xs font-bold text-slate-300 dark:text-slate-600 tabular-nums">
              {{ log.createdAt }}
            </p>
          </div>

          <div v-if="logs.length === 0" class="py-16 text-center">
            <p class="text-sm font-bold text-slate-400 dark:text-slate-600">No audit logs available.</p>
          </div>
        </div>
      </section>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { adminApi } from '@/modules/admin/services/admin.api'
import { getErrorMessage } from '@/utils/getErrorMessage'
import type { AdminAuditLog } from '@/modules/admin/types/admin.types'

const loading = ref(false)
const error = ref<string | null>(null)
const logs = ref<AdminAuditLog[]>([])

async function fetchLogs() {
  loading.value = true
  error.value = null
  try {
    const data = await adminApi.listAuditLogs({ page: 1, pageSize: 30 })
    logs.value = data.items
  } catch (e) {
    error.value = getErrorMessage(e, 'Failed to load audit logs.')
  } finally {
    loading.value = false
  }
}

onMounted(fetchLogs)
</script>

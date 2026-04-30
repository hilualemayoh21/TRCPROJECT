<template>
  <DashboardLayout>
    <div class="space-y-6">
      <header class="flex items-end justify-between gap-3">
        <div>
          <h1 class="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Audit Logs</h1>
          <p class="mt-1 text-sm font-medium text-gray-500">Track administrative actions and system events.</p>
        </div>
        <button class="h-10 rounded-xl bg-gray-900 px-4 text-sm font-black text-white" :disabled="loading" @click="fetchLogs">
          Refresh
        </button>
      </header>

      <div v-if="error" class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
        {{ error }}
      </div>

      <section class="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
        <div v-if="loading" class="text-sm font-bold text-gray-500">Loading audit logs...</div>
        <div v-else class="space-y-3">
          <div
            v-for="log in logs"
            :key="log.id"
            class="rounded-xl border border-gray-100 px-4 py-3 flex items-start justify-between gap-4"
          >
            <div>
              <p class="text-sm font-black text-gray-900">{{ log.action }}</p>
              <p class="mt-1 text-xs font-semibold text-gray-500">
                {{ log.actor || 'System' }}<span v-if="log.context"> • {{ log.context }}</span>
              </p>
            </div>
            <p class="text-xs font-bold text-gray-300 tabular-nums">{{ log.createdAt }}</p>
          </div>
          <div v-if="logs.length === 0" class="py-6 text-sm font-bold text-gray-500">
            No audit logs available.
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

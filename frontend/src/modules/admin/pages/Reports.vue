<template>
  <DashboardLayout>
    <div class="space-y-6">
      <header class="flex items-end justify-between gap-3">
        <div>
          <h1 class="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Reports</h1>
          <p class="mt-1 text-sm font-medium text-gray-500">Moderation and abuse reports management.</p>
        </div>
        <button class="h-10 rounded-xl bg-gray-900 px-4 text-sm font-black text-white" :disabled="loading" @click="fetchReports">
          Refresh
        </button>
      </header>

      <div v-if="error" class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
        {{ error }}
      </div>

      <section class="rounded-xl border border-gray-100 bg-white shadow-sm p-6">
        <div v-if="loading" class="text-sm font-bold text-gray-500">Loading reports...</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-[760px] w-full">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="px-6 py-3 text-left text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400">Reporter</th>
                <th class="px-6 py-3 text-left text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400">Reason</th>
                <th class="px-6 py-3 text-left text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                <th class="px-6 py-3 text-right text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in reports" :key="report.id" class="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td class="px-6 py-4 text-sm font-bold text-gray-800">{{ report.reporter }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ report.reason }}</td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex rounded-lg border px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-widest"
                    :class="report.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-orange-50 text-orange-700 border-orange-100'"
                  >
                    {{ report.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    v-if="report.status !== 'resolved' && canResolve"
                    class="h-9 rounded-xl bg-trc px-4 text-[0.7rem] font-black uppercase tracking-widest text-white disabled:opacity-60"
                    :disabled="resolvingId === report.id || !canResolve"
                    @click="resolve(report.id)"
                  >
                    {{ resolvingId === report.id ? 'Resolving…' : 'Resolve' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { adminApi } from '@/modules/admin/services/admin.api'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useAuthStore } from '@/modules/auth/auth.store'
import type { AdminReport } from '@/modules/admin/types/admin.types'
import { notifyAdminError, notifyAdminSuccess } from '@/modules/admin/utils/feedback'

const authStore = useAuthStore()
const canResolve = computed(() => authStore.can('resolve_reports'))

const loading = ref(false)
const error = ref<string | null>(null)
const resolvingId = ref<string | null>(null)
const reports = ref<AdminReport[]>([])

async function fetchReports() {
  loading.value = true
  error.value = null
  try {
    const data = await adminApi.listReports()
    reports.value = data.items
  } catch (e) {
    error.value = getErrorMessage(e, 'Failed to load reports.')
  } finally {
    loading.value = false
  }
}

async function resolve(id: string) {
  if (!canResolve.value) {
    notifyAdminError(new Error('You are not allowed to resolve reports.'), 'You are not allowed to resolve reports.')
    return
  }
  resolvingId.value = id
  try {
    await adminApi.resolveReport(id)
    const report = reports.value.find((entry) => entry.id === id)
    if (report) report.status = 'resolved'
    notifyAdminSuccess('Report resolved')
  } catch (e) {
    error.value = getErrorMessage(e, 'Failed to resolve report.')
    notifyAdminError(e, 'Failed to resolve report.')
  } finally {
    resolvingId.value = null
  }
}

onMounted(fetchReports)
</script>

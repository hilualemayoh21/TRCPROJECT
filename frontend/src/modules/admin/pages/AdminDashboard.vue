<template>
  <DashboardLayout>
    <div class="space-y-6">
      <header class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
          <h1 class="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Admin Dashboard</h1>
          <p class="mt-1 text-sm font-medium text-gray-500">
            System overview and recent activity.
          </p>
            </div>
        <button
          type="button"
          class="h-11 rounded-2xl bg-gray-900 px-5 text-sm font-black text-white hover:bg-gray-800 transition disabled:opacity-60"
          :disabled="loading"
          @click="fetchOverview"
        >
          {{ loading ? 'Refreshing…' : 'Refresh' }}
        </button>
      </header>

      <div v-if="error" class="rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
        <p class="text-sm font-bold text-red-700">{{ error }}</p>
          </div>

      <!-- Cards -->
      <section class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div class="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <p class="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Total users</p>
          <div class="mt-3">
            <div v-if="loading" class="h-10 w-28 rounded-xl bg-gray-100 animate-pulse"></div>
            <p v-else class="text-4xl font-black tracking-tight text-gray-900 tabular-nums">
              {{ overview.totalUsers }}
            </p>
          </div>
             </div>

        <div class="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <p class="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Total resources</p>
          <div class="mt-3">
            <div v-if="loading" class="h-10 w-28 rounded-xl bg-gray-100 animate-pulse"></div>
            <p v-else class="text-4xl font-black tracking-tight text-gray-900 tabular-nums">
              {{ overview.totalResources }}
            </p>
          </div>
        </div>

        <div class="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <p class="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Pending approvals</p>
          <div class="mt-3">
            <div v-if="loading" class="h-10 w-28 rounded-xl bg-gray-100 animate-pulse"></div>
            <p v-else class="text-4xl font-black tracking-tight text-gray-900 tabular-nums">
              {{ overview.pendingApprovals }}
            </p>
          </div>
                  </div>
      </section>

      <!-- Recent activity -->
      <section class="rounded-[2rem] border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
        <div class="flex items-center justify-between">
          <h2 class="text-lg md:text-xl font-black tracking-tight text-gray-900">Recent activity</h2>
          <span class="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
            Latest
                </span>
        </div>

        <div v-if="loading" class="mt-6 space-y-3">
          <div v-for="i in 6" :key="i" class="h-16 rounded-2xl bg-gray-100 animate-pulse"></div>
           </div>

        <div v-else class="mt-6 divide-y divide-gray-50">
          <div
            v-for="item in overview.recentActivity"
            :key="item.id"
            class="py-4 flex items-start justify-between gap-4"
          >
            <div class="min-w-0">
              <p class="text-sm font-black text-gray-900 truncate">
                {{ item.action }}
              </p>
              <p class="mt-1 text-xs font-semibold text-gray-500 truncate">
                <span v-if="item.actor">{{ item.actor }}</span>
                <span v-if="item.actor && item.context"> • </span>
                <span v-if="item.context">{{ item.context }}</span>
              </p>
            </div>
            <p class="shrink-0 text-xs font-bold text-gray-300 tabular-nums">
              {{ item.createdAt }}
            </p>
              </div>
              
          <div v-if="overview.recentActivity.length === 0" class="py-10 text-center">
            <p class="text-sm font-bold text-gray-500">No activity yet.</p>
           </div>
        </div>
      </section>
      </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { onMounted, reactive, ref } from 'vue'
import { adminApi } from '@/modules/admin/services/admin.api'
import { getErrorMessage } from '@/utils/getErrorMessage'

type ActivityItem = {
  id: string
  action: string
  actor?: string
  context?: string
  createdAt: string
}

const loading = ref(false)
const error = ref<string | null>(null)

const overview = reactive<{
  totalUsers: number
  totalResources: number
  pendingApprovals: number
  recentActivity: ActivityItem[]
}>({
  totalUsers: 0,
  totalResources: 0,
  pendingApprovals: 0,
  recentActivity: []
})

function safeNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function safeString(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function normalizeActivity(list: unknown): ActivityItem[] {
  if (!Array.isArray(list)) return []
  return list
    .map((x: any, idx) => ({
      id: safeString(x?.id) || `activity-${idx}`,
      action: safeString(x?.action) || 'Activity',
      actor: safeString(x?.actor) || undefined,
      context: safeString(x?.context) || undefined,
      createdAt: safeString(x?.createdAt) || ''
    }))
    .slice(0, 20)
}

async function fetchOverview() {
  loading.value = true
  error.value = null

  try {
    const data = (await adminApi.getAnalyticsOverview()) || {}

    overview.totalUsers = safeNumber((data as any).totalUsers)
    overview.totalResources = safeNumber((data as any).totalResources)
    overview.pendingApprovals = safeNumber((data as any).pendingApprovals)
    overview.recentActivity = normalizeActivity((data as any).recentActivity)
  } catch (e: any) {
    error.value = getErrorMessage(e, 'Failed to load dashboard overview.')
  } finally {
    loading.value = false
  }
}

onMounted(fetchOverview)
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.55;
  }
  100% {
    opacity: 1;
  }
}
</style>

<template>
  <DashboardLayout>
    <div class="space-y-8">

      <!-- Welcome Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 class="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            Welcome back, {{ authStore.user?.name?.split(' ')[0] || 'Admin' }}!
          </h1>
          <p class="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            Tigray Resources Center Portal
          </p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm font-bold text-slate-400 dark:text-slate-500">
            {{ currentDate }}
          </span>
          <button
            type="button"
            class="h-10 rounded-xl px-5 text-sm font-black transition disabled:opacity-60
                   bg-trc text-white hover:bg-trc-dark shadow-lg shadow-trc/25"
            :disabled="loading"
            @click="fetchOverview"
          >
            {{ loading ? 'Refreshing…' : 'Refresh' }}
          </button>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error"
        class="rounded-2xl border px-5 py-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50">
        <p class="text-sm font-bold text-red-600 dark:text-red-400">{{ error }}</p>
      </div>

      <!-- Stat Cards -->
      <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div
          v-for="card in statCards"
          :key="card.label"
          class="relative overflow-hidden rounded-2xl p-6 text-white shadow-xl"
          :style="{ background: card.gradient }"
        >
          <!-- Icon -->
          <div class="mb-4 flex items-center justify-between">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <component :is="card.icon" style="font-size:20px" />
            </div>
            <span v-if="card.change" class="rounded-lg bg-white/20 px-2.5 py-1 text-xs font-black backdrop-blur-sm">
              {{ card.change }}
            </span>
          </div>
          <!-- Label -->
          <p class="text-sm font-bold uppercase tracking-widest text-white/70 mb-2">{{ card.label }}</p>
          <!-- Number -->
          <div v-if="loading" class="h-10 w-24 rounded-xl bg-white/20 animate-pulse"></div>
          <p v-else class="text-4xl font-black tabular-nums">
            {{ card.value }}
          </p>
          <!-- Decorative blob -->
          <div class="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-white/10 blur-2xl"></div>
        </div>
      </section>

      <!-- Recent Activity -->
      <section class="rounded-2xl border transition-colors shadow-sm
                      border-slate-200 bg-white dark:border-white/5 dark:bg-[#1a1d26]">
        <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/5">
          <h2 class="text-base font-black text-gray-900 dark:text-white">Recent Activity</h2>
          <RouterLink to="/admin/audit-logs"
            class="text-xs font-black uppercase tracking-widest text-trc hover:underline">
            View all →
          </RouterLink>
        </div>

        <!-- Skeleton -->
        <div v-if="loading" class="p-6 space-y-4">
          <div v-for="i in 5" :key="i"
            class="h-14 rounded-xl animate-pulse bg-slate-100 dark:bg-white/5"></div>
        </div>

        <!-- Rows -->
        <div v-else-if="overview.recentActivity.length > 0" class="divide-y divide-slate-50 dark:divide-white/5">
          <div
            v-for="item in overview.recentActivity"
            :key="item.id"
            class="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors"
          >
            <div class="h-9 w-9 rounded-xl bg-trc/10 dark:bg-trc/20 flex items-center justify-center shrink-0">
              <AuditOutlined class="text-trc" style="font-size:16px" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold truncate text-gray-900 dark:text-white">{{ item.action }}</p>
              <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {{ item.actor || 'System' }}<span v-if="item.context"> · {{ item.context }}</span>
              </p>
            </div>
            <p class="shrink-0 text-xs font-bold text-slate-300 dark:text-slate-600 tabular-nums">
              {{ formatTime(item.createdAt) }}
            </p>
          </div>
        </div>

        <div v-else class="px-6 py-12 text-center">
          <p class="text-sm font-bold text-slate-400 dark:text-slate-600">No activity yet.</p>
        </div>
      </section>

    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { computed, h, onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '@/modules/auth/auth.store'
import { adminApi } from '@/modules/admin/services/admin.api'
import { getErrorMessage } from '@/utils/getErrorMessage'
import {
  TeamOutlined, AppstoreOutlined, FileProtectOutlined, AuditOutlined
} from '@ant-design/icons-vue'

const authStore = useAuthStore()
const loading = ref(false)
const error = ref<string | null>(null)

const overview = reactive({
  totalUsers: 0,
  totalResources: 0,
  pendingApprovals: 0,
  recentActivity: [] as any[]
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
})

const statCards = computed(() => [
  {
    label: 'Total Users',
    value: overview.totalUsers.toLocaleString(),
    change: '+12%',
    icon: TeamOutlined,
    gradient: 'linear-gradient(135deg, #6C2BD9 0%, #4a1a9e 100%)',
  },
  {
    label: 'Active Roles',
    value: '5',
    icon: FileProtectOutlined,
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
  },
  {
    label: 'Resource Types',
    value: overview.totalResources.toLocaleString(),
    icon: AppstoreOutlined,
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  },
  {
    label: 'Admin Logs',
    value: overview.recentActivity.length.toString(),
    icon: AuditOutlined,
    gradient: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
  },
])

function formatTime(ts: number | string): string {
  if (!ts) return ''
  const d = typeof ts === 'number' ? new Date(ts) : new Date(ts)
  if (isNaN(d.getTime())) return String(ts)
  return d.toLocaleString()
}

function normalizeActivity(list: unknown): any[] {
  if (!Array.isArray(list)) return []
  return list.map((x: any, idx) => ({
    id: x?.id || `a-${idx}`,
    action: x?.action || 'Activity',
    actor: x?.actor || undefined,
    context: x?.context || undefined,
    createdAt: x?.createdAt ?? '',
  })).slice(0, 10)
}

async function fetchOverview() {
  loading.value = true
  error.value = null
  try {
    const data = (await adminApi.getAnalyticsOverview()) || {}
    overview.totalUsers = (data as any).totalUsers ?? 0
    overview.totalResources = (data as any).totalResources ?? 0
    overview.pendingApprovals = (data as any).pendingApprovals ?? 0
    overview.recentActivity = normalizeActivity((data as any).recentActivity)
  } catch (e: any) {
    error.value = getErrorMessage(e, 'Failed to load dashboard overview.')
  } finally {
    loading.value = false
  }
}

onMounted(fetchOverview)
</script>

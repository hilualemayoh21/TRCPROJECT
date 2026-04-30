<template>
  <DashboardLayout>
    <div class="space-y-6">
      <header class="flex items-end justify-between gap-3">
        <div>
          <h1 class="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Researcher Requests</h1>
          <p class="mt-1 text-sm font-medium text-gray-500">Review and approve researcher access requests.</p>
        </div>
        <button class="h-10 rounded-xl bg-gray-900 px-4 text-sm font-black text-white" :disabled="loading" @click="fetchRequests">
          Refresh
        </button>
      </header>

      <div v-if="error" class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
        {{ error }}
      </div>

      <div v-if="loading" class="rounded-xl border border-gray-100 bg-white shadow-sm p-8 text-sm font-bold text-gray-500">
        Loading requests...
      </div>

      <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ApprovalCard
          v-for="item in items"
          :key="item.id"
          :item="item"
          type="researcher"
          @update="handleUpdated"
        />
        <div v-if="items.length === 0" class="rounded-xl border border-gray-100 bg-white shadow-sm p-8 text-sm font-bold text-gray-500">
          No pending requests.
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ApprovalCard from '@/modules/admin/components/ApprovalCard.vue'
import { adminApi } from '@/modules/admin/services/admin.api'
import { getErrorMessage } from '@/utils/getErrorMessage'
import type { ResearcherApprovalRequest } from '@/modules/admin/types/admin.types'

const loading = ref(false)
const error = ref<string | null>(null)
const items = ref<ResearcherApprovalRequest[]>([])

async function fetchRequests() {
  loading.value = true
  error.value = null
  try {
    const data = await adminApi.listResearcherRequests()
    items.value = data.items
  } catch (e) {
    error.value = getErrorMessage(e, 'Failed to load researcher requests.')
  } finally {
    loading.value = false
  }
}

async function handleUpdated() {
  await fetchRequests()
}

onMounted(fetchRequests)
</script>

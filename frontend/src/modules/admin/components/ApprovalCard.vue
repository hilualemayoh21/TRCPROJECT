<template>
  <article class="rounded-xl border border-gray-100 bg-white shadow-sm p-6 shadow-sm">
    <header class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <p class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400">
          {{ typeLabel }}
        </p>

        <h3 class="mt-2 text-base font-black tracking-tight text-gray-900 truncate">
          {{ title }}
        </h3>

        <p v-if="subtitle" class="mt-1 text-sm font-semibold text-gray-500 truncate">
          {{ subtitle }}
        </p>
      </div>

      <div
        v-if="statusPill"
        class="shrink-0 inline-flex items-center rounded-lg border px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-widest"
        :class="statusPill.class"
      >
        {{ statusPill.text }}
      </div>
    </header>

    <div v-if="error" class="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
      <p class="text-sm font-bold text-red-700">{{ error }}</p>
    </div>

    <footer v-if="canAct" class="mt-5 flex flex-wrap items-center justify-end gap-3">
      <button
        type="button"
        class="h-10 rounded-xl border border-gray-200 bg-white px-4 text-[0.7rem] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
        :disabled="isBusy"
        @click="reject()"
      >
        {{ loadingReject ? 'Rejecting…' : 'Reject' }}
      </button>

      <button
        type="button"
        class="h-10 rounded-xl bg-emerald-600 px-4 text-[0.7rem] font-black uppercase tracking-widest text-white hover:bg-emerald-700 transition disabled:opacity-60"
        :disabled="isBusy"
        @click="approve()"
      >
        {{ loadingApprove ? 'Approving…' : 'Approve' }}
      </button>
    </footer>
    <p v-else class="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
      No permission for this action.
    </p>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { post } from '@/services/http'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { notifyAdminError, notifyAdminSuccess } from '@/modules/admin/utils/feedback'
import { useAuthStore } from '@/modules/auth/auth.store'

type ApprovalType = 'researcher' | 'resource'

type ApprovalItem = {
  id: string
  name?: string
  email?: string
  institution?: string
  title?: string
  submittedBy?: string
  status?: string
  createdAt?: string
}

const props = defineProps<{
  item: ApprovalItem
  type: ApprovalType
}>()

const emit = defineEmits<{
  (e: 'update', payload: { type: ApprovalType; id: string; action: 'approve' | 'reject' }): void
}>()

const loadingApprove = ref(false)
const loadingReject = ref(false)
const error = ref<string | null>(null)
const authStore = useAuthStore()
const canAct = computed(() =>
  props.type === 'researcher'
    ? authStore.can('approve_researchers')
    : authStore.can('approve_resources')
)

const isBusy = computed(() => loadingApprove.value || loadingReject.value)

const typeLabel = computed(() => (props.type === 'researcher' ? 'Researcher approval' : 'Resource approval'))

const title = computed(() => {
  if (props.type === 'researcher') return props.item.name || props.item.email || 'Researcher request'
  return props.item.title || 'Resource submission'
})

const subtitle = computed(() => {
  if (props.type === 'researcher') {
    const parts = [props.item.email, props.item.institution].filter(Boolean)
    return parts.join(' • ')
  }
  const parts = [props.item.submittedBy, props.item.createdAt].filter(Boolean)
  return parts.join(' • ')
})

const statusPill = computed<null | { text: string; class: string }>(() => {
  const raw = (props.item.status || '').toLowerCase()
  if (!raw) return null
  if (raw === 'pending') return { text: 'Pending', class: 'bg-orange-50 text-orange-700 border-orange-100' }
  if (raw === 'approved') return { text: 'Approved', class: 'bg-emerald-50 text-emerald-700 border-emerald-100' }
  if (raw === 'rejected') return { text: 'Rejected', class: 'bg-red-50 text-red-700 border-red-100' }
  return { text: props.item.status || 'Status', class: 'bg-gray-50 text-gray-600 border-gray-100' }
})

async function approve() {
  if (isBusy.value) return
  error.value = null

  const requiredPermission = props.type === 'researcher' ? 'approve_researchers' : 'approve_resources'
  if (!authStore.can(requiredPermission)) {
    const msg = 'You are not allowed to perform this approval action.'
    error.value = msg
    notifyAdminError(new Error(msg), msg)
    return
  }

  loadingApprove.value = true
  try {
    const endpoint = props.type === 'researcher' ? 'researcher-requests' : 'resource-requests'
    await post(`/admin/${endpoint}/${encodeURIComponent(props.item.id)}/approve`)
    notifyAdminSuccess(props.type === 'researcher' ? 'Researcher approved' : 'Resource approved')
    emit('update', { type: props.type, id: props.item.id, action: 'approve' })
  } catch (e: any) {
    error.value = getErrorMessage(e, 'Failed to approve.')
    notifyAdminError(e, 'Failed to approve.')
  } finally {
    loadingApprove.value = false
  }
}

async function reject() {
  if (isBusy.value) return
  error.value = null

  const requiredPermission = props.type === 'researcher' ? 'approve_researchers' : 'approve_resources'
  if (!authStore.can(requiredPermission)) {
    const msg = 'You are not allowed to perform this rejection action.'
    error.value = msg
    notifyAdminError(new Error(msg), msg)
    return
  }

  loadingReject.value = true
  try {
    const endpoint = props.type === 'researcher' ? 'researcher-requests' : 'resource-requests'
    await post(`/admin/${endpoint}/${encodeURIComponent(props.item.id)}/reject`)
    notifyAdminSuccess(props.type === 'researcher' ? 'Researcher rejected' : 'Resource rejected')
    emit('update', { type: props.type, id: props.item.id, action: 'reject' })
  } catch (e: any) {
    error.value = getErrorMessage(e, 'Failed to reject.')
    notifyAdminError(e, 'Failed to reject.')
  } finally {
    loadingReject.value = false
  }
}
</script>


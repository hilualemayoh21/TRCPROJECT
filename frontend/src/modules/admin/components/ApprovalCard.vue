<template>
  <article class="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
    <!-- Card Header -->
    <header class="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-gray-50">
      <div class="min-w-0 flex-1">
        <p class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400">
          {{ typeLabel }}
        </p>
        <h3 class="mt-1.5 text-base font-black tracking-tight text-gray-900 truncate">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="mt-0.5 text-sm font-semibold text-gray-500 truncate">
          {{ subtitle }}
        </p>
        <p v-if="isResearcher && item.createdAt" class="mt-1 text-[0.72rem] text-gray-400">
          Applied {{ formatDate(item.createdAt) }}
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

    <!-- Researcher Profile Details (expanded) -->
    <div v-if="isResearcher && item.profile" class="px-6 py-4 space-y-4">

      <!-- Profile stats row -->
      <div class="grid grid-cols-2 gap-3">
        <div v-if="item.profile.academicTitle" class="rounded-xl bg-gray-50 px-3 py-2.5">
          <p class="text-[0.65rem] font-black uppercase tracking-wider text-gray-400 mb-0.5">Title</p>
          <p class="text-[0.82rem] font-bold text-gray-800 capitalize">{{ item.profile.academicTitle.replace(/_/g, ' ') }}</p>
        </div>
        <div v-if="item.profile.researchFocus" class="rounded-xl bg-gray-50 px-3 py-2.5">
          <p class="text-[0.65rem] font-black uppercase tracking-wider text-gray-400 mb-0.5">Research Field</p>
          <p class="text-[0.82rem] font-bold text-gray-800 capitalize">{{ item.profile.researchFocus.replace(/_/g, ' ') }}</p>
        </div>
        <div v-if="item.profile.yearsExperience != null" class="rounded-xl bg-gray-50 px-3 py-2.5">
          <p class="text-[0.65rem] font-black uppercase tracking-wider text-gray-400 mb-0.5">Experience</p>
          <p class="text-[0.82rem] font-bold text-gray-800">{{ item.profile.yearsExperience }} years</p>
        </div>
        <div v-if="item.profile.orcid" class="rounded-xl bg-gray-50 px-3 py-2.5">
          <p class="text-[0.65rem] font-black uppercase tracking-wider text-gray-400 mb-0.5">ORCID</p>
          <p class="text-[0.82rem] font-bold text-trc font-mono truncate">{{ item.profile.orcid }}</p>
        </div>
      </div>

      <!-- Bio -->
      <div v-if="item.profile.bio" class="rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3">
        <p class="text-[0.65rem] font-black uppercase tracking-wider text-indigo-400 mb-1">Research Bio</p>
        <p class="text-[0.82rem] leading-relaxed text-gray-700">{{ item.profile.bio }}</p>
      </div>

      <!-- Profile URL -->
      <div v-if="item.profile.profileUrl">
        <a
          :href="item.profile.profileUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-[0.78rem] font-bold text-trc hover:underline"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
          Academic Profile / LinkedIn
          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        </a>
      </div>

      <!-- Documents Section -->
      <div v-if="item.documents && item.documents.length > 0">
        <p class="text-[0.7rem] font-black uppercase tracking-wider text-gray-400 mb-2">Submitted Documents</p>
        <div class="space-y-2">
          <a
            v-for="doc in item.documents"
            :key="doc.id"
            :href="docUrl(doc.fileUrl)"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-3 py-2.5 hover:border-trc/30 hover:bg-trc/5 transition group"
          >
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" :class="docIconBg(doc.docType)">
              <svg class="h-4 w-4" :class="docIconColor(doc.docType)" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-[0.8rem] font-bold text-gray-800 truncate group-hover:text-trc transition">{{ doc.fileName }}</p>
              <p class="text-[0.68rem] text-gray-400">{{ docTypeLabel(doc.docType) }} · {{ formatFileSize(doc.fileSize) }}</p>
            </div>
            <svg class="h-4 w-4 shrink-0 text-gray-300 group-hover:text-trc transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        </div>
      </div>

      <!-- No documents warning -->
      <div v-else class="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
        <svg class="h-4 w-4 shrink-0 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/></svg>
        <p class="text-[0.78rem] font-semibold text-orange-700">No supporting documents uploaded by this researcher.</p>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="mx-6 mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
      <p class="text-sm font-bold text-red-700">{{ error }}</p>
    </div>

    <!-- Rejection reason input (shown when rejecting) -->
    <Transition name="slide-down">
      <div v-if="showRejectReason" class="mx-6 mb-4 space-y-2">
        <label class="text-[0.78rem] font-bold text-gray-700">
          Rejection Reason <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="rejectReason"
          rows="3"
          placeholder="Explain why this researcher application cannot be approved (this will be included in the email sent to the researcher)..."
          class="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-[0.82rem] text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-300 transition"
        ></textarea>
        <p v-if="rejectReasonError" class="text-[0.75rem] font-semibold text-red-500">{{ rejectReasonError }}</p>
        <div class="flex gap-2">
          <button
            type="button"
            class="h-9 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-[0.72rem] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition"
            @click="cancelReject"
          >
            Cancel
          </button>
          <button
            type="button"
            class="h-9 flex-1 rounded-xl bg-red-600 px-4 text-[0.72rem] font-black uppercase tracking-widest text-white hover:bg-red-700 transition disabled:opacity-60"
            :disabled="loadingReject"
            @click="confirmReject"
          >
            {{ loadingReject ? 'Rejecting…' : 'Confirm Rejection' }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Action buttons -->
    <footer v-if="canAct && !showRejectReason" class="flex flex-wrap items-center justify-end gap-3 px-6 pb-6 pt-2">
      <button
        type="button"
        class="h-10 rounded-xl border border-red-200 bg-white px-4 text-[0.7rem] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition disabled:opacity-60"
        :disabled="isBusy"
        @click="startReject"
      >
        Reject
      </button>
      <button
        type="button"
        class="h-10 rounded-xl bg-emerald-600 px-5 text-[0.7rem] font-black uppercase tracking-widest text-white hover:bg-emerald-700 transition disabled:opacity-60"
        :disabled="isBusy"
        @click="approve()"
      >
        {{ loadingApprove ? 'Approving…' : 'Approve' }}
      </button>
    </footer>

    <p v-else-if="!canAct && !showRejectReason" class="px-6 pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
      No permission for this action.
    </p>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { notifyAdminError, notifyAdminSuccess } from '@/modules/admin/utils/feedback'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { useAuthStore } from '@/modules/auth/auth.store'
import { adminApi } from '@/modules/admin/services/admin.api'

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
  profile?: {
    researchFocus?: string
    academicTitle?: string
    yearsExperience?: number | null
    bio?: string
    orcid?: string | null
    profileUrl?: string | null
    submittedAt?: string | null
  } | null
  documents?: Array<{
    id: string
    docType: string
    fileUrl: string
    fileName: string
    fileSize: number
    uploadedAt: string
  }>
}

const props = defineProps<{
  item: ApprovalItem
  type: ApprovalType
}>()

const emit = defineEmits<{
  (e: 'update', payload: { type: ApprovalType; id: string; action: 'approve' | 'reject' }): void
}>()

const API_BASE = import.meta.env.VITE_API_BASE || ''

const loadingApprove = ref(false)
const loadingReject = ref(false)
const error = ref<string | null>(null)
const showRejectReason = ref(false)
const rejectReason = ref('')
const rejectReasonError = ref('')

const authStore = useAuthStore()
const isResearcher = computed(() => props.type === 'researcher')

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
  if (raw === 'approved' || raw === 'active') return { text: 'Approved', class: 'bg-emerald-50 text-emerald-700 border-emerald-100' }
  if (raw === 'rejected' || raw === 'inactive') return { text: 'Rejected', class: 'bg-red-50 text-red-700 border-red-100' }
  return { text: props.item.status || 'Status', class: 'bg-gray-50 text-gray-600 border-gray-100' }
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function docUrl(fileUrl: string) {
  if (fileUrl.startsWith('http')) return fileUrl
  return API_BASE.replace('/api', '') + fileUrl
}

function docTypeLabel(docType: string) {
  const map: Record<string, string> = {
    id_document: 'Government / University ID',
    affiliation_letter: 'Affiliation Letter',
    cv: 'CV / Resume',
  }
  return map[docType] || docType.replace(/_/g, ' ')
}

function docIconBg(docType: string) {
  if (docType === 'id_document') return 'bg-blue-50'
  if (docType === 'affiliation_letter') return 'bg-purple-50'
  return 'bg-gray-50'
}

function docIconColor(docType: string) {
  if (docType === 'id_document') return 'text-blue-500'
  if (docType === 'affiliation_letter') return 'text-purple-500'
  return 'text-gray-500'
}

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
    if (props.type === 'researcher') {
      await adminApi.approveResearcher(props.item.id)
    } else {
      await adminApi.approveResource(props.item.id)
    }
    notifyAdminSuccess(props.type === 'researcher' ? 'Researcher approved — notification email sent' : 'Resource approved')
    emit('update', { type: props.type, id: props.item.id, action: 'approve' })
  } catch (e: any) {
    error.value = getErrorMessage(e, 'Failed to approve.')
    notifyAdminError(e, 'Failed to approve.')
  } finally {
    loadingApprove.value = false
  }
}

function startReject() {
  rejectReason.value = ''
  rejectReasonError.value = ''
  showRejectReason.value = true
}

function cancelReject() {
  showRejectReason.value = false
  rejectReason.value = ''
  rejectReasonError.value = ''
}

async function confirmReject() {
  rejectReasonError.value = ''
  if (!rejectReason.value.trim()) {
    rejectReasonError.value = 'Please provide a reason for rejection.'
    return
  }

  const requiredPermission = props.type === 'researcher' ? 'approve_researchers' : 'approve_resources'
  if (!authStore.can(requiredPermission)) {
    const msg = 'You are not allowed to perform this rejection action.'
    error.value = msg
    notifyAdminError(new Error(msg), msg)
    return
  }

  loadingReject.value = true
  try {
    if (props.type === 'researcher') {
      await adminApi.rejectResearcher(props.item.id, rejectReason.value.trim())
    } else {
      await adminApi.rejectResource(props.item.id, rejectReason.value.trim())
    }
    showRejectReason.value = false
    notifyAdminSuccess(props.type === 'researcher' ? 'Researcher rejected — notification email sent' : 'Resource rejected')
    emit('update', { type: props.type, id: props.item.id, action: 'reject' })
  } catch (e: any) {
    error.value = getErrorMessage(e, 'Failed to reject.')
    notifyAdminError(e, 'Failed to reject.')
  } finally {
    loadingReject.value = false
  }
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active { transition: all 0.3s ease; }
.slide-down-enter-from,
.slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>

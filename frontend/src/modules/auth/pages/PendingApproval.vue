<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 p-6 font-sans">
    <div class="w-full max-w-lg animate-fade-up">

      <!-- Main card -->
      <div class="rounded-3xl bg-white p-10 text-center shadow-xl shadow-trc/5 border border-slate-100">

        <!-- Animated clock icon -->
        <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-500 ring-8 ring-orange-50/50">
          <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <!-- Content -->
        <h1 class="mb-3 text-2xl font-black tracking-tight text-gray-900">Application Under Review</h1>
        <p class="mb-6 text-[0.95rem] font-medium leading-relaxed text-gray-500">
          Your researcher application and supporting documents have been successfully submitted. An administrator will review your credentials and notify you by email once a decision has been made.
        </p>

        <!-- Status steps -->
        <div class="mb-8 text-left space-y-3">
          <div class="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">✓</div>
            <div>
              <p class="text-[0.82rem] font-bold text-emerald-800">Account registered</p>
              <p class="text-[0.72rem] text-emerald-600">Email verified successfully.</p>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold">✓</div>
            <div>
              <p class="text-[0.82rem] font-bold text-emerald-800">Application submitted</p>
              <p class="text-[0.72rem] text-emerald-600">Profile and supporting documents uploaded.</p>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-xl bg-orange-50 border border-orange-100 px-4 py-3">
            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-400 text-white text-xs">
              <svg class="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            </div>
            <div>
              <p class="text-[0.82rem] font-bold text-orange-800">Awaiting admin review</p>
              <p class="text-[0.72rem] text-orange-600">You'll receive an email notification once reviewed.</p>
            </div>
          </div>
          <div class="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 opacity-50">
            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500 text-xs font-bold">4</div>
            <div>
              <p class="text-[0.82rem] font-bold text-gray-600">Access granted</p>
              <p class="text-[0.72rem] text-gray-400">Full researcher dashboard access unlocked.</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-3">
          <button
            id="check-status-btn"
            @click="checkStatus"
            :disabled="checking"
            class="inline-flex h-12 items-center justify-center rounded-xl bg-trc px-6 text-[0.9rem] font-bold text-white shadow-trc-btn transition-all hover:bg-trc-dark hover:shadow-trc-btn-hover active:scale-95 disabled:opacity-70"
          >
            <svg v-if="checking" class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            {{ checking ? 'Checking…' : 'Check Approval Status' }}
          </button>
          <button
            id="logout-btn"
            @click="logout"
            class="inline-flex h-12 items-center justify-center rounded-xl border-2 border-gray-100 bg-white px-6 text-[0.9rem] font-bold text-gray-600 transition-all hover:border-gray-200 hover:text-gray-900 active:scale-95"
          >
            Logout
          </button>
        </div>

        <!-- Status check result -->
        <Transition name="slide-down">
          <div v-if="error" class="mt-6 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-bold text-red-600">
            {{ error }}
          </div>
        </Transition>
      </div>

      <!-- Info note -->
      <p class="mt-6 text-center text-[0.78rem] text-gray-400 leading-relaxed px-4">
        Review typically takes 1–3 business days. If you haven't heard back after 5 days,
        contact our support team.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/auth.store'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const authStore = useAuthStore()
const { logout: authLogout } = useAuth()

const checking = ref(false)
const error = ref('')

async function checkStatus() {
  checking.value = true
  error.value = ''
  try {
    await authStore.fetchUser()
    if (authStore.user?.status === 'active') {
      router.push(authStore.getPostLoginRoute())
    } else if (authStore.user?.status === 'inactive') {
      error.value = 'Your application was not approved. Please check your email for the rejection reason, or contact support.'
    } else {
      error.value = 'Your application is still under review. Please check back later or wait for an email notification.'
    }
  } catch (err: any) {
    error.value = 'Failed to check status. Are you connected to the internet?'
  } finally {
    checking.value = false
  }
}

async function logout() {
  await authLogout()
  router.push('/login')
}
</script>

<style scoped>
.animate-fade-up {
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(24px); }
  100% { opacity: 1; transform: translateY(0); }
}

.slide-down-enter-active,
.slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from,
.slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
</style>

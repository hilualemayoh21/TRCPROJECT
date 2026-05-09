<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 p-6 font-sans">
    <div class="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-xl shadow-trc/5 border border-slate-100 animate-fade-up">
      <!-- Icon -->
      <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-500 ring-8 ring-orange-50/50">
        <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <!-- Content -->
      <h1 class="mb-3 text-2xl font-black tracking-tight text-gray-900">Pending Approval</h1>
      <p class="mb-8 text-[0.95rem] font-medium leading-relaxed text-gray-500">
        Your researcher account has been successfully created. However, for security purposes, an administrator must review your institution details before granting full access to the research repository.
      </p>

      <!-- Actions -->
      <div class="flex flex-col gap-3">
        <button
          @click="checkStatus"
          :disabled="checking"
          class="inline-flex h-12 items-center justify-center rounded-xl bg-trc px-6 text-[0.9rem] font-bold text-white shadow-trc-btn transition-all hover:bg-trc-dark hover:shadow-trc-btn-hover active:scale-95 disabled:opacity-70"
        >
          {{ checking ? 'Checking...' : 'Check Status Again' }}
        </button>
        <button
          @click="logout"
          class="inline-flex h-12 items-center justify-center rounded-xl border-2 border-gray-100 bg-white px-6 text-[0.9rem] font-bold text-gray-600 transition-all hover:border-gray-200 hover:text-gray-900 active:scale-95"
        >
          Logout
        </button>
      </div>

      <!-- Error -->
      <div v-if="error" class="mt-6 rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-bold text-red-600">
        {{ error }}
      </div>
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
    } else {
      error.value = 'Your account is still pending approval. Please try again later.'
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
</style>

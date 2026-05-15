<template>
  <div class="min-h-screen bg-gray-50 font-sans flex items-center justify-center px-4">
    <div class="w-full max-w-md animate-fade-up">
      <!-- Logo -->
      <div class="mb-8 flex justify-center">
        <RouterLink to="/" aria-label="TRC Home">
          <Logo theme="light" />
        </RouterLink>
      </div>

      <div class="rounded-3xl bg-white p-10 shadow-xl shadow-gray-200/60 border border-gray-100">
        <!-- Icon -->
        <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-trc/10 ring-8 ring-trc/5">
          <svg class="h-9 w-9 text-trc" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>

        <h1 class="mb-2 text-center text-2xl font-black tracking-tight text-gray-900">Forgot password?</h1>
        <p class="mb-8 text-center text-[0.9rem] font-medium leading-relaxed text-gray-400">
          No worries! Enter your email and we'll send you a 6-digit code to reset your password.
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-2">
            <label class="text-[0.8rem] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
            <BaseInput
              v-model="email"
              type="email"
              placeholder="name@example.com"
              required
              class="bg-gray-50 border-none shadow-none rounded-2xl p-1"
            />
          </div>

          <!-- Error -->
          <Transition name="slide-down">
            <div v-if="error" class="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {{ error }}
            </div>
          </Transition>

          <BaseButton type="submit" variant="primary" size="lg" :loading="loading" class="w-full py-4 rounded-2xl shadow-lg shadow-trc/20">
            Send Reset Code
          </BaseButton>
        </form>

        <div class="mt-8 text-center">
          <RouterLink to="/login" class="text-[0.9rem] font-bold text-trc hover:underline flex items-center justify-center gap-2">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to login
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import axios from 'axios'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Logo from '@/components/ui/Logo.vue'

const router = useRouter()
const API_BASE = import.meta.env.VITE_API_BASE

const email = ref('')
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  if (!email.value) return
  loading.value = true
  error.value = ''
  try {
    await axios.post(`${API_BASE}/auth/forgot-password`, { email: email.value })
    // Redirect to reset password page with email in query
    router.push({ path: '/reset-password', query: { email: email.value } })
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Something went wrong. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-fade-up {
  animation: fadeUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.slide-down-enter-active,
.slide-down-leave-active { transition: all 0.25s ease; }
.slide-down-enter-from,
.slide-down-leave-to { opacity: 0; transform: translateY(-6px); }
</style>

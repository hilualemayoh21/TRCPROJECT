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
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h1 class="mb-2 text-center text-2xl font-black tracking-tight text-gray-900">Reset Password</h1>
        <p class="mb-8 text-center text-[0.9rem] font-medium leading-relaxed text-gray-400">
          Enter the 6-digit code sent to <span class="font-bold text-gray-700">{{ email }}</span> and choose a new password.
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- OTP Input -->
          <div class="space-y-2">
            <label class="text-[0.8rem] font-bold uppercase tracking-widest text-gray-400">Verification Code</label>
            <BaseInput
              v-model="otp"
              placeholder="000000"
              maxlength="6"
              required
              class="bg-gray-50 border-none shadow-none rounded-2xl p-1 text-center text-xl font-bold tracking-[0.5em]"
            />
          </div>

          <!-- New Password -->
          <div class="space-y-2">
            <label class="text-[0.8rem] font-bold uppercase tracking-widest text-gray-400">New Password</label>
            <BaseInput
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              class="bg-gray-50 border-none shadow-none rounded-2xl p-1"
            />
          </div>

          <!-- Confirm Password -->
          <div class="space-y-2">
            <label class="text-[0.8rem] font-bold uppercase tracking-widest text-gray-400">Confirm New Password</label>
            <BaseInput
              v-model="confirmPassword"
              type="password"
              placeholder="••••••••"
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

          <!-- Success -->
          <Transition name="slide-down">
            <div v-if="success" class="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 font-medium">
              <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              Password reset successful! Redirecting...
            </div>
          </Transition>

          <BaseButton type="submit" variant="primary" size="lg" :loading="loading" class="w-full py-4 rounded-2xl shadow-lg shadow-trc/20">
            Reset Password
          </BaseButton>
        </form>

        <div class="mt-8 text-center">
          <RouterLink to="/login" class="text-[0.9rem] font-bold text-gray-400 hover:text-trc transition">
            Back to login
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import axios from 'axios'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Logo from '@/components/ui/Logo.vue'

const router = useRouter()
const route = useRoute()
const API_BASE = import.meta.env.VITE_API_BASE

const email = ref('')
const otp = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

onMounted(() => {
  email.value = (route.query.email as string) || ''
  if (!email.value) {
    router.push('/forgot-password')
  }
})

async function handleSubmit() {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }
  if (otp.value.length !== 6) {
    error.value = 'Please enter the 6-digit code.'
    return
  }

  loading.value = true
  error.value = ''
  try {
    await axios.post(`${API_BASE}/auth/reset-password`, {
      email: email.value,
      otp: otp.value,
      password: password.value
    })
    success.value = true
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Invalid or expired code. Please try again.'
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

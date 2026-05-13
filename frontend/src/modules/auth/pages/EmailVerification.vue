<template>
  <div class="min-h-screen bg-gray-50 font-sans flex items-center justify-center px-4">

    <!-- Card -->
    <div class="w-full max-w-md animate-fade-up">

      <!-- Top Brand Strip -->
      <div class="mb-8 flex justify-center">
        <RouterLink to="/" aria-label="TRC Home">
          <Logo theme="light" />
        </RouterLink>
      </div>

      <div class="rounded-3xl bg-white p-10 shadow-xl shadow-gray-200/60 border border-gray-100">

        <!-- Icon -->
        <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-trc/10 ring-8 ring-trc/5">
          <svg class="h-9 w-9 text-trc" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <!-- Heading -->
        <h1 class="mb-2 text-center text-2xl font-black tracking-tight text-gray-900">Check your email</h1>
        <p class="mb-8 text-center text-[0.9rem] font-medium leading-relaxed text-gray-400">
          We sent a 6-digit verification code to<br/>
          <span class="font-bold text-gray-700">{{ displayEmail }}</span>
        </p>

        <!-- OTP Input -->
        <div class="mb-6">
          <label class="mb-3 block text-center text-[0.8rem] font-bold uppercase tracking-widest text-gray-400">
            Enter verification code
          </label>
          <div class="flex items-center justify-center gap-2.5" @paste.prevent="handlePaste">
            <input
              v-for="(_, i) in digits"
              :key="i"
              :ref="el => inputRefs[i] = el as HTMLInputElement"
              v-model="digits[i]"
              :id="`otp-digit-${i}`"
              type="text"
              inputmode="numeric"
              maxlength="1"
              @keydown="(e) => handleKeydown(e, i)"
              @input="(e) => handleInput(e, i)"
              @focus="(e: FocusEvent) => (e.target as HTMLInputElement).select()"
              :class="[
                'h-14 w-12 rounded-2xl border-2 text-center text-[1.4rem] font-black text-gray-900 outline-none transition-all duration-150',
                digits[i]
                  ? 'border-trc bg-trc/5 text-trc'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300',
                'focus:border-trc focus:bg-trc/5 focus:shadow-[0_0_0_3px_rgba(108,43,217,0.12)]'
              ]"
            />
          </div>
        </div>

        <!-- Error -->
        <Transition name="slide-down">
          <div v-if="error" class="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            {{ error }}
          </div>
        </Transition>

        <!-- Success -->
        <Transition name="slide-down">
          <div v-if="successMsg" class="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 font-medium">
            <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            {{ successMsg }}
          </div>
        </Transition>

        <!-- Verify Button -->
        <button
          @click="handleVerify"
          :disabled="loading || otp.length < 6"
          id="verify-btn"
          class="mb-4 w-full rounded-2xl bg-trc py-4 text-[1rem] font-bold text-white shadow-lg shadow-trc/20 transition-all hover:bg-trc/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading" class="inline-flex items-center gap-2">
            <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="40" stroke-dashoffset="15"/>
            </svg>
            Verifying...
          </span>
          <span v-else>Verify Email</span>
        </button>

        <!-- Divider -->
        <div class="flex items-center gap-3 mb-4">
          <span class="h-px flex-1 bg-gray-100"></span>
          <span class="text-[0.7rem] font-bold uppercase tracking-widest text-gray-300">or</span>
          <span class="h-px flex-1 bg-gray-100"></span>
        </div>

        <!-- Resend -->
        <div class="text-center">
          <p class="text-[0.85rem] text-gray-400 font-medium">Didn't receive the code?</p>
          <button
            v-if="resendCountdown === 0"
            @click="handleResend"
            :disabled="resending"
            class="mt-1 text-[0.9rem] font-bold text-trc hover:underline disabled:opacity-50"
          >
            {{ resending ? 'Sending...' : 'Resend code' }}
          </button>
          <p v-else class="mt-1 text-[0.85rem] font-bold text-gray-400">
            Resend in <span class="text-trc">{{ resendCountdown }}s</span>
          </p>
        </div>

        <!-- Back to register -->
        <p class="mt-6 text-center text-[0.8rem] font-medium text-gray-400">
          Wrong email?
          <RouterLink to="/register" class="font-bold text-trc hover:underline">Go back</RouterLink>
        </p>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import axios from 'axios'
import Logo from '@/components/ui/Logo.vue'
import { useAuthStore } from '@/modules/auth/auth.store'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const API_BASE = import.meta.env.VITE_API_BASE

// ── State ──────────────────────────────────────────────────
const digits = ref<string[]>(['', '', '', '', '', ''])
const inputRefs = ref<HTMLInputElement[]>([])
const loading = ref(false)
const resending = ref(false)
const error = ref('')
const successMsg = ref('')
const resendCountdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

// Email from query param (passed by Register.vue)
const displayEmail = computed(() =>
  (route.query.email as string) || authStore.user?.email || 'your email'
)

const otp = computed(() => digits.value.join(''))

// ── OTP input handlers ──────────────────────────────────────
function handleInput(e: Event, index: number) {
  const input = e.target as HTMLInputElement
  const val = input.value.replace(/\D/g, '').slice(-1)
  digits.value[index] = val
  if (val && index < 5) {
    inputRefs.value[index + 1]?.focus()
  }
  error.value = ''
}

function handleKeydown(e: KeyboardEvent, index: number) {
  if (e.key === 'Backspace') {
    if (!digits.value[index] && index > 0) {
      digits.value[index - 1] = ''
      inputRefs.value[index - 1]?.focus()
    } else {
      digits.value[index] = ''
    }
  } else if (e.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus()
  } else if (e.key === 'ArrowRight' && index < 5) {
    inputRefs.value[index + 1]?.focus()
  } else if (e.key === 'Enter') {
    handleVerify()
  }
}

function handlePaste(e: ClipboardEvent) {
  const text = e.clipboardData?.getData('text') || ''
  const nums = text.replace(/\D/g, '').slice(0, 6).split('')
  nums.forEach((ch, i) => {
    if (i < 6) digits.value[i] = ch
  })
  const nextEmpty = nums.length < 6 ? nums.length : 5
  inputRefs.value[nextEmpty]?.focus()
  error.value = ''
}

// ── Verify ──────────────────────────────────────────────────
async function handleVerify() {
  if (otp.value.length < 6) {
    error.value = 'Please enter all 6 digits of the verification code.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await axios.post(
      `${API_BASE}/auth/verify-email`,
      { otp: otp.value, email: route.query.email || authStore.user?.email },
      { withCredentials: true }
    )
    // Refresh user data so role/status is up to date
    await authStore.fetchUser()

    // Role-aware redirect after email verification
    if (authStore.user?.role === 'researcher') {
      router.push('/researcher-info')
    } else {
      router.push(authStore.getPostLoginRoute())
    }
  } catch (err: any) {
    error.value =
      err?.response?.data?.message ||
      'Invalid or expired code. Please try again.'
    // Clear digits on wrong code
    digits.value = ['', '', '', '', '', '']
    inputRefs.value[0]?.focus()
  } finally {
    loading.value = false
  }
}

// ── Resend ──────────────────────────────────────────────────
async function handleResend() {
  resending.value = true
  error.value = ''
  successMsg.value = ''
  try {
    await axios.post(
      `${API_BASE}/auth/resend-verification`,
      { email: route.query.email || authStore.user?.email },
      { withCredentials: true }
    )
    successMsg.value = 'A new code has been sent to your email.'
    startCountdown(60)
  } catch (err: any) {
    error.value =
      err?.response?.data?.message ||
      'Could not resend code. Please try again.'
  } finally {
    resending.value = false
  }
}

function startCountdown(seconds: number) {
  resendCountdown.value = seconds
  if (countdownTimer) clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    resendCountdown.value--
    if (resendCountdown.value <= 0) {
      clearInterval(countdownTimer!)
      countdownTimer = null
      successMsg.value = ''
    }
  }, 1000)
}

// ── Lifecycle ───────────────────────────────────────────────
onMounted(() => {
  inputRefs.value[0]?.focus()
  startCountdown(60) // start 60s resend cooldown on page load
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
})
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

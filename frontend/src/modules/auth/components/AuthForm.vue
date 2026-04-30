<template>
  <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-gray-700" for="auth-email">Email</label>
      <input
        id="auth-email"
        v-model="email"
        type="email"
        class="rounded-lg border border-gray-200 px-3 py-2.5 text-base outline-none focus:border-trc focus:ring-2 focus:ring-trc/20"
        required
      />
    </div>
    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-gray-700" for="auth-password">Password</label>
      <input
        id="auth-password"
        v-model="password"
        type="password"
        class="rounded-lg border border-gray-200 px-3 py-2.5 text-base outline-none focus:border-trc focus:ring-2 focus:ring-trc/20"
        required
      />
    </div>
    <button
      type="submit"
      class="rounded-lg bg-trc px-4 py-3 font-semibold text-white transition hover:bg-trc-dark disabled:cursor-not-allowed disabled:opacity-70"
      :disabled="loading"
    >
      {{ loading ? 'Please wait…' : 'Log In' }}
    </button>
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  loading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  submit: [{ email: string; password: string }]
}>()

const email = ref('')
const password = ref('')

function handleSubmit() {
  emit('submit', { email: email.value, password: password.value })
}
</script>

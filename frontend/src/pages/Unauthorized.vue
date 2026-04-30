<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-6">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
      <h1 class="text-2xl font-black tracking-tight text-gray-900">Access denied</h1>
      <p class="mt-2 text-sm font-medium text-gray-600">
        You don’t have the required role or permissions to view this page.
      </p>

      <div class="mt-6 flex gap-3">
        <button
          class="flex-1 h-11 rounded-xl bg-gray-900 text-white text-sm font-black hover:bg-gray-800 transition"
          @click="goBack"
        >
          Go back
        </button>
        <button
          class="flex-1 h-11 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm font-black hover:bg-gray-50 transition"
          @click="goHome"
        >
          Home
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}

function goHome() {
  router.push({ path: '/' })
}
</script>


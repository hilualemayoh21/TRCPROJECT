<template>
  <div class="min-h-screen bg-white">
    <!-- Only show the global header if we are NOT on the landing page -->
    <!-- Since the landing page implements its own pixel-perfect header -->
    <AppHeader v-if="route.path !== '/'" />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const route = useRoute()
</script>
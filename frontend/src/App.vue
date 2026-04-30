<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const route = useRoute()

const layouts: Record<string, any> = {
  AuthLayout,
  MainLayout,
  DashboardLayout
}

const layoutComponent = computed(() => {
  return layouts[route.meta.layout as string] || 'div'
})
</script>

<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>
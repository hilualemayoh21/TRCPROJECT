<template>
  <component :is="activeDashboard" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/modules/auth/auth.store'
import PublicDashboard from './PublicDashboard.vue'
import ResearcherDashboard from './ResearcherDashboard.vue'
import AdminDashboard from '@/modules/admin/pages/AdminDashboard.vue'

const authStore = useAuthStore()

const activeDashboard = computed(() => {
  const role = authStore.user?.role || 'public_user'
  
  if (role === 'admin') return AdminDashboard
  if (role === 'researcher') return ResearcherDashboard
  return PublicDashboard
})
</script>

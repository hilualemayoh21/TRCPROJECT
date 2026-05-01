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
  const role = String(authStore.user?.role || 'public_user').toLowerCase()
  const email = String(authStore.user?.email || '').toLowerCase()
  console.info('[DashboardDispatcher] Checking identity:', { email, role })
  
  if (email === 'admin@trc.local' || role === 'admin' || role === 'super_admin') {
    console.info('[DashboardDispatcher] Selecting AdminDashboard')
    return AdminDashboard
  }
  if (role === 'researcher') {
    console.info('[DashboardDispatcher] Selecting ResearcherDashboard')
    return ResearcherDashboard
  }
  console.info('[DashboardDispatcher] Selecting PublicDashboard')
  return PublicDashboard
})
</script>

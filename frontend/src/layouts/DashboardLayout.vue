<template>
  <div class="flex min-h-screen w-full overflow-x-hidden bg-gray-50 font-sans selection:bg-trc/20 selection:text-trc outline-none">
    
    <!-- ── SIDEBAR (Hidden on Mobile) ── -->
    <aside class="fixed inset-y-0 left-0 z-50 hidden md:flex w-24 flex-col border-r border-gray-100 bg-white transition-all duration-300 xl:w-80">
      <!-- Logo Area (Centered for Narrow rail, Gap-aligned for Expanded) -->
      <div class="flex h-24 items-center justify-center xl:justify-start gap-4 px-0 xl:px-7 transition-all">
        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-trc text-white shadow-xl shadow-trc/20">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M3 9.5L12 4l9 5.5V20H3V9.5z"/><path d="M9 20v-5.5h6V20"/></svg>
        </div>
        <div class="hidden flex-col xl:flex">
          <span class="text-[0.95rem] font-black leading-tight tracking-tight text-gray-900 uppercase">Tigray Resources</span>
          <span class="text-[0.6rem] font-black text-trc uppercase tracking-[0.15em] opacity-70">Digital Curator</span>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 space-y-2 px-3 xl:px-6 py-6 transition-all duration-300">
        <div class="space-y-1">
          <RouterLink 
            v-for="item in primaryNavItems" 
            :key="item.name"
            :to="item.to"
            class="flex items-center justify-center xl:justify-start gap-0 xl:gap-4 rounded-xl w-14 h-12 xl:w-full xl:h-auto xl:px-4 xl:py-3 transition-all group outline-none"
            :class="[
              route.path === item.to 
                ? 'bg-trc/5 text-trc font-black' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            ]"
          >
            <component :is="item.icon" class="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
            <span class="hidden text-[0.8rem] xl:block">{{ item.name }}</span>
          </RouterLink>
        </div>

        <!-- Management Section -->
        <div class="mt-8 pt-6 border-t border-gray-50">
          <span class="hidden xl:block px-4 mb-4 text-[0.65rem] font-black text-gray-300 uppercase tracking-[0.2em]">Management</span>
          <div class="space-y-1">
            <RouterLink 
              v-for="item in managementNavItems" 
              :key="item.name"
              :to="item.to"
              class="flex items-center justify-center xl:justify-start gap-0 xl:gap-4 rounded-xl w-14 h-12 xl:w-full xl:h-auto xl:px-4 xl:py-3 transition-all group outline-none"
              :class="[
                route.path === item.to 
                  ? 'bg-trc/5 text-trc font-black' 
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              ]"
            >
              <component :is="item.icon" class="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
              <span class="hidden text-[0.8rem] xl:block">{{ item.name }}</span>
            </RouterLink>
          </div>
        </div>
      </nav>

      <!-- Bottom Actions -->
      <div class="px-6 pb-6 mt-auto">
         <!-- Large Upload Button (Image 15 Style) -->
         <button 
           @click="router.push('/upload')"
           class="hidden xl:flex w-full items-center justify-center gap-3 bg-trc text-white py-4 rounded-2xl shadow-xl shadow-trc/20 hover:scale-[1.02] active:scale-95 transition-all mb-8 font-black text-[0.75rem] uppercase tracking-widest outline-none"
         >
            <PlusOutlined style="font-size: 16px" />
            Upload Resource
         </button>

         <div class="flex items-center justify-center xl:justify-between px-2">
           <div class="flex items-center gap-4 pr-3">
               <button class="text-gray-400 hover:text-trc transition-colors"><QuestionCircleOutlined style="font-size: 20px" /></button>
               <button @click="handleLogout" class="text-gray-400 hover:text-red-500 transition-colors"><LogoutOutlined style="font-size: 20px" /></button>
            </div>
            <img v-if="authStore.user" :src="`https://ui-avatars.com/api/?name=${authStore.user?.name}&background=6C2BD9&color=fff`" class="hidden xl:block h-8 w-8 rounded-xl shadow-sm" alt="Profile" />
         </div>
      </div>
    </aside>

    <!-- ── MAIN CONTENT (Adaptive Padding) ── -->
    <main class="flex-1 min-w-0 pl-0 md:pl-24 xl:pl-80 transition-all duration-300">
      <!-- Header Area (Responsive Adjustments) -->
      <header class="sticky top-0 z-40 flex h-20 md:h-24 items-center justify-between border-b border-gray-100 bg-white/95 backdrop-blur-3xl px-6 md:px-8 shadow-[0_1px_5px_rgba(0,0,0,0.02)]">
        <div class="flex items-center gap-14">
          <!-- Search Bar (Reference 25) -->
          <div class="hidden lg:flex items-center bg-gray-50/50 rounded-2xl px-5 py-3 w-72 border border-transparent focus-within:border-trc/20 focus-within:bg-white transition-all shadow-inner">
             <SearchOutlined class="text-gray-300 mr-3" />
             <input type="text" placeholder="Search archives..." class="bg-transparent border-none outline-none text-sm w-full font-medium" />
          </div>

          <!-- Top Navigation Links -->
          <nav class="hidden xl:flex items-center gap-10 translate-y-0.5">
             <a href="#" class="text-[0.65rem] font-black uppercase tracking-[0.25em] text-gray-300 hover:text-gray-500 transition-colors">Directory</a>
             <a href="#" class="text-[0.65rem] font-black uppercase tracking-[0.25em] text-gray-300 hover:text-gray-500 transition-colors">Archive</a>
             <a href="#" class="text-[0.65rem] font-black uppercase tracking-[0.25em] text-trc border-b-2 border-trc pb-1">Community</a>
          </nav>
        </div>

        <!-- Right Header Actions (Profile & Notifications) -->
        <div class="flex items-center gap-6">
           <button class="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-trc hover:border-trc/20 transition-all cursor-pointer">
             <BellOutlined style="font-size: 18px" />
             <span class="absolute right-3.5 top-3.5 h-2 w-2 rounded-full bg-trc"></span>
           </button>
           
           <div class="h-8 w-[1px] bg-gray-100 mx-1"></div>
           
           <div class="flex items-center gap-4 pr-4">
              <div class="hidden md:flex flex-col items-end">
                 <span class="text-[0.75rem] font-black text-gray-900 leading-tight uppercase tracking-tight">{{ authStore.user?.name || 'Curator' }}</span>
                 <span class="text-[0.55rem] font-black uppercase text-trc tracking-[0.15em] opacity-60">{{ authStore.user?.role || 'Public User' }}</span>
              </div>
              <img :src="`https://ui-avatars.com/api/?name=${authStore.user?.name || 'C'}&background=6C2BD9&color=fff`" class="h-10 w-10 md:h-11 md:w-11 rounded-xl shadow-md border-2 border-white cursor-pointer hover:scale-105 transition-transform" />
           </div>
        </div>
      </header>

      <!-- Content Container (Responsive Padding) -->
      <div class="p-4 sm:p-6 md:p-10">
        <slot />
      </div>

      <MockDevPanel />

      <!-- ── MOBILE BOTTOM NAVIGATION (Premium App-like feel) ── -->
      <nav class="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around bg-white/90 backdrop-blur-xl border-t border-gray-100 px-4 pb-safe pt-3 shadow-[0_-1px_20px_rgba(0,0,0,0.05)]">
        <RouterLink 
          v-for="item in navItems" 
          :key="item.name"
          :to="item.to"
          class="flex flex-col items-center gap-1.5 transition-all outline-none"
          :class="[route.path === item.to ? 'text-trc' : 'text-gray-400 opacity-60']"
        >
          <div class="relative transition-transform duration-300" :class="{ 'scale-110 -translate-y-1': route.path === item.to }">
            <component :is="item.icon" class="h-6 w-6" />
            <span v-if="route.path === item.to" class="absolute -top-1 -right-1 flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-trc opacity-40"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-trc"></span>
            </span>
          </div>
          <span class="text-[0.65rem] font-black uppercase tracking-widest">{{ item.name }}</span>
        </RouterLink>
      </nav>
    </main>
  </div>
</template>

<script setup lang="ts">
import { h, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/auth.store'
import MockDevPanel from '@/components/dev/MockDevPanel.vue'
import { 
  LogoutOutlined, 
  QuestionCircleOutlined, 
  SearchOutlined, 
  BellOutlined,
  DashboardOutlined,
  FolderOpenOutlined,
  HistoryOutlined,
  UnlockOutlined,
  SettingOutlined,
  PlusOutlined
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const userRole = computed(() => authStore.user?.role || 'public_user')

const allNavItems = [
  { name: 'Dashboard', to: '/dashboard', icon: DashboardOutlined, roles: ['public_user', 'researcher', 'admin', 'super_admin'] },
  { name: 'Resources', to: '/resources', icon: FolderOpenOutlined, roles: ['public_user', 'researcher', 'admin', 'super_admin'] },
  { name: 'Activity', to: '/activity', icon: HistoryOutlined, roles: ['public_user', 'researcher', 'admin', 'super_admin'] },
  { name: 'Admin Panel', to: '/admin', icon: UnlockOutlined, roles: ['admin', 'super_admin'] },
  { name: 'Settings', to: '/settings', icon: SettingOutlined, roles: ['public_user', 'researcher', 'admin', 'super_admin'] },
]

const primaryNavItems = computed(() => {
  return allNavItems.filter(item => item.roles.includes(userRole.value) && !['Admin Panel', 'Settings'].includes(item.name))
})

const managementNavItems = computed(() => {
  return allNavItems.filter(item => item.roles.includes(userRole.value) && ['Admin Panel', 'Settings'].includes(item.name))
})

const handleLogout = async () => {
  await authStore.logout()
  router.replace({ name: 'Login' })
}
</script>



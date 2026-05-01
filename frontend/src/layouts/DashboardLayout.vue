<template>
  <div
    class="flex min-h-screen w-full overflow-x-hidden font-sans transition-colors duration-300
           bg-slate-50 dark:bg-[#0f1117]"
  >
    <!-- ═══════════════ SIDEBAR ═══════════════ -->
    <aside
      class="fixed inset-y-0 left-0 z-50 hidden md:flex flex-col transition-colors duration-300 w-20 xl:w-72
             bg-white border-r border-slate-200
             dark:bg-[#13151c] dark:border-white/5"
    >
      <!-- Logo -->
      <div class="flex h-20 items-center justify-center xl:justify-start gap-3 px-0 xl:px-6 shrink-0">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-trc text-white shadow-lg shadow-trc/30">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div class="hidden xl:flex flex-col">
          <span class="text-base font-black tracking-tight text-gray-900 dark:text-white">TRC</span>
          <span class="text-[0.6rem] font-bold text-trc uppercase tracking-[0.15em]">Admin Portal</span>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 xl:px-4 py-4 space-y-1 overflow-y-auto">
        <RouterLink
          v-for="item in visibleNavItems"
          :key="item.name"
          :to="item.to"
          class="group flex items-center justify-center xl:justify-start gap-3 rounded-xl px-0 xl:px-3 py-3 transition-all duration-200 outline-none"
          :class="isActive(item.to)
            ? 'bg-trc text-white shadow-lg shadow-trc/30'
            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-200 dark:hover:bg-white/5'"
        >
          <component :is="item.icon" class="h-5 w-5 shrink-0" />
          <span class="hidden xl:block text-sm font-bold">{{ item.name }}</span>
        </RouterLink>
      </nav>

      <!-- Bottom -->
      <div class="shrink-0 px-3 xl:px-4 pb-6 space-y-3">
        <!-- Dark Mode Toggle -->
        <button
          @click="toggleTheme"
          class="w-full flex items-center justify-center xl:justify-start gap-3 rounded-xl px-0 xl:px-3 py-3
                 text-slate-400 hover:text-slate-700 hover:bg-slate-100
                 dark:text-slate-500 dark:hover:text-slate-200 dark:hover:bg-white/5 transition-all"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <svg v-if="isDark" class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <path stroke-linecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <svg v-else class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
          <span class="hidden xl:block text-sm font-bold">{{ isDark ? 'Light Mode' : 'Dark Mode' }}</span>
        </button>

        <!-- Logout -->
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center xl:justify-start gap-3 rounded-xl px-0 xl:px-3 py-3
                 text-slate-400 hover:text-red-500 hover:bg-red-50
                 dark:text-slate-500 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-all"
        >
          <LogoutOutlined class="h-5 w-5 shrink-0" style="font-size:18px" />
          <span class="hidden xl:block text-sm font-bold">Log Out</span>
        </button>

        <!-- Avatar -->
        <div class="flex items-center justify-center xl:justify-start gap-3 pt-2 border-t border-slate-100 dark:border-white/5 mt-2">
          <img
            :src="`https://ui-avatars.com/api/?name=${authStore.user?.name || 'A'}&background=6C2BD9&color=fff&size=80`"
            class="h-9 w-9 rounded-xl shadow-md shrink-0"
          />
          <div class="hidden xl:flex flex-col min-w-0">
            <span class="text-sm font-black text-gray-900 dark:text-white truncate">{{ authStore.user?.name }}</span>
            <span class="text-xs font-bold text-trc truncate">{{ authStore.user?.role }}</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- ═══════════════ MAIN ═══════════════ -->
    <main class="flex-1 min-w-0 md:pl-20 xl:pl-72 transition-all duration-300 flex flex-col">

      <!-- Top Bar -->
      <header
        class="sticky top-0 z-40 flex h-20 items-center justify-between px-6 md:px-8
               border-b backdrop-blur-xl transition-colors duration-300
               bg-white/90 border-slate-200 dark:bg-[#13151c]/90 dark:border-white/5"
      >
        <div class="flex items-center gap-4">
          <!-- Search -->
          <div class="hidden lg:flex items-center gap-2 rounded-xl border px-4 py-2.5 w-64
                      bg-slate-50 border-slate-200 text-slate-400
                      dark:bg-white/5 dark:border-white/10 dark:text-slate-500
                      focus-within:ring-2 focus-within:ring-trc/30 transition-all">
            <SearchOutlined style="font-size:16px" />
            <input
              type="text"
              placeholder="Search..."
              class="bg-transparent outline-none text-sm w-full font-medium text-gray-700 dark:text-gray-200 placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
          </div>
        </div>

        <!-- Right -->
        <div class="flex items-center gap-3">
          <!-- Theme toggle (header) -->
          <button
            @click="toggleTheme"
            class="h-10 w-10 flex items-center justify-center rounded-xl border transition-all
                   border-slate-200 bg-white text-slate-400 hover:text-trc
                   dark:border-white/10 dark:bg-white/5 dark:text-slate-500 dark:hover:text-trc"
          >
            <svg v-if="isDark" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/>
              <path stroke-linecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          </button>

          <!-- Bell -->
          <button
            class="relative h-10 w-10 flex items-center justify-center rounded-xl border transition-all
                   border-slate-200 bg-white text-slate-400 hover:text-trc
                   dark:border-white/10 dark:bg-white/5 dark:text-slate-500 dark:hover:text-trc"
          >
            <BellOutlined style="font-size:18px" />
            <span class="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-trc ring-2 ring-white dark:ring-[#13151c]"></span>
          </button>

          <!-- Profile -->
          <div class="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-white/10">
            <div class="hidden md:flex flex-col items-end">
              <span class="text-sm font-black text-gray-900 dark:text-white">{{ authStore.user?.name || 'Admin' }}</span>
              <span class="text-xs font-bold text-trc uppercase tracking-wider">{{ authStore.user?.role }}</span>
            </div>
            <img
              :src="`https://ui-avatars.com/api/?name=${authStore.user?.name || 'A'}&background=6C2BD9&color=fff`"
              class="h-10 w-10 rounded-xl shadow border-2 border-white dark:border-white/10 cursor-pointer hover:scale-105 transition-transform"
            />
          </div>
        </div>
      </header>

      <!-- Page slot -->
      <div class="flex-1 p-6 md:p-8">
        <slot />
      </div>

      <MockDevPanel />

      <!-- Mobile Bottom Nav -->
      <nav class="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around px-4 pt-3 pb-5
                  backdrop-blur-xl border-t bg-white/90 border-slate-200 dark:bg-[#13151c]/95 dark:border-white/5">
        <RouterLink
          v-for="item in visibleNavItems.slice(0,5)"
          :key="item.name"
          :to="item.to"
          class="flex flex-col items-center gap-1 transition-all"
          :class="isActive(item.to) ? 'text-trc' : 'text-slate-400'"
        >
          <component :is="item.icon" class="h-6 w-6" style="font-size:22px"/>
          <span class="text-[0.6rem] font-black uppercase tracking-widest">{{ item.name }}</span>
        </RouterLink>
      </nav>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/auth.store'
import { useTheme } from '@/composables/useTheme'
import MockDevPanel from '@/components/dev/MockDevPanel.vue'
import {
  LogoutOutlined,
  SearchOutlined,
  BellOutlined,
  DashboardOutlined,
  TeamOutlined,
  SafetyOutlined,
  FolderOpenOutlined,
  AuditOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()
const userRole = computed(() => authStore.user?.role || 'public_user')

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

const allNavItems = [
  { name: 'Dashboard', to: '/dashboard', icon: DashboardOutlined, roles: ['public_user', 'researcher', 'admin', 'super_admin'] },
  { name: 'Users',     to: '/admin/users', icon: TeamOutlined,       roles: ['admin', 'super_admin'] },
  { name: 'Roles',     to: '/admin/roles', icon: SafetyOutlined,     roles: ['admin', 'super_admin'] },
  { name: 'Resources', to: '/resources',   icon: FolderOpenOutlined, roles: ['public_user', 'researcher', 'admin', 'super_admin'] },
  { name: 'Logs',      to: '/admin/audit-logs', icon: AuditOutlined, roles: ['admin', 'super_admin'] },
  { name: 'Settings',  to: '/settings',    icon: SettingOutlined,    roles: ['public_user', 'researcher', 'admin', 'super_admin'] },
]

const userEmail = computed(() => String(authStore.user?.email || '').toLowerCase())

const visibleNavItems = computed(() => {
  if (userEmail.value === 'admin@trc.local') return allNavItems;
  
  const role = userRole.value.toLowerCase();
  return allNavItems.filter(i => i.roles.includes(role));
})

const handleLogout = async () => {
  await authStore.logout()
  router.replace({ name: 'Login' })
}
</script>

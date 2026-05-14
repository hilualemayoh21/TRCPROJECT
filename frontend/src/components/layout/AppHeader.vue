<template>
  <header
    class="fixed left-0 right-0 top-0 z-50 transition-all duration-300"
    :class="[isScrolled ? 'border-b border-gray-200/80 bg-white/95 py-2 shadow-md backdrop-blur-md' : 'bg-white/80 py-3 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none']"
  >
    <nav class="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8">
      <!-- Brand -->
      <RouterLink
        to="/"
        aria-label="Tigray Resource Center — Home"
        class="group flex shrink-0 items-center gap-3 rounded-xl outline-none ring-trc focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <img
          src="@/assets/images/tigray-hero.svg"
          alt=""
          class="h-10 w-10 shrink-0 transition-transform group-hover:scale-105 sm:h-12 sm:w-12"
        />
        <div class="hidden flex-col sm:flex">
          <span class="text-xl font-black uppercase leading-none tracking-tight text-gray-900 sm:text-2xl">Tigray</span>
          <span class="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] leading-none text-trc">
            Resource Center
          </span>
        </div>
      </RouterLink>

      <!-- Desktop Links -->
      <div class="hidden items-center gap-1 lg:flex lg:gap-0.5 xl:gap-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 outline-none transition-colors hover:bg-trc/10 hover:text-trc focus-visible:ring-2 focus-visible:ring-trc xl:px-3.5"
        >
          <img :src="item.icon" alt="" class="h-5 w-5 shrink-0 opacity-90" />
          <span class="whitespace-nowrap">{{ item.name }}</span>
        </RouterLink>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <RouterLink
          v-if="!authStore.user"
          to="/login"
          class="hidden items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-trc focus-visible:ring-offset-2 sm:inline-flex"
        >
          Login
        </RouterLink>

        <RouterLink
          v-else
          to="/dashboard"
          class="hidden items-center gap-2 rounded-xl bg-trc/10 px-4 py-2.5 text-sm font-bold text-trc outline-none transition hover:bg-trc/20 focus-visible:ring-2 focus-visible:ring-trc focus-visible:ring-offset-2 sm:inline-flex"
        >
          Dashboard
        </RouterLink>

        <RouterLink
          to="/support-us"
          class="hidden items-center gap-2 rounded-xl bg-trc px-4 py-2.5 text-sm font-bold text-white outline-none transition hover:bg-trc-dark focus-visible:ring-2 focus-visible:ring-trc focus-visible:ring-offset-2 sm:inline-flex"
        >
          Support Us
        </RouterLink>

        <button
          type="button"
          class="inline-flex rounded-xl border border-gray-200 bg-white p-2.5 text-gray-800 shadow-sm lg:hidden"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg v-if="!isMenuOpen" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" d="M4 7h16M4 12h16M4 17h10" />
          </svg>
          <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div
      v-if="isMenuOpen"
      class="border-b border-gray-100 bg-white px-4 py-4 shadow-lg lg:hidden"
    >
      <div class="flex flex-col gap-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold text-gray-700 hover:bg-trc/10"
          @click="isMenuOpen = false"
        >
          <img :src="item.icon" alt="" class="h-6 w-6 shrink-0" />
          {{ item.name }}
        </RouterLink>
        <RouterLink
          v-if="!authStore.user"
          to="/login"
          class="flex items-center justify-center gap-3 rounded-xl border border-gray-100 bg-white py-3.5 text-base font-bold text-gray-700 shadow-sm"
          @click="isMenuOpen = false"
        >
          Login
        </RouterLink>
        <RouterLink
          v-else
          to="/dashboard"
          class="flex items-center justify-center gap-3 rounded-xl bg-trc/10 py-3.5 text-base font-bold text-trc"
          @click="isMenuOpen = false"
        >
          Dashboard
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/modules/auth/auth.store'

import iconHome from '@/assets/icons/nav-home.svg'
import iconResources from '@/assets/icons/nav-resources.svg'
import iconNews from '@/assets/icons/nav-news.svg'
import iconEvents from '@/assets/icons/nav-events.svg'
import iconInvolved from '@/assets/icons/nav-involved.svg'

const authStore = useAuthStore()
const isScrolled = ref(false)
const isMenuOpen = ref(false)

const navItems = [
  { name: 'Home', path: '/', icon: iconHome },
  { name: 'Resources', path: '/search', icon: iconResources },
  { name: 'News', path: '/news', icon: iconNews },
  { name: 'Events', path: '/events', icon: iconEvents },
  { name: 'Get Involved', path: '/get-involved', icon: iconInvolved },
]

const onScroll = () => {
  isScrolled.value = window.scrollY > 24
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

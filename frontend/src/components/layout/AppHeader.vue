<template>
  <header class="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-50">
    <nav class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-3">
        <img src="@/assets/images/tigray-logo.svg" alt="Tigray Logo" class="h-12 w-12" />
        <div class="flex flex-col">
          <span class="text-2xl font-black uppercase leading-none tracking-tight text-gray-900">TIGRAY</span>
          <span class="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] leading-none text-[#5e35b1]">Resource Center</span>
        </div>
      </RouterLink>

      <!-- Desktop Nav -->
      <div class="hidden items-center gap-10 lg:flex">
        <RouterLink v-for="link in navLinks" :key="link.name" :to="link.to" class="text-sm font-bold text-gray-600 transition-colors hover:text-[#5e35b1]">
          {{ link.name }}
        </RouterLink>
      </div>

      <!-- Action -->
      <div class="flex items-center gap-4">
        <RouterLink to="/support-us" class="hidden rounded-xl bg-[#5e35b1] px-8 py-3 text-sm font-black text-white shadow-lg shadow-[#5e35b1]/20 transition-all hover:bg-[#4a2bb1] sm:block">
          Support Us
        </RouterLink>
        
        <!-- Mobile Toggle placeholder -->
        <button class="lg:hidden text-gray-600 p-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const navLinks = [
  { name: 'About Us', to: '/about' },
  { name: 'Resources', to: '/search' },
  { name: 'News & Updates', to: '/news' },
  { name: 'Events', to: '/events' },
  { name: 'Get Involved', to: '/get-involved' }
]
</script>

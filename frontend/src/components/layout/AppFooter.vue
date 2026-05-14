<template>
  <footer class="bg-[#1e2336] text-white pt-16 pb-8 border-t-[6px] border-[#311956]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        
        <!-- Brand & Description -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-3 mb-4">
            <img src="@/assets/images/tigray-hero.svg" alt="Tigray Logo" class="h-8 w-auto brightness-0 invert" />
            <div class="flex flex-col">
              <span class="text-lg font-bold tracking-widest text-white leading-none uppercase">TIGRAY</span>
              <span class="text-[10px] font-semibold tracking-widest text-[#9d72ff] leading-none mt-1 uppercase">RESOURCE CENTER</span>
            </div>
          </div>
          <p class="text-sm text-gray-400 leading-relaxed pr-4">
            Empowering Tigray by preserving our heritage, sharing knowledge, and supporting sustainable development for a brighter future.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-sm font-semibold mb-4 text-white">Quick Links</h3>
          <ul class="space-y-3">
            <li><RouterLink to="/about" class="text-sm text-gray-400 hover:text-white transition-colors">About Us</RouterLink></li>
            <li><RouterLink to="/search" class="text-sm text-gray-400 hover:text-white transition-colors">Resources</RouterLink></li>
            <li><RouterLink to="/news" class="text-sm text-gray-400 hover:text-white transition-colors">News & Updates</RouterLink></li>
            <li><RouterLink to="/events" class="text-sm text-gray-400 hover:text-white transition-colors">Events</RouterLink></li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h3 class="text-sm font-semibold mb-4 text-white">Resources</h3>
          <ul class="space-y-3">
            <li><RouterLink to="/search" class="text-sm text-gray-400 hover:text-white transition-colors">Research Library</RouterLink></li>
            <li><RouterLink to="/search" class="text-sm text-gray-400 hover:text-white transition-colors">Reports & Publications</RouterLink></li>
            <li><RouterLink to="/search" class="text-sm text-gray-400 hover:text-white transition-colors">Multimedia</RouterLink></li>
            <li><RouterLink to="/search" class="text-sm text-gray-400 hover:text-white transition-colors">Community Stories</RouterLink></li>
          </ul>
        </div>

        <!-- Get Involved -->
        <div>
          <h3 class="text-sm font-semibold mb-4 text-white">Get Involved</h3>
          <ul class="space-y-3">
            <li><RouterLink to="/register" class="text-sm text-gray-400 hover:text-white transition-colors">Volunteer</RouterLink></li>
            <li><RouterLink to="/about" class="text-sm text-gray-400 hover:text-white transition-colors">Partnerships</RouterLink></li>
            <li><RouterLink to="/support-us" class="text-sm text-gray-400 hover:text-white transition-colors">Donate</RouterLink></li>
          </ul>
        </div>

        <!-- Stay Connected -->
        <div class="lg:col-span-1">
          <h3 class="text-sm font-semibold mb-4 text-white">Stay Connected</h3>
          <p class="text-sm text-gray-400 mb-4">
            Subscribe to our newsletter for the latest updates.
          </p>
          <form class="flex mb-6" @submit.prevent="handleSubscribe">
            <input 
              v-model="email"
              type="email" 
              placeholder="Your email" 
              required
              class="bg-transparent border border-gray-600 rounded-l-md px-3 py-2 text-sm w-full focus:outline-none focus:border-[#9d72ff] text-white" 
            />
            <button 
              type="submit" 
              :disabled="loading"
              class="bg-[#5f2dbd] hover:bg-[#4a2399] text-white px-4 py-2 rounded-r-md text-sm font-medium transition-colors disabled:opacity-50"
            >
              {{ loading ? '...' : 'Go' }}
            </button>
          </form>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div class="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-sm text-gray-400">
          &copy; {{ new Date().getFullYear() }} Tigray Resource Center. All rights reserved.
        </p>
        <div class="flex gap-4 text-sm text-gray-400">
          <RouterLink to="/privacy-policy" class="hover:text-white transition-colors">Privacy Policy</RouterLink>
          <span class="text-gray-600">|</span>
          <RouterLink to="/terms-of-use" class="hover:text-white transition-colors">Terms of Use</RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { publicApi } from '@/modules/home/services/public.api'
import { message } from 'ant-design-vue'

const email = ref('')
const loading = ref(false)

const handleSubscribe = async () => {
  if (!email.value) return

  try {
    loading.value = true
    const res = await publicApi.subscribe(email.value)
    message.success(res.message || 'Subscribed successfully!')
    email.value = ''
  } catch (err: any) {
    message.error(err.response?.data?.error || 'Failed to subscribe')
  } finally {
    loading.value = false
  }
}
</script>

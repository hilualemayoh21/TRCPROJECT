<template>
  <div class="min-h-screen bg-white font-sans">

    <!-- Cinematic Hero -->
    <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-28 overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <div
          class="absolute inset-0 bg-cover bg-center"
          :style="{ backgroundImage: `url(${gheraltaBg})` }"
        ></div>
        <!-- Strong dark overlay -->
        <div class="absolute inset-0" style="background: linear-gradient(135deg, rgba(26,11,46,0.92) 0%, rgba(26,11,46,0.75) 60%, rgba(94,53,177,0.65) 100%);"></div>
        <!-- Bottom fade into content below -->
        <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-gray-50"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span class="inline-block px-5 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-[0.3em] text-purple-300 mb-8">Join the Movement</span>
        <h1 class="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
          Make a<br/><span class="text-[#b68eff]">Difference.</span>
        </h1>
        <p class="text-xl text-white/60 max-w-2xl mx-auto font-medium">
          Your skills, time, and voice can help preserve Tigray's heritage and empower our communities.
        </p>
      </div>
    </section>

    <!-- Ways to Get Involved -->
    <section class="py-20 lg:py-32 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-xs font-black uppercase tracking-[0.3em] text-[#5e35b1] mb-3">How You Can Help</h2>
          <div class="h-px bg-gray-200 mb-8 max-w-xs mx-auto"></div>
          <p class="text-gray-500 text-lg font-medium max-w-xl mx-auto">Choose a path that matches your passion and skills.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <!-- Volunteer Card -->
          <div class="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 p-10 flex flex-col">
            <div class="w-16 h-16 rounded-2xl bg-purple-50 text-[#5e35b1] flex items-center justify-center mb-8 group-hover:bg-[#5e35b1] group-hover:text-white transition-all duration-500">
               <UserOutlined style="font-size: 28px" />
            </div>
            <h3 class="text-2xl font-black text-gray-900 mb-4 tracking-tight uppercase">Volunteer</h3>
            <p class="text-gray-500 font-medium leading-relaxed mb-8 flex-1">
              We're always looking for passionate individuals to help with document translation, community outreach, event organization, and digital archiving.
            </p>
            <button class="w-full py-4 bg-[#5e35b1] text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-[#5e35b1]/30 hover:bg-[#512da8] hover:-translate-y-0.5 transition-all">
              Apply to Volunteer →
            </button>
          </div>

          <!-- Partner Card -->
          <div class="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 p-10 flex flex-col">
            <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
               <GlobalOutlined style="font-size: 28px" />
            </div>
            <h3 class="text-2xl font-black text-gray-900 mb-4 tracking-tight uppercase">Partner</h3>
            <p class="text-gray-500 font-medium leading-relaxed mb-8 flex-1">
              We collaborate with universities, NGOs, and community organizations. Partner with us to expand our reach and amplify our collective impact.
            </p>
            <button class="w-full py-4 border-2 border-[#5e35b1]/20 text-[#5e35b1] rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-[#5e35b1] hover:text-white transition-all">
              Partnership Inquiry →
            </button>
          </div>

          <!-- Donate Card -->
          <div class="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 p-10 flex flex-col">
            <div class="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-8 group-hover:bg-green-600 group-hover:text-white transition-all duration-500">
               <HeartOutlined style="font-size: 28px" />
            </div>
            <h3 class="text-2xl font-black text-gray-900 mb-4 tracking-tight uppercase">Donate</h3>
            <p class="text-gray-500 font-medium leading-relaxed mb-8 flex-1">
              Your financial support directly funds digital archiving projects, community scholarships, and sustainable development programs across Tigray.
            </p>
            <RouterLink to="/support-us" class="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider text-center shadow-lg shadow-green-600/20 hover:bg-green-700 hover:-translate-y-0.5 transition-all block">
              Support Us →
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Community Impact Stats -->
    <section class="py-24 bg-[#1a0b2e] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <div v-for="stat in stats" :key="stat.label">
            <div class="text-5xl font-black mb-3 text-white">{{ stat.value }}</div>
            <div class="text-xs uppercase tracking-[0.35em] text-[#5e35b1] font-black">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-32 bg-[#5e35b1] relative overflow-hidden">
      <div class="absolute inset-0" style="background-image: radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%);"></div>
      <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-none">
          Ready to<br/>Get Started?
        </h2>
        <p class="text-xl text-white/70 max-w-xl mx-auto mb-12 font-medium">
          Join thousands of community members who are already making an impact. Every contribution counts.
        </p>
        <div class="flex flex-col sm:flex-row gap-6 justify-center">
          <button class="px-12 py-5 bg-white text-[#5e35b1] rounded-2xl font-black text-base uppercase tracking-wider shadow-2xl hover:-translate-y-1 transition-all">
            Apply Now
          </button>
          <RouterLink to="/contact-us" class="px-12 py-5 border-2 border-white/40 text-white rounded-2xl font-black text-base uppercase tracking-wider hover:bg-white hover:text-[#5e35b1] transition-all hover:-translate-y-1">
            Contact Us
          </RouterLink>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { UserOutlined, GlobalOutlined, HeartOutlined } from '@ant-design/icons-vue'
import gheraltaBg from '@/assets/images/hero_bg_gheralta.png'

const stats = [
  { value: '1,200+', label: 'Resources' },
  { value: '50K+', label: 'Community Members' },
  { value: '120+', label: 'Volunteers' },
  { value: '12', label: 'Active Programs' },
]
</script>

<template>
  <div class="min-h-screen bg-white font-sans">

    <!-- Hero Section (Synced with Landing Page Design) -->
    <section class="relative h-[65vh] flex items-center overflow-hidden pt-20">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img 
          src="@/assets/images/hero_bg_gheralta.png" 
          alt="Community Involvement" 
          class="w-full h-full object-cover object-center"
        />
        <!-- Signature White/Purple Wash -->
        <div class="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent"></div>
        <div class="absolute inset-0 bg-[#5e35b1]/5 mix-blend-multiply"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 mx-auto max-w-7xl px-6 w-full">
        <div class="max-w-3xl animate-fade-up">
          <h2 class="text-xs font-black text-[#5e35b1] uppercase tracking-[0.4em] mb-6">Partnerships</h2>
          <h1 class="text-5xl md:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight">
            Build the<br/>
            <span class="text-[#5e35b1]">Foundation.</span>
          </h1>
          <div class="mt-5 h-1.5 w-24 rounded-full bg-[#5e35b1]"></div>
          <p class="mt-10 text-lg md:text-xl text-gray-600 font-medium max-w-xl leading-relaxed">
            There are many ways to support the Tigray Resource Center. Join us as a volunteer, a partner, or a contributor.
          </p>
        </div>
      </div>
    </section>

    <!-- Involvement Options -->
    <section class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="option in options" :key="option.title" class="bg-white p-12 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col gap-8 hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-16 h-16 bg-[#5e35b1]/5 text-[#5e35b1] rounded-2xl flex items-center justify-center group-hover:bg-[#5e35b1] group-hover:text-white transition-all">
              <component :is="option.icon" style="font-size: 28px" />
            </div>
            <div>
              <h3 class="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">{{ option.title }}</h3>
              <p class="text-gray-500 text-lg leading-relaxed font-medium mb-8">{{ option.desc }}</p>
              <button class="text-sm font-black uppercase tracking-widest text-[#5e35b1] group-hover:translate-x-2 transition-transform">
                Get Started →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Support Section (Synced with Mockup Style) -->
    <section class="py-32 bg-[#1a0b2e] relative overflow-hidden text-center">
      <div class="absolute inset-0" style="background-image: radial-gradient(ellipse at 80% 50%, rgba(94,53,177,0.3) 0%, transparent 60%);"></div>
      <div class="relative z-10 max-w-4xl mx-auto px-6">
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-purple-200 mb-8">Support Us</h2>
        <h3 class="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-none">Every Contribution<br/>Matters.</h3>
        <p class="text-xl text-white/50 max-w-xl mx-auto mb-12 font-medium">Your support directly funds the digitization of heritage and community development programs.</p>
        <RouterLink to="/support-us" class="inline-flex items-center gap-3 px-12 py-5 bg-[#5e35b1] text-white rounded-2xl font-black text-base uppercase tracking-wider shadow-2xl hover:-translate-y-1 transition-all">
          Donate Now
        </RouterLink>
      </div>
    </section>

  </div>
</template>

<script setup>
import { 
  UsergroupAddOutlined, 
  GiftOutlined, 
  GlobalOutlined 
} from '@ant-design/icons-vue'
import { markRaw } from 'vue'

const options = [
  {
    title: 'Volunteer',
    desc: 'Contribute your time and expertise to help us archive and manage resources.',
    icon: markRaw(UsergroupAddOutlined)
  },
  {
    title: 'Partner',
    desc: 'Institutional partnerships to expand the reach and depth of our knowledge base.',
    icon: markRaw(GlobalOutlined)
  },
  {
    title: 'Donate',
    desc: 'Financial support ensures the long-term sustainability of the TRC project.',
    icon: markRaw(GiftOutlined)
  }
]
</script>

<style scoped>
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-up {
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>

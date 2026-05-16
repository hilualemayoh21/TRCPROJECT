<template>
  <div class="bg-white min-h-screen font-sans">
    
    <!-- Hero Section (Synced with Landing Page Design) -->
    <section class="relative h-[65vh] flex items-center overflow-hidden pt-20">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img 
          src="@/assets/images/hero_bg_gheralta.png" 
          alt="Gheralta Mountains" 
          class="w-full h-full object-cover object-center"
        />
        <!-- Signature White/Purple Wash -->
        <div class="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        <div class="absolute inset-0 bg-[#5e35b1]/5 mix-blend-multiply"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 mx-auto max-w-7xl px-6 w-full">
        <div class="max-w-3xl animate-fade-up">
          <h2 class="text-xs font-black text-[#5e35b1] uppercase tracking-[0.4em] mb-6">Our Story</h2>
          <h1 class="text-5xl md:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight">
            Preserving the past.
          </h1>
          <div class="mt-5 h-1.5 w-24 rounded-full bg-[#5e35b1]"></div>
          <h1 class="mt-4 text-5xl md:text-7xl font-black text-[#5e35b1] leading-[1.05] tracking-tight">
            Inspiring the future.
          </h1>
          <p class="mt-10 text-lg md:text-xl text-gray-600 font-medium max-w-xl leading-relaxed">
            The Tigray Resource Center is a collective effort to archive, protect, and celebrate the world-class heritage of the Tigray region.
          </p>
        </div>
      </div>
    </section>

    <!-- Mission & Vision Cards -->
    <section class="max-w-7xl mx-auto px-6 py-24 -mt-20 relative z-20">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Mission -->
        <div class="bg-white p-12 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col gap-8 hover:-translate-y-2 transition-all duration-500 group">
          <div class="w-16 h-16 bg-[#5e35b1]/5 text-[#5e35b1] rounded-2xl flex items-center justify-center group-hover:bg-[#5e35b1] group-hover:text-white transition-all">
            <RocketOutlined style="font-size: 28px" />
          </div>
          <div>
            <h3 class="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Our Mission</h3>
            <p class="text-gray-500 text-lg leading-relaxed font-medium">
              To build a comprehensive digital archive that empowers researchers, community members, and future generations with accessible knowledge about our heritage, development, and culture.
            </p>
          </div>
        </div>

        <!-- Vision -->
        <div class="bg-white p-12 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col gap-8 hover:-translate-y-2 transition-all duration-500 group">
          <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
            <EyeOutlined style="font-size: 28px" />
          </div>
          <div>
            <h3 class="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">Our Vision</h3>
            <p class="text-gray-500 text-lg leading-relaxed font-medium">
              We envision a globally connected community that leverages shared knowledge to foster unity, resilience, and sustainable development across the Tigray region and beyond.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Values Section -->
    <section class="bg-gray-50/50 py-32 overflow-hidden">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-20">
          <h2 class="text-xs font-black text-[#5e35b1] uppercase tracking-[0.3em] mb-4">Values</h2>
          <h2 class="text-4xl font-black text-gray-900 uppercase tracking-tight">What Drives Us</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <!-- Value 1 -->
          <div class="flex flex-col items-center text-center">
            <div class="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-[#5e35b1] mb-8 border border-gray-100 transition-transform hover:scale-110">
              <SafetyCertificateOutlined style="font-size: 32px" />
            </div>
            <h4 class="text-lg font-black text-gray-900 uppercase tracking-tight mb-4">Preservation</h4>
            <p class="text-gray-400 text-sm font-medium leading-relaxed px-6">
              Safeguarding ancient manuscripts, oral histories, and architectural data for future generations.
            </p>
          </div>

          <!-- Value 2 -->
          <div class="flex flex-col items-center text-center">
            <div class="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-blue-500 mb-8 border border-gray-100 transition-transform hover:scale-110">
              <GlobalOutlined style="font-size: 32px" />
            </div>
            <h4 class="text-lg font-black text-gray-900 uppercase tracking-tight mb-4">Accessibility</h4>
            <p class="text-gray-400 text-sm font-medium leading-relaxed px-6">
              Ensuring that knowledge is open, digital, and reachable by anyone, anywhere in the world.
            </p>
          </div>

          <!-- Value 3 -->
          <div class="flex flex-col items-center text-center">
            <div class="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-orange-500 mb-8 border border-gray-100 transition-transform hover:scale-110">
              <TeamOutlined style="font-size: 32px" />
            </div>
            <h4 class="text-lg font-black text-gray-900 uppercase tracking-tight mb-4">Collaboration</h4>
            <p class="text-gray-400 text-sm font-medium leading-relaxed px-6">
              Working with institutions and local communities to create the most accurate and inclusive resource center.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA Section (Synced with Landing Page) -->
    <section class="py-32 bg-[#5e35b1] relative overflow-hidden">
      <div class="absolute inset-0" style="background-image: radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 60%);"></div>
      <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-purple-200 mb-8">Get Started</h2>
        <h3 class="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-none">
          Ready to contribute to<br/>the digital legacy?
        </h3>
        <p class="text-xl text-white/70 max-w-xl mx-auto mb-12 font-medium">
          Join thousands of community members who are already archiving, learning, and building the future of Tigray.
        </p>
        <div class="flex flex-col sm:flex-row gap-6 justify-center">
          <RouterLink to="/register" class="px-12 py-5 bg-white text-[#5e35b1] rounded-2xl font-black text-base uppercase tracking-wider shadow-2xl hover:-translate-y-1 transition-all">
            Join Now
          </RouterLink>
          <RouterLink to="/contact-us" class="px-12 py-5 border-2 border-white/40 text-white rounded-2xl font-black text-base uppercase tracking-wider hover:bg-white hover:text-[#5e35b1] transition-all hover:-translate-y-1">
            Contact Us
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { 
  RocketOutlined, 
  EyeOutlined, 
  SafetyCertificateOutlined, 
  GlobalOutlined, 
  TeamOutlined 
} from '@ant-design/icons-vue'
import { RouterLink } from 'vue-router'
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

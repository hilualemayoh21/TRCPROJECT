<template>
  <div class="bg-white min-h-screen font-sans">
    
    <!-- Cinematic About Hero -->
    <section class="relative h-[60vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img 
          src="@/assets/images/hero_bg_gheralta.png" 
          alt="Gheralta Mountains" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-[#2c154f]/60 mix-blend-multiply"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-[#1a0b2e]/20 via-transparent to-white"></div>
      </div>

      <div class="relative z-10 text-center px-4 max-w-4xl">
        <h2 class="text-xs md:text-sm font-black text-[#b68eff] uppercase tracking-[0.4em] mb-4 animate-fade-in">Our Story</h2>
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
          Preserving the past.<br/>
          <span class="text-[#b68eff]">Inspiring the future.</span>
        </h1>
        <p class="text-lg md:text-xl text-gray-200 font-medium max-w-2xl mx-auto leading-relaxed">
          The Tigray Resource Center is a collective effort to archive, protect, and celebrate the world-class heritage of the Tigray region.
        </p>
      </div>
    </section>

    <!-- Mission & Vision Cards -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 -mt-20 relative z-20">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Mission -->
        <div class="bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col gap-8 hover:-translate-y-2 transition-transform duration-500 group">
          <div class="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
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
        <div class="bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col gap-8 hover:-translate-y-2 transition-transform duration-500 group">
          <div class="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
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
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-xs font-black text-purple-700 uppercase tracking-[0.3em] mb-4">Values</h2>
          <h2 class="text-4xl font-black text-gray-900 uppercase tracking-tight">What Drives Us</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <!-- Value 1 -->
          <div class="flex flex-col items-center text-center">
            <div class="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-purple-600 mb-8 border border-gray-100">
              <SafetyCertificateOutlined style="font-size: 32px" />
            </div>
            <h4 class="text-lg font-black text-gray-900 uppercase tracking-tight mb-4">Preservation</h4>
            <p class="text-gray-400 text-sm font-medium leading-relaxed px-6">
              Safeguarding ancient manuscripts, oral histories, and architectural data for future generations.
            </p>
          </div>

          <!-- Value 2 -->
          <div class="flex flex-col items-center text-center">
            <div class="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-blue-500 mb-8 border border-gray-100">
              <GlobalOutlined style="font-size: 32px" />
            </div>
            <h4 class="text-lg font-black text-gray-900 uppercase tracking-tight mb-4">Accessibility</h4>
            <p class="text-gray-400 text-sm font-medium leading-relaxed px-6">
              Ensuring that knowledge is open, digital, and reachable by anyone, anywhere in the world.
            </p>
          </div>

          <!-- Value 3 -->
          <div class="flex flex-col items-center text-center">
            <div class="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-orange-500 mb-8 border border-gray-100">
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

    <!-- Final Call to Action -->
    <section class="py-32 px-4">
      <div class="max-w-5xl mx-auto bg-[#1a0b2e] rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden">
        <!-- Abstract Glow -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-purple-700/20 blur-[120px] rounded-full"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-blue-700/10 blur-[120px] rounded-full"></div>

        <div class="relative z-10">
          <h2 class="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-8">
            Be Part of the Legacy
          </h2>
          <p class="text-lg text-gray-400 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            Whether you're a researcher, a student, or a community member, there's a place for you at the Tigray Resource Center.
          </p>
          <div class="flex flex-col sm:flex-row gap-6 justify-center">
             <RouterLink to="/get-involved" class="px-10 py-4 bg-[#5222b0] hover:bg-[#3c1f62] text-white font-bold text-lg rounded-2xl transition-all shadow-xl shadow-purple-900/40">
               Apply to Volunteer
             </RouterLink>
             <RouterLink to="/search" class="px-10 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-lg rounded-2xl transition-all">
               Explore Archives
             </RouterLink>
          </div>
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
.animate-fade-in {
  animation: fadeIn 1.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

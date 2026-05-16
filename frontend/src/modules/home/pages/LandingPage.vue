<template>
  <div class="min-h-screen bg-white font-sans overflow-x-hidden">
    <!-- Header -->
    <header class="absolute top-0 left-0 right-0 z-[100] bg-transparent">
      <nav class="mx-auto flex h-24 max-w-7xl items-center justify-between px-6 lg:px-8">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <img src="@/assets/images/tigray-logo.svg" alt="Tigray Logo" class="h-14 w-14" />
          <div class="flex flex-col">
            <span class="text-2xl font-black uppercase leading-none tracking-tight text-gray-900">TIGRAY</span>
            <span class="mt-1 text-[11px] font-bold uppercase tracking-[0.25em] leading-none text-[#5e35b1]">Resource Center</span>
          </div>
        </div>

        <!-- Links -->
        <div class="hidden items-center gap-10 lg:flex">
          <RouterLink v-for="l in nav" :key="l" to="#" class="text-[15px] font-bold text-gray-700 hover:text-[#5e35b1] transition-colors">{{ l }}</RouterLink>
        </div>

        <!-- CTA -->
        <button class="hidden lg:block rounded-xl bg-[#5e35b1] px-8 py-3.5 text-sm font-black text-white hover:bg-[#4a2bb1] transition-all shadow-md">
          Support Us
        </button>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
        <img
          src="@/assets/images/landing-hero-mockup.png"
          alt=""
          class="h-full w-full object-cover object-[70%_center] lg:object-[80%_center]"
        />
        <!-- White to Transparent Gradient -->
        <div class="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent lg:via-white/60"></div>
      </div>

      <!-- Hero Content Container -->
      <!-- Added explicit pt-32 (128px) so it clears the 96px header -->
      <div class="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full pt-32 pb-48">
        <div class="max-w-3xl flex flex-col gap-6">
          
          <!-- Headings Container -->
          <div class="flex flex-col gap-4 animate-fade-up">
            <!-- First Line -->
            <div>
              <h1 class="text-5xl sm:text-6xl lg:text-[5rem] font-black text-gray-900 tracking-tight leading-tight">
                Empowering Tigray.
              </h1>
              <!-- Underline -->
              <div class="mt-4 h-2 w-24 rounded-full bg-[#5e35b1]"></div>
            </div>
            
            <!-- Second Line -->
            <div>
              <h1 class="text-5xl sm:text-6xl lg:text-[5rem] font-black text-[#5e35b1] tracking-tight leading-tight">
                Inspiring the Future.
              </h1>
            </div>
          </div>

          <!-- Description -->
          <p class="animate-fade-up max-w-xl text-lg lg:text-xl text-gray-600 font-medium leading-relaxed mt-4" style="animation-delay: 0.1s">
            The Tigray Resource Center is dedicated to preserving our heritage, promoting knowledge, and supporting sustainable development for a stronger tomorrow.
          </p>

          <!-- Action Buttons -->
          <div class="animate-fade-up flex flex-wrap items-center gap-5 mt-6" style="animation-delay: 0.2s">
            <button class="flex items-center gap-3 rounded-xl bg-[#5e35b1] px-8 py-4 text-base font-black text-white hover:bg-[#4a2bb1] transition-all shadow-xl shadow-[#5e35b1]/30">
              Explore Resources
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <button class="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white/80 px-6 py-4 text-base font-black text-gray-700 backdrop-blur-md hover:border-[#5e35b1] hover:text-[#5e35b1] transition-all">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-[#5e35b1]/10 text-[#5e35b1] group-hover:bg-[#5e35b1] group-hover:text-white transition-all">
                <svg class="ml-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              Learn More
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Bar / Waves -->
      <div class="absolute bottom-0 left-0 right-0 z-20">
        <!-- SVG Waves -->
        <div class="relative h-20 sm:h-28 -mb-px">
          <!-- Light Wave -->
          <svg class="absolute inset-0 w-full h-full text-[#5e35b1]/10" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L0,320Z"></path>
          </svg>
          <!-- Dark Wave -->
          <svg class="absolute inset-0 w-full h-full text-[#1a0b2e]" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,213.3C840,203,960,149,1080,144C1200,139,1320,181,1380,202.7L1440,224L1440,320L0,320Z"></path>
          </svg>
        </div>
        <!-- Dark Bar -->
        <div class="bg-[#1a0b2e] pb-12 pt-0">
          <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div v-for="f in feats" :key="f.t" class="flex items-center gap-5 group">
                <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white transition-all group-hover:bg-white group-hover:text-[#1a0b2e]">
                  <component :is="f.i" class="h-6 w-6" />
                </div>
                <div>
                  <h3 class="text-base font-black uppercase tracking-tight text-white leading-none">{{ f.t }}</h3>
                  <p class="mt-1.5 text-xs font-medium text-white/50 leading-tight pr-4">{{ f.d }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { markRaw } from 'vue'

const nav = ['About Us', 'Resources', 'News & Updates', 'Events', 'Get Involved']
const feats = [
  { t: 'Knowledge', d: 'Access reliable information and research.', i: markRaw({ template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path></svg>' }) },
  { t: 'Community', d: 'Building connections and strengthening unity.', i: markRaw({ template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>' }) },
  { t: 'Development', d: 'Supporting sustainable growth and innovation.', i: markRaw({ template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M12 22V10m0 0c-3-2-6-1-6 2s3 4 6 2zm0 0c3-2 6-1 6 2s-3 4-6 2"></path></svg>' }) },
  { t: 'Heritage', d: 'Preserving our rich history and culture.', i: markRaw({ template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>' }) }
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

<template>
  <div class="min-h-screen overflow-x-hidden bg-white">
    <section class="relative isolate overflow-hidden">
      <div class="absolute inset-0">
        <img
          src="@/assets/images/aksum_landscape_bg.png"
          alt="Aksum landscape"
          class="h-full w-full object-cover object-[70%_center]"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-white via-white/82 to-white/8"></div>
      </div>

      <div class="relative z-10 mx-auto flex min-h-[720px] max-w-[1280px] flex-col px-6 pt-5 lg:px-8">
        <header class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <img src="@/assets/images/tigray-logo.svg" alt="Tigray Resource Center logo" class="h-11 w-11" />
            <div class="leading-none">
              <p class="text-[27px] font-black tracking-[0.12em] text-[#191744]">TIGRAY</p>
              <p class="mt-1 text-[12px] font-bold uppercase tracking-[0.22em] text-[#6552a7]">Resource Center</p>
            </div>
          </div>

          <nav class="hidden items-center gap-11 text-[15px] font-semibold text-[#2e2a4a] lg:flex">
            <a v-for="item in nav" :key="item.label" :href="item.href" class="transition hover:text-[#5e35b1]">
              {{ item.label }}
            </a>
          </nav>

          <button class="rounded-xl bg-[#5e35b1] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#4e2b9a]">
            Support Us
          </button>
        </header>

        <div class="flex flex-1 items-center pb-44 pt-14 lg:pt-8">
          <div class="max-w-[560px]">
            <h1 class="text-[56px] font-black leading-[1.04] tracking-tight text-[#120d42] sm:text-[68px]">
              Empowering Tigray.
              <span class="block text-[#5f35b5]">Inspiring the Future.</span>
            </h1>
            <div class="mt-5 h-[4px] w-[68px] rounded-full bg-[#5f35b5]"></div>

            <p class="mt-5 max-w-[520px] text-[32px] text-base font-medium leading-[1.55] text-[#3f4152]">
              The Tigray Resource Center is dedicated to preserving our heritage, promoting knowledge, and supporting
              sustainable development for a stronger tomorrow.
            </p>

            <div class="mt-6 flex flex-wrap gap-3.5">
              <button class="inline-flex items-center gap-2 rounded-xl bg-[#5e35b1] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#5e35b1]/30 transition hover:bg-[#4d2a99]">
                Explore Resources
                <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M3 10h14M11 4l6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
              <button class="inline-flex items-center gap-2 rounded-xl border border-[#cdcde0] bg-white/85 px-5 py-3.5 text-sm font-semibold text-[#35384a] backdrop-blur transition hover:border-[#5e35b1] hover:text-[#5e35b1]">
                <span class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px]">▶</span>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="pointer-events-none absolute bottom-[92px] left-0 right-0 z-20 h-[96px]">
        <svg class="h-full w-full" viewBox="0 0 1440 160" preserveAspectRatio="none">
          <path fill="#2f1160" d="M0,94 C190,122 345,43 560,52 C801,63 999,133 1204,119 C1324,111 1385,87 1440,73 L1440,160 L0,160 Z" />
        </svg>
      </div>

      <div class="relative z-30 bg-[#2f1160] pb-9 pt-6">
        <div class="mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <article v-for="feature in features" :key="feature.title" class="flex items-start gap-4">
            <div class="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/14 bg-white/10 text-white">
              <component :is="feature.icon" class="h-5 w-5" />
            </div>
            <div>
              <h3 class="text-[24px] text-sm font-bold text-white">{{ feature.title }}</h3>
              <p class="mt-1 text-[13px] leading-5 text-white/75">{{ feature.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { markRaw } from 'vue'

const nav = [
  { label: 'About Us', href: '/about' },
  { label: 'Resources', href: '#' },
  { label: 'News & Updates', href: '/news' },
  { label: 'Events', href: '/events' },
  { label: 'Get Involved', href: '/get-involved' }
]

const features = [
  {
    title: 'Knowledge',
    text: 'Access reliable information and research.',
    icon: markRaw({ template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5c2.5-1.7 5.1-2.5 8-2.5s5.5.8 8 2.5V5.2A14.3 14.3 0 0012 3a14.3 14.3 0 00-8 2.2V19.5z"/><path d="M12 3v14"/></svg>' })
  },
  {
    title: 'Community',
    text: 'Building connections and strengthening unity.',
    icon: markRaw({ template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 19a4 4 0 00-8 0"/><circle cx="12" cy="11" r="3"/><path d="M2.5 19a4 4 0 013.7-3.9"/><path d="M21.5 19a4 4 0 00-3.7-3.9"/></svg>' })
  },
  {
    title: 'Development',
    text: 'Supporting sustainable growth and innovation.',
    icon: markRaw({ template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21v-8"/><path d="M12 13c-4-1.1-6-3.2-6-6 3.5 0 5.6 1.1 6 3.5C12.4 8.1 14.5 7 18 7c0 2.8-2 4.9-6 6z"/></svg>' })
  },
  {
    title: 'Heritage',
    text: 'Preserving our rich history and culture.',
    icon: markRaw({ template: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M4 10h16v11H4z"/><path d="M2 10h20"/><path d="M12 3l8 4H4l8-4z"/></svg>' })
  }
]
</script>

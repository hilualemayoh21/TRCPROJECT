<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { publicApi } from '../services/public.api'
import type { PublicStats, FeaturedResource } from '../services/public.api'
import { useRouter } from 'vue-router'

const router = useRouter()
const isScrolled = ref(false)

const stats = ref<PublicStats | null>(null)
const featured = ref<FeaturedResource[]>([])
const loading = ref(true)

onMounted(async () => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 20
  })

  try {
    const [statsRes, featuredRes] = await Promise.all([
      publicApi.getStats(),
      publicApi.getFeatured()
    ])
    stats.value = statsRes
    featured.value = featuredRes.items
  } catch (err) {
    console.error('Failed to load public data', err)
  } finally {
    loading.value = false
  }
})

const scrollToFeatures = () => {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}

const navLinks = [
  { label: 'About Us', href: '#about' },
  { label: 'Resources', href: '#resources' },
  { label: 'News & Updates', href: '#news' },
  { label: 'Events', href: '#events' },
  { label: 'Get Involved', href: '#involved' },
]

const features = [
  {
    icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
    title: 'Knowledge',
    desc: 'Access reliable information and research.',
  },
  {
    icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
    title: 'Community',
    desc: 'Building connections and strengthening unity.',
  },
  {
    icon: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-1.81 3.37A3.75 3.75 0 0012 18z',
    title: 'Development',
    desc: 'Supporting sustainable growth and innovation.',
  },
  {
    icon: 'M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z',
    title: 'Heritage',
    desc: 'Preserving our rich history and culture.',
  },
]
</script>

<template>
  <div class="min-h-screen bg-white font-sans">
    <!-- Navbar -->
    <nav
      class="fixed top-0 left-0 right-0 z-50 bg-white/80 shadow-sm backdrop-blur-md transition-all duration-300"
      :class="isScrolled ? 'shadow-md' : ''"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#7c3aed] to-[#6d28d9]">
            <svg class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L4 14h16L12 3zm0 3l4.5 7h-9L12 6z"/>
            </svg>
          </div>
          <div class="leading-tight">
            <div class="text-base font-black tracking-wider text-gray-900">TIGRAY</div>
            <div class="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-trc">Resource Center</div>
          </div>
        </div>

        <!-- Nav Links -->
        <div class="hidden lg:flex items-center gap-8">
          <a
            v-for="link in navLinks"
            :key="link.label"
            :href="link.href"
            class="text-sm font-semibold text-gray-600 transition-colors hover:text-trc"
          >
            {{ link.label }}
          </a>
        </div>

        <!-- Support Button -->
        <button
          class="hidden md:inline-flex items-center rounded-lg bg-trc px-5 py-2.5 text-sm font-bold text-white shadow-trc-btn transition-all hover:bg-trc-dark hover:shadow-trc-btn-hover active:scale-95"
        >
          Support Us
        </button>

        <!-- Mobile menu button -->
        <button class="lg:hidden p-2 text-gray-700">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative flex min-h-screen items-center overflow-hidden">
      <!-- Full-width hero image background -->
      <div class="absolute inset-0">
        <div
          class="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style="background-image: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80&auto=format');"
        />
        <!-- Purple-pink sunset color cast over entire image -->
        <div class="absolute inset-0 bg-gradient-to-br from-fuchsia-300/40 via-purple-300/30 to-indigo-400/40 mix-blend-multiply" />
        <!-- Left-to-right white gradient so text is readable on left -->
        <div class="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        <!-- Bottom fade to blend with wave -->
        <div class="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
        <!-- Chevron pattern overlay in upper left -->
        <div class="absolute inset-0 opacity-[0.06]" style="background-image: url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%236C2BD9\' fill-opacity=\'1\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M0 20L20 0l20 20-20 20L0 20zm4 0l16 16 16-16L20 4 4 20z\'/%3E%3C/g%3E%3C/svg%3E'); background-position: top left;" />
      </div>

      <!-- Content -->
      <div class="relative z-10 mx-auto max-w-7xl px-6 pt-36 pb-44 lg:px-8">
        <div class="max-w-xl">
          <h1 class="text-5xl font-black leading-[1.1] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Empowering Tigray.
            <span class="mt-2 block text-trc">Inspiring the Future.</span>
          </h1>

          <!-- Purple underline -->
          <div class="mt-4 h-1 w-24 rounded-full bg-trc" />

          <p class="mt-6 text-lg leading-relaxed text-gray-600">
            The Tigray Resource Center is dedicated to preserving our heritage, promoting knowledge, and supporting sustainable development for a stronger tomorrow.
          </p>

          <!-- CTAs -->
          <div class="mt-8 flex flex-wrap items-center gap-4">
            <button
              class="inline-flex items-center gap-2 rounded-lg bg-trc px-6 py-3 text-sm font-bold text-white shadow-trc-btn transition-all hover:bg-trc-dark hover:shadow-trc-btn-hover active:scale-95"
              @click="router.push('/dashboard')"
            >
              Explore Resources
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>

            <button
              @click="scrollToFeatures"
              class="inline-flex items-center gap-2 rounded-lg border border-gray-400/50 bg-white/50 backdrop-blur-sm px-6 py-3 text-sm font-bold text-gray-800 transition-all hover:border-trc hover:text-trc active:scale-95"
            >
              <svg class="h-5 w-5 text-trc" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
              Learn More
            </button>
          </div>
        </div>
      </div>

      <!-- Wave Divider -->
      <div class="absolute bottom-0 left-0 right-0 leading-none">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full" preserveAspectRatio="none">
          <path d="M0 120V90C240 90 480 70 720 75C960 80 1200 95 1440 95V120H0Z" fill="#1e0a45"/>
        </svg>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="relative bg-[#1e0a45] pt-16 pb-24 lg:pt-20 lg:pb-28">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Knowledge -->
          <div class="group flex items-start gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition-all group-hover:scale-110">
              <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">Knowledge</h3>
              <p class="mt-1 text-sm leading-relaxed text-purple-200/60">Access reliable information and research.</p>
            </div>
          </div>

          <!-- Community -->
          <div class="group flex items-start gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition-all group-hover:scale-110">
              <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">Community</h3>
              <p class="mt-1 text-sm leading-relaxed text-purple-200/60">Building connections and strengthening unity.</p>
            </div>
          </div>

          <!-- Development -->
          <div class="group flex items-start gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition-all group-hover:scale-110">
              <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 22V10m0 0c-3-2-6-1-6 2s3 4 6 2zm0 0c3-2 6-1 6 2s-3 4-6 2" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">Development</h3>
              <p class="mt-1 text-sm leading-relaxed text-purple-200/60">Supporting sustainable growth and innovation.</p>
            </div>
          </div>

          <!-- Heritage -->
          <div class="group flex items-start gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition-all group-hover:scale-110">
              <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-white">Heritage</h3>
              <p class="mt-1 text-sm leading-relaxed text-purple-200/60">Preserving our rich history and culture.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats & Featured Section -->
    <section v-if="!loading && stats" class="relative bg-slate-50 py-24">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <!-- Live Stats -->
        <div class="grid gap-8 sm:grid-cols-3 mb-24">
          <div class="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100 text-center transition-all hover:-translate-y-1 hover:shadow-md">
            <div class="text-5xl font-black text-trc mb-2">{{ stats.totalResources.toLocaleString() }}</div>
            <div class="text-sm font-bold uppercase tracking-widest text-slate-400">Total Resources</div>
          </div>
          <div class="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100 text-center transition-all hover:-translate-y-1 hover:shadow-md">
            <div class="text-5xl font-black text-trc mb-2">{{ stats.totalCategories.toLocaleString() }}</div>
            <div class="text-sm font-bold uppercase tracking-widest text-slate-400">Categories</div>
          </div>
          <div class="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-100 text-center transition-all hover:-translate-y-1 hover:shadow-md">
            <div class="text-5xl font-black text-trc mb-2">{{ stats.totalDownloads.toLocaleString() }}</div>
            <div class="text-sm font-bold uppercase tracking-widest text-slate-400">Downloads</div>
          </div>
        </div>

        <!-- Featured Resources -->
        <div v-if="featured.length > 0">
          <div class="mb-12 flex items-end justify-between">
            <div>
              <h2 class="text-3xl font-black tracking-tight text-gray-900">Featured Resources</h2>
              <p class="mt-2 text-gray-500">Discover the highest-rated materials in our catalog.</p>
            </div>
            <button @click="router.push('/dashboard')" class="hidden md:inline-flex items-center gap-2 text-sm font-bold text-trc hover:text-trc-dark">
              View all
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>

          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <article v-for="item in featured" :key="item.id" class="group relative flex flex-col items-start justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-lg">
              <div class="flex items-center gap-x-4 text-xs mb-4">
                <span class="text-gray-500">{{ item.viewCount }} views</span>
                <span class="relative z-10 rounded-full bg-slate-50 px-3 py-1.5 font-bold text-slate-600">{{ item.category?.name || 'General' }}</span>
              </div>
              <div class="group relative">
                <h3 class="mt-3 text-lg font-black leading-6 text-gray-900 group-hover:text-trc">
                  <a href="#">
                    <span class="absolute inset-0"></span>
                    {{ item.title }}
                  </a>
                </h3>
                <p class="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{{ item.description }}</p>
              </div>
              <div class="relative mt-6 flex items-center gap-x-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-trc/10 text-trc font-bold uppercase">
                  {{ item.author.name.charAt(0) }}
                </div>
                <div class="text-sm leading-6">
                  <p class="font-bold text-gray-900">{{ item.author.name }}</p>
                  <p class="text-gray-500">{{ item.author.institution || 'Tigray Resource Center' }}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-[#1a0a3d] py-8">
      <div class="mx-auto max-w-7xl px-6 text-center text-xs text-purple-300/50 lg:px-8">
        &copy; {{ new Date().getFullYear() }} Tigray Resource Center. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<template>
  <div class="min-h-screen bg-white font-sans">

    <!-- Hero Section (Synced with Landing Page Design) -->
    <section class="relative h-[65vh] flex items-center overflow-hidden pt-20">
      <!-- Background Effect -->
      <div class="absolute inset-0 z-0 bg-[#1a0b2e]">
        <div class="absolute inset-0" style="background-image: radial-gradient(ellipse at 60% 50%, #5e35b1 0%, transparent 75%), radial-gradient(ellipse at 20% 80%, #1a0b2e 0%, transparent 60%); opacity: 0.6;"></div>
        <div class="absolute inset-0" style="background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 48px 48px;"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 mx-auto max-w-7xl px-6 w-full text-center">
        <div class="max-w-4xl mx-auto animate-fade-up">
          <span class="inline-block px-5 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-[0.3em] text-purple-300 mb-8">News & Updates</span>
          <h1 class="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter">
            Stay<br/><span class="text-[#b68eff]">Informed.</span>
          </h1>
          <p class="mt-8 text-xl text-white/60 max-w-2xl mx-auto font-medium mb-12">
            The latest announcements, research publications, and community stories from the Tigray Resource Center.
          </p>
          
          <!-- Category Filter -->
          <div class="flex flex-wrap justify-center gap-4">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="activeCategory = cat"
              class="px-8 py-3.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300"
              :class="activeCategory === cat ? 'bg-[#5e35b1] text-white shadow-xl shadow-[#5e35b1]/40' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10'"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Article -->
    <section class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-xs font-black uppercase tracking-[0.3em] text-[#5e35b1] mb-4">Featured Story</h2>
        <div class="group bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          <!-- Image placeholder -->
          <div class="h-72 lg:h-auto bg-gradient-to-br from-[#1a0b2e] to-[#5e35b1] flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0" style="background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 32px 32px;"></div>
            <div class="relative z-10 text-center p-12">
              <div class="text-8xl mb-6 opacity-90">📰</div>
            </div>
          </div>
          <!-- Content -->
          <div class="p-10 lg:p-16 flex flex-col justify-center">
            <span class="inline-flex px-4 py-1.5 rounded-full bg-purple-50 text-[#5e35b1] text-xs font-black uppercase tracking-wider mb-6">Press Release</span>
            <h2 class="text-3xl lg:text-4xl font-black text-gray-900 mb-6 tracking-tight group-hover:text-[#5e35b1] transition-colors leading-snug">
              Launch of the New TRC Digital Archive Platform
            </h2>
            <p class="text-gray-500 font-medium leading-relaxed text-lg mb-8">
              We are thrilled to announce the launch of our expanded digital archive, providing unprecedented access to thousands of historical documents and cultural artefacts of Tigray.
            </p>
            <div class="flex items-center gap-4 mb-10">
              <div class="w-10 h-10 rounded-xl bg-[#5e35b1] flex items-center justify-center text-white font-black text-sm uppercase">A</div>
              <div>
                <p class="text-sm font-black text-gray-900 leading-none mb-1">TRC Admin</p>
                <p class="text-xs text-gray-400 font-medium tracking-wide">Mar 16, 2024 · 6 min read</p>
              </div>
            </div>
            <a href="#" class="inline-flex items-center gap-3 px-10 py-4 bg-[#5e35b1] text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl shadow-[#5e35b1]/30 hover:bg-[#512da8] hover:-translate-y-0.5 transition-all w-fit">
              Read Full Story →
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Article Grid -->
    <section class="pb-32 bg-gray-50">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-xs font-black uppercase tracking-[0.3em] text-[#5e35b1] mb-4">Latest Articles</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="article in filteredArticles"
            :key="article.id"
            class="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col"
          >
            <!-- Card Header -->
            <div class="h-52 flex items-center justify-center text-6xl relative overflow-hidden"
              :style="`background: linear-gradient(135deg, ${article.color1}, ${article.color2})`"
            >
              <div class="absolute inset-0" style="background-image: linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px); background-size: 24px 24px;"></div>
              <span class="relative z-10">{{ article.emoji }}</span>
            </div>
            <!-- Card Body -->
            <div class="p-8 flex flex-col flex-1">
              <span class="inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4" :class="article.tagClass">{{ article.category }}</span>
              <h3 class="text-xl font-black text-gray-900 mb-3 group-hover:text-[#5e35b1] transition-colors tracking-tight leading-snug">{{ article.title }}</h3>
              <p class="text-gray-500 text-sm font-medium leading-relaxed mb-6 flex-1">{{ article.excerpt }}</p>
              <div class="flex items-center justify-between pt-6 border-t border-gray-50">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs uppercase" :style="`background: ${article.color1}`">
                    {{ article.author[0] }}
                  </div>
                  <div>
                    <p class="text-xs font-black text-gray-900">{{ article.author }}</p>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wide">{{ article.date }}</p>
                  </div>
                </div>
                <a href="#" class="w-10 h-10 rounded-2xl bg-gray-50 group-hover:bg-[#5e35b1] flex items-center justify-center transition-colors">
                  <svg class="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M9 5l7 7-7 7"/></svg>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Final CTA Section (Synced with Landing Page) -->
    <section class="py-32 bg-[#5e35b1] relative overflow-hidden text-center">
      <div class="absolute inset-0" style="background-image: radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 60%);"></div>
      <div class="relative z-10 max-w-3xl mx-auto px-6">
        <h2 class="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">Never Miss an Update</h2>
        <p class="text-xl text-white/50 mb-12 font-medium">Subscribe to the TRC newsletter for direct updates in your inbox.</p>
        <form class="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" @submit.prevent="handleSubscribe">
          <input
            v-model="email"
            type="email"
            placeholder="Your email address..."
            required
            class="flex-1 px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 font-medium"
          />
          <button 
            type="submit" 
            :disabled="loading"
            class="px-10 py-4 bg-white text-[#5e35b1] rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-gray-100 transition-all shadow-xl whitespace-nowrap disabled:opacity-50"
          >
            {{ loading ? '...' : 'Subscribe →' }}
          </button>
        </form>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

const categories = ['All', 'Press Release', 'Community', 'Development', 'Heritage']
const activeCategory = ref('All')

const articles = [
  {
    id: 1, emoji: '🏛️', color1: '#5e35b1', color2: '#1a0b2e',
    category: 'Press Release', tagClass: 'bg-purple-50 text-purple-700',
    title: 'Launch of the New Digital Archive',
    excerpt: 'We are thrilled to announce unprecedented access to thousands of historical records and cultural documents.',
    author: 'Admin', date: 'Mar 16, 2024', readTime: '6 min', cat: 'Press Release'
  },
  {
    id: 2, emoji: '🤝', color1: '#0ea5e9', color2: '#0369a1',
    category: 'Community', tagClass: 'bg-blue-50 text-blue-700',
    title: 'Upcoming Symposium on Heritage',
    excerpt: 'Join experts and community leaders as we discuss the ongoing efforts to preserve cultural landmarks.',
    author: 'Sarah Gebre', date: 'Feb 20, 2024', readTime: '4 min', cat: 'Community'
  },
  {
    id: 3, emoji: '📊', color1: '#16a34a', color2: '#14532d',
    category: 'Development', tagClass: 'bg-green-50 text-green-700',
    title: 'Annual Progress Report Published',
    excerpt: 'Read our comprehensive review of initiatives and projects completed over the past year.',
    author: 'Comms Team', date: 'Jan 15, 2024', readTime: '11 min', cat: 'Development'
  },
  {
    id: 4, emoji: '📜', color1: '#d97706', color2: '#92400e',
    category: 'Heritage', tagClass: 'bg-amber-50 text-amber-700',
    title: 'Ancient Manuscripts Digitized',
    excerpt: 'A landmark achievement as over 500 ancient Ge\'ez manuscripts are now accessible online.',
    author: 'Archive Team', date: 'Dec 10, 2023', readTime: '8 min', cat: 'Heritage'
  },
  {
    id: 5, emoji: '🌍', color1: '#0891b2', color2: '#164e63',
    category: 'Community', tagClass: 'bg-blue-50 text-blue-700',
    title: 'International Diaspora Day Celebration',
    excerpt: 'Communities across four continents gathered virtually to celebrate Tigray\'s cultural diversity.',
    author: 'Events Team', date: 'Nov 5, 2023', readTime: '5 min', cat: 'Community'
  },
  {
    id: 6, emoji: '⚡', color1: '#7c3aed', color2: '#4c1d95',
    category: 'Development', tagClass: 'bg-green-50 text-green-700',
    title: 'Solar Initiative Expands to 10 Communities',
    excerpt: 'Our sustainable energy program now powers ten community centers across the Tigray region.',
    author: 'TRC Admin', date: 'Oct 22, 2023', readTime: '7 min', cat: 'Development'
  },
]

const filteredArticles = computed(() => {
  if (activeCategory.value === 'All') return articles
  return articles.filter(a => a.cat === activeCategory.value)
})
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

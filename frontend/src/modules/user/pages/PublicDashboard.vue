<template>
  <DashboardLayout>
    <div class="animate-fade-in flex flex-col gap-12 pb-28 md:pb-20">
      
      <!-- ── ELEVATED HERO SECTION (Polished & Balanced Height) ── -->
      <section class="relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] bg-[#2D0A63] min-h-[340px] md:min-h-[380px] lg:min-h-[420px] flex items-center px-6 md:px-14 lg:px-16 py-8 md:py-12 lg:py-14 text-white shadow-2xl shadow-trc/30">
        <!-- Mesh Gradient Overlay -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_-20%,#7C3AED,transparent_50%),radial-gradient(circle_at_0%_120%,#4F46E5,transparent_50%)] opacity-60"></div>
        <div class="absolute inset-0 bg-black/20"></div>
        
        <div class="relative z-10 max-w-3xl">
          <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-md border border-white/10 mb-8">
             <span class="h-2 w-2 rounded-full bg-trc animate-pulse"></span>
             <span class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-white/80">Active Preservation Live</span>
          </div>
          <h1 class="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-[3.8rem] font-black leading-[1.1] tracking-tight">Explore the <br/><span class="text-trc">Digital Heritage</span> of Tigray.</h1>
          <p class="mb-10 text-base md:text-[1.15rem] font-medium text-white/70 leading-relaxed max-w-xl">Access verified manuscripts, scientific research, and cultural archives preserved through secure decentralized technology.</p>
          
          <!-- Large Search Interface -->
          <div class="flex flex-col gap-6">
            <div class="relative group max-w-2xl">
              <SearchOutlined 
                class="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 text-xl group-focus-within:text-trc transition-colors cursor-pointer" 
                @click="navigateToSearch"
              />
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search by title, author, or keyword..." 
                @keyup.enter="navigateToSearch"
                class="w-full rounded-2xl md:rounded-[1.5rem] bg-white border-none py-4 md:py-6 pl-12 md:pl-16 pr-8 text-[1rem] md:text-[1.1rem] font-bold text-gray-900 shadow-2xl transition-all focus:ring-4 focus:ring-trc/30" 
              />
            </div>
            
            <!-- Trending Tags -->
            <div class="flex items-center gap-3">
               <span class="text-[0.7rem] font-black uppercase tracking-widest text-white/40">Trending:</span>
               <div class="flex gap-2">
                  <button v-for="tag in ['#Axum', '#HistoricalGe\'ez', '#AgriculturalData']" :key="tag" class="rounded-full bg-white/5 border border-white/5 px-4 py-1.5 text-[0.7rem] font-black text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-pointer">
                    {{ tag }}
                  </button>
               </div>
            </div>
          </div>
        </div>
        
        <!-- Background Asset (Abstract Architecture) -->
        <div class="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none hidden lg:block">
           <svg class="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,100 C30,80 70,80 100,100 L100,0 L0,0 Z" fill="white" fill-opacity="0.05" />
           </svg>
        </div>
      </section>

      <!-- ── DISCOVER BY CATEGORY BAR ── -->
      <section class="relative">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-2">
            <h3 class="text-xs md:text-sm font-black uppercase tracking-[0.25em] text-gray-400">Discover by Category</h3>
            <button class="text-[0.6rem] md:text-[0.7rem] font-black uppercase tracking-widest text-trc hover:opacity-70 transition text-left sm:text-right">Explore All Categories</button>
        </div>
        
        <!-- Definitive Scrollbar Clipping: Wrapper limits height to cards, Scroller is taller -->
        <div class="relative overflow-hidden h-[125px] w-full">
          <div 
            ref="scrollerRef"
            @mousedown="handleMouseDown"
            @scroll="handleScroll"
            class="category-scroller flex w-full gap-5 overflow-x-auto h-[160px] cursor-grab active:cursor-grabbing select-none scroll-smooth pr-10"
          >
             <div 
               v-for="cat in categories" 
               :key="cat.name" 
               @click="handleCategoryClick($event, cat)"
               draggable="false"
               class="category-card flex items-center gap-4 shrink-0 rounded-3xl bg-white p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:border-trc/20 transition-all group whitespace-nowrap cursor-pointer select-none"
             >
                <div :class="cat.bg" class="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md transition-transform group-hover:scale-110 pointer-events-none">
                   <component :is="cat.icon" style="font-size: 20px" />
                </div>
                <div class="flex flex-col pr-6 pointer-events-none">
                   <span class="text-[0.9rem] font-black text-gray-900 tracking-tight">{{ cat.name }}</span>
                   <span class="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">{{ cat.count }} items</span>
                </div>
             </div>
             <!-- Extra padding item to ensure the last card can be centered -->
             <div class="w-20 shrink-0 h-full pointer-events-none"></div>
          </div>
        </div>
      </section>

      <!-- ── FULL-WIDTH FEATURED GALLERY (Maximizing Card Size) ── -->
      <section class="flex flex-col gap-10">
         <div class="flex items-center justify-between px-4 pb-2">
            <h2 class="text-3xl font-black text-gray-900 tracking-tight">Featured Resources</h2>
            <div class="hidden sm:flex items-center gap-4">
               <a-button type="text" class="text-[0.7rem] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-trc transition-colors">Filter By Category</a-button>
               <a-button type="text" class="text-[0.7rem] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-trc transition-colors">Layout Style</a-button>
            </div>
         </div>

         <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="res in resources.slice(0, 3)" :key="res.id" class="flex flex-col rounded-[2rem] bg-white p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all group overflow-hidden relative">
               <!-- Hover Overlay Background -->
               <div class="absolute inset-0 bg-gradient-to-br from-trc/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
               
               <!-- Balanced Compact Thumbnail -->
               <div class="relative mb-5 w-full aspect-square max-h-[260px] overflow-hidden rounded-[1.5rem] bg-gray-50 border border-gray-50 shadow-inner">
                  <div v-if="res.image" :style="{ backgroundImage: `url(${res.image})` }" class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                  <!-- Overlay Badges -->
                  <div class="absolute inset-x-4 top-4 flex items-center justify-between">
                     <span class="rounded-lg bg-black/30 backdrop-blur-md px-3 py-1.5 text-[0.55rem] font-black uppercase text-white tracking-widest border border-white/10">
                        {{ res.category }}
                     </span>
                     <div v-if="res.verified" class="flex h-8 w-8 items-center justify-center rounded-xl bg-white/30 backdrop-blur-md text-white border border-white/10">
                        <VerifiedOutlined style="font-size: 14px" />
                     </div>
                  </div>
               </div>

               <div class="relative z-10 flex flex-1 flex-col px-1">
                  <h3 class="text-[1.05rem] font-black text-gray-900 mb-2 leading-tight group-hover:text-trc transition-colors tracking-tight line-clamp-1">{{ res.title }}</h3>
                  <p class="mb-6 text-[0.8rem] font-medium text-gray-400 leading-relaxed line-clamp-2">{{ res.description }}</p>
                  
                  <div class="mt-auto flex flex-col gap-5">
                      <!-- Compact Stats (Now Interactive) -->
                      <div class="flex items-center justify-between text-[0.55rem] font-black uppercase tracking-[0.1em] text-gray-300">
                         <a-popover trigger="click" placement="top">
                            <template #content>
                               <div class="flex flex-col gap-2 p-1">
                                  <span class="text-[0.6rem] font-black uppercase text-gray-400">Rate this Resource</span>
                                  <div class="flex gap-1.5">
                                     <button v-for="i in 5" :key="i" @click="handleRate(res, i)" class="hover:scale-125 transition-transform">
                                        <StarFilled v-if="i <= Math.round(res.rating)" class="text-yellow-400" />
                                        <StarOutlined v-else class="text-gray-200" />
                                     </button>
                                  </div>
                               </div>
                            </template>
                            <div class="flex items-center gap-1.5 cursor-pointer hover:bg-gray-50 rounded-lg px-1 py-0.5 transition-colors group/rate">
                               <StarFilled class="text-yellow-400 text-[9px]" />
                               <span class="text-gray-900 font-black">{{ res.rating.toFixed(1) }}</span>
                               <span class="opacity-30">({{ res.reviews }})</span>
                            </div>
                         </a-popover>
                         <div class="flex items-center gap-1 group-hover:text-trc transition-colors">
                            <BankOutlined class="text-[9px]" /> DIGITAL VAULT
                         </div>
                      </div>

                      <div class="flex items-center gap-2.5 pt-2">
                         <button @click="handleRead(res)" class="flex-1 rounded-xl bg-[#F8F6FF] py-3 text-[0.65rem] font-black uppercase tracking-widest text-trc hover:bg-trc hover:text-white transition-all">Explore</button>
                         <button 
                           @click="handleDownload(res)" 
                           :disabled="downloadingId === res.id"
                           class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm border border-gray-100 hover:text-trc transition-all active:scale-95 shrink-0 disabled:opacity-50"
                         >
                            <LoadingOutlined v-if="downloadingId === res.id" style="font-size: 16px" />
                            <DownloadOutlined v-else style="font-size: 16px" />
                         </button>
                      </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <!-- ── SECONDARY CONTENT ROW (Trending & Community) ── -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4 pb-10">
         
         <!-- Trending Sidebar (Aligned and Polished) -->
         <div class="lg:col-span-12 xl:col-span-8 flex flex-col gap-10">
            <div class="rounded-[3rem] bg-white p-12 shadow-sm border border-gray-100/60 overflow-hidden relative">
               <div class="flex items-center justify-between mb-12 px-2">
                  <h3 class="text-3xl font-black text-gray-900 tracking-tight">Trending Archives</h3>
                  <button class="text-[0.75rem] font-black uppercase tracking-[0.2em] text-trc hover:opacity-70 transition border-b-2 border-trc/20 hover:border-trc/60 pb-1">Archive Leaderboard</button>
               </div>
               
               <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div v-for="(item, idx) in trendingItems" :key="item.title" class="flex gap-6 group cursor-pointer p-6 rounded-[2rem] bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                     <div class="flex flex-col items-center justify-center h-16 w-16 shrink-0 rounded-3xl bg-white shadow-sm font-black text-2xl text-gray-200 group-hover:text-trc transition-transform group-hover:-rotate-6 italic">
                        {{ idx + 1 }}
                     </div>
                     <div class="flex flex-col justify-center gap-1.5 flex-1 min-w-0">
                        <h4 class="text-[0.95rem] font-black text-gray-800 leading-tight group-hover:text-trc transition-colors line-clamp-2">{{ item.title }}</h4>
                        <div class="flex flex-col items-start gap-1">
                           <span class="text-[0.55rem] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{{ item.views }} Views</span>
                           <span class="text-[0.55rem] font-black uppercase tracking-widest text-[#10B981]">{{ item.impact }}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <!-- Contribution CTA (Premium Centered Design) -->
         <div class="lg:col-span-12 xl:col-span-4 flex flex-col h-full">
            <div class="rounded-[3rem] bg-gradient-to-br from-[#6C2BD9] to-[#4F46E5] p-10 text-white relative overflow-hidden shadow-2xl shadow-trc/30 flex-1 flex flex-col items-center justify-center text-center min-h-[420px]">
               <!-- Background Decoration (Glass Bubbles) -->
               <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/5 blur-3xl"></div>
               <div class="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-trc/10 blur-3xl"></div>
               
               <div class="relative z-10 w-full flex flex-col items-center">
                  <div class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
                     <RocketOutlined style="font-size: 28px; color: white" />
                  </div>
                  
                  <h4 class="text-[1.5rem] font-black mb-4 leading-tight tracking-tight">Preserve Your <br/>Digital History</h4>
                  <p class="text-[0.95rem] font-medium text-white/70 leading-relaxed mb-10 max-w-[260px]">Join our mission to secure Tigray's historical archives on the blockchain.</p>
                  
                  <button @click="() => {}" class="group relative w-full max-w-[220px] overflow-hidden rounded-2xl bg-white py-4 text-[0.75rem] font-black uppercase tracking-[0.2em] text-trc shadow-2xl transition-all hover:scale-105 active:scale-95">
                     <span class="relative z-10">Become a Curator</span>
                     <div class="absolute inset-0 translate-y-full bg-trc/5 transition-transform group-hover:translate-y-0"></div>
                  </button>
                  
                  <p class="mt-6 text-[0.6rem] font-bold uppercase tracking-widest text-white/40">Verified Researchers Only</p>
               </div>
            </div>
         </div>
      </div>

    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { 
  SearchOutlined, 
  LeftOutlined, 
  RightOutlined, 
  FileTextOutlined, 
  StarFilled, 
  StarOutlined,
  DownloadOutlined,
  RocketOutlined,
  VerifiedOutlined,
  BankOutlined,
  TranslationOutlined,
  ExperimentOutlined,
  EnvironmentOutlined,
  LoadingOutlined
} from '@ant-design/icons-vue'
import { useResources } from '@/modules/resource/composables/useResources'

const router = useRouter()
const { resources, downloadingId, handleRead, handleDownload, handleRate } = useResources()

const searchQuery = ref('')

const categories = [
  { name: 'History & Heritage', count: '14.2k', icon: BankOutlined, bg: 'bg-[#7C3AED]' },
  { name: 'Linguistics', count: '8.4k', icon: TranslationOutlined, bg: 'bg-[#6366F1]' },
  { name: 'Science & Data', count: '12.1k', icon: ExperimentOutlined, bg: 'bg-[#8B5CF6]' },
  { name: 'Geopolitics', count: '5.2k', icon: EnvironmentOutlined, bg: 'bg-[#A78BFA]' },
  { name: 'Archeology', count: '3.1k', icon: BankOutlined, bg: 'bg-[#C026D3]' },
  { name: 'Arts & Culture', count: '9.5k', icon: TranslationOutlined, bg: 'bg-[#DB2777]' },
  { name: 'Economic Data', count: '6.7k', icon: ExperimentOutlined, bg: 'bg-[#EA580C]' },
]

const trendingItems = [
  { title: 'Historical Resilience of Ge\'ez Liturgy', views: '12.4k', impact: 'Institutional Choice' },
  { title: 'Geothermal Potential Assessment 2024', views: '9.8k', impact: 'Policy Maker Favorite' },
  { title: 'Aksumite Numismatic Digital Database', views: '8.2k', impact: 'Top Discovery' },
]

const navigateToSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'ResourceSearch', query: { q: searchQuery.value } })
  } else {
    router.push({ name: 'ResourceSearch' })
  }
}

// --- REFINED DRAG TO SCROLL LOGIC ---
const scrollerRef = ref<HTMLElement | null>(null)
const isDown = ref(false)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeftStart = ref(0)
const isScrolling = ref(false)
let scrollTimeout: any = null

const handleMouseDown = (e: MouseEvent) => {
  if (!scrollerRef.value) return
  isDown.value = true
  isDragging.value = false
  startX.value = e.pageX - scrollerRef.value.offsetLeft
  scrollLeftStart.value = scrollerRef.value.scrollLeft
  
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDown.value || !scrollerRef.value) return
  
  const x = e.pageX - scrollerRef.value.offsetLeft
  const walk = (x - startX.value) * 2 // multiplier for speed
  
  if (Math.abs(x - startX.value) > 5) {
    isDragging.value = true
  }
  
  if (isDragging.value) {
    e.preventDefault() // Prevent selection
    scrollerRef.value.scrollLeft = scrollLeftStart.value - walk
  }
}

const handleMouseUp = () => {
  isDown.value = false
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
  
  // Reset isDragging after a tiny delay to allow the 'click' event to see it
  setTimeout(() => {
    isDragging.value = false
  }, 10)
}

const handleCategoryClick = (e: MouseEvent, cat: any) => {
  if (isDragging.value) {
    e.preventDefault()
    e.stopPropagation()
    return
  }
  
  // Scroll clicked element to center
  const target = e.currentTarget as HTMLElement
  if (scrollerRef.value && target) {
    const scrollerWidth = scrollerRef.value.offsetWidth
    const cardOffset = target.offsetLeft
    const cardWidth = target.offsetWidth
    
    scrollerRef.value.scrollTo({
      left: cardOffset - (scrollerWidth / 2) + (cardWidth / 2),
      behavior: 'smooth'
    })
  }
  
  console.log(`Category selected: ${cat.name}`)
}

const handleScroll = () => {
  isScrolling.value = true
  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    isScrolling.value = false
  }, 1000)
}

onUnmounted(() => {
  if (scrollTimeout) clearTimeout(scrollTimeout)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<style scoped>
/* High Fidelity Scrollbar: Permanently hidden for a clean tablet-like experience */
.category-scroller::-webkit-scrollbar {
  display: none;
}

.category-scroller {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;    /* Firefox */
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>



<template>
  <div class="animate-fade-in flex flex-col gap-10 pb-20">
    
    <!-- ── PREMIUM SEARCH HERO (STABILIZED) ── -->
    <section class="relative overflow-hidden rounded-[3rem] bg-[#2D0A63] p-10 md:p-14 text-white shadow-2xl shadow-trc/20 transition-all duration-700">
       <div class="animate-mesh absolute inset-0 bg-[radial-gradient(circle_at_70%_-20%,#7C3AED,transparent_50%),radial-gradient(circle_at_0%_120%,#4F46E5,transparent_50%)] opacity-40"></div>
       
       <div class="relative z-10 flex flex-col gap-10">
          <div class="max-w-2xl">
             <div class="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-md border border-white/10 mb-8">
                <div class="flex h-2 w-2 rounded-full bg-trc animate-pulse"></div>
                <span class="text-[0.6rem] font-black uppercase tracking-[0.25em] text-white/80">Neural Archive Indexing</span>
             </div>
             <h1 class="text-4xl md:text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">Archive Explorer.</h1>
             <p class="text-sm md:text-lg font-medium text-white/50 max-w-xl leading-relaxed">Search through centuries of validated historical, linguistic, and scientific records secured via high-integrity blockchain protocols.</p>
          </div>

          <div class="flex flex-col gap-6">
             <div class="relative group max-w-4xl">
                <SearchOutlined class="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 text-2xl group-focus-within:text-trc transition-colors" />
                <input 
                   v-model="searchQuery"
                   @input="triggerSearch"
                   type="text" 
                   placeholder="Query by title, Ge'ez script, or author..." 
                   class="w-full rounded-[2rem] bg-white/5 backdrop-blur-2xl border border-white/10 py-6 md:py-8 pl-18 md:pl-20 pr-10 text-[1.1rem] md:text-[1.3rem] font-black text-white placeholder:text-white/20 shadow-2xl transition-all focus:ring-8 focus:ring-trc/10 focus:bg-white/10 outline-none" 
                />
             </div>

             <div class="flex flex-wrap items-center gap-3">
                <span class="text-[0.65rem] font-black uppercase tracking-widest text-white/30 mr-3">Quick Filters:</span>
                <button 
                  v-for="chip in ['Verified Only', 'High Impact', 'Peer Reviewed', 'Open Access']" 
                  :key="chip"
                  @click="toggleChip(chip)"
                  :class="[
                    'px-5 py-2 rounded-full text-[0.65rem] font-black uppercase tracking-widest border transition-all',
                    activeChips.includes(chip) ? 'bg-trc border-trc text-white shadow-lg shadow-trc/30' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'
                  ]"
                >
                   {{ chip }}
                </button>
             </div>
          </div>
       </div>
    </section>

    <!-- ── STABILIZED LAYOUT ENGINE ── -->
    <div class="flex flex-col lg:flex-row gap-8">
       
       <!-- LEFT: SIDEBAR (Slimmed for more card space) -->
       <aside class="hidden lg:flex flex-col gap-6 w-full lg:w-[200px] shrink-0">
          <div class="rounded-[2rem] bg-white p-6 border border-gray-100 shadow-sm relative z-10">
             <h3 class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center justify-between">
                Departments
                <span class="h-1.5 w-1.5 rounded-full bg-trc animate-pulse"></span>
             </h3>
             <div class="flex flex-col gap-2">
                <button 
                  v-for="cat in categoryList" 
                  :key="cat.name"
                  @click="activeCategory = activeCategory === cat.name ? '' : cat.name"
                  :class="[
                    'flex items-center justify-between p-3 rounded-2xl font-black text-[0.75rem] transition-all border',
                    activeCategory === cat.name ? 'bg-trc text-white border-trc shadow-lg shadow-trc/20' : 'text-gray-500 bg-white border-transparent hover:border-gray-100 hover:bg-gray-50'
                  ]"
                >
                  <div class="flex items-center gap-3">
                     <div :class="[activeCategory === cat.name ? 'bg-white/20' : 'bg-gray-50']" class="flex h-8 w-8 items-center justify-center rounded-xl transition-all">
                        <component :is="cat.icon" style="font-size: 15px" />
                     </div>
                     <span class="text-[0.72rem]">{{ cat.name }}</span>
                  </div>
                  <span :class="activeCategory === cat.name ? 'bg-white/20' : 'bg-gray-100'" class="px-2 py-1 rounded-lg text-[0.55rem] font-black">{{ getReactiveCount(cat.name) }}</span>
                </button>
             </div>
          </div>

          <div class="rounded-[2rem] bg-white p-6 border border-gray-100 shadow-sm">
             <h3 class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-400 mb-5">Historical Era</h3>
             <div class="space-y-4">
                <div v-for="era in ['Aksumite Period', 'Medieval Era', 'Solomonic Dynasty', 'Modern Times']" :key="era" class="flex items-center gap-3 cursor-pointer group">
                   <div class="h-8 w-1 flex-shrink-0 bg-gray-100 group-hover:bg-trc transition-all rounded-full"></div>
                   <span class="text-[0.72rem] font-black text-gray-700 group-hover:text-trc transition-colors leading-tight">{{ era }}</span>
                </div>
             </div>
          </div>
       </aside>

       <!-- RIGHT: RESULTS (Flex-1) -->
       <main class="flex-1 min-w-0">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 px-2">
             <div class="flex flex-col gap-1.5">
                <div class="flex items-center gap-3">
                   <h2 class="text-3xl font-black text-gray-900 tracking-tight">Curation Results</h2>
                </div>
                <p class="text-[0.85rem] font-medium text-gray-400">Showing active nodes from {{ resources.length }} historical records.</p>
             </div>
          </div>

          <!-- SKELETON STATE -->
          <div v-if="isSearching" class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
             <div v-for="i in 6" :key="i" class="flex flex-col rounded-[3rem] bg-white p-6 shadow-sm border border-gray-50 animate-pulse">
                <div class="w-full aspect-square bg-gray-50 rounded-[2.5rem] mb-6"></div>
                <div class="h-6 w-3/4 bg-gray-50 rounded-full mb-4"></div>
                <div class="h-4 w-full bg-gray-50 rounded-full mb-8"></div>
                <div class="mt-auto flex gap-4">
                   <div class="h-14 flex-1 bg-gray-50 rounded-2xl"></div>
                   <div class="h-14 w-14 bg-gray-50 rounded-2xl"></div>
                </div>
             </div>
          </div>

          <!-- ACTIVE GRID -->
          <div v-else-if="filteredResults.length > 0" class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
             <div 
               v-for="(res, idx) in filteredResults" 
               :key="res.id" 
               class="reveal-item flex flex-col rounded-[3rem] bg-white p-6 shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group overflow-hidden relative"
               :style="{ animationDelay: `${idx * 80}ms` }"
             >
                <div class="absolute inset-0 bg-gradient-to-br from-trc/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                
                <!-- Square image: looks great at wider card sizes -->
                <div class="relative mb-6 aspect-square w-full overflow-hidden rounded-[2.2rem] bg-gray-50 border border-gray-100 shadow-inner group-hover:rounded-[1.8rem] transition-all duration-700">
                   <div v-if="res.image" :style="{ backgroundImage: `url(${res.image})` }" class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                   
                   <div class="absolute inset-x-5 top-5 flex items-center justify-between gap-2">
                      <div class="flex flex-col gap-2">
                         <span class="rounded-xl bg-black/40 backdrop-blur-xl px-4 py-2 text-[0.6rem] font-black uppercase text-white tracking-widest border border-white/10">
                            {{ res.category }}
                         </span>
                         <span class="rounded-xl bg-trc/80 backdrop-blur-xl px-3 py-1.5 text-[0.55rem] font-black uppercase text-white tracking-[0.2em] border border-white/10 w-fit">
                            {{ res.date.split(' ')[1] }}
                         </span>
                      </div>
                      <div v-if="res.verified" class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/40 backdrop-blur-xl text-white border border-white/10 shadow-2xl">
                         <VerifiedOutlined style="font-size: 20px" />
                      </div>
                   </div>

                   <div class="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/80 to-transparent">
                      <span class="text-[0.65rem] font-black text-white uppercase tracking-widest">Main Curator:</span>
                      <p class="text-white font-bold text-sm">{{ res.authors[0] }}</p>
                   </div>
                </div>

                <!-- Explicit Content Area -->
                <div class="relative z-10 flex flex-1 flex-col px-3">
                   <h3 class="text-[1.15rem] font-black text-gray-900 mb-2 leading-tight group-hover:text-trc transition-colors tracking-tight line-clamp-1 italic">{{ res.title }}</h3>
                   <p class="mb-8 text-[0.85rem] font-medium text-gray-400 leading-relaxed line-clamp-2">{{ res.description }}</p>
                   
                   <div class="mt-auto flex flex-col gap-6">
                      <div class="flex items-center justify-between text-[0.65rem] font-black uppercase tracking-[0.1em] text-gray-300">
                         <a-popover trigger="click" placement="top">
                            <template #content>
                               <div class="flex flex-col gap-2 p-1">
                                  <span class="text-[0.6rem] font-black uppercase text-gray-400">Rate this Archive</span>
                                  <div class="flex gap-2">
                                     <button v-for="i in 5" :key="i" @click="handleRate(res, i)" class="hover:scale-125 transition-transform p-1">
                                        <StarFilled v-if="i <= Math.round(res.rating)" class="text-yellow-400 text-xl" />
                                        <StarOutlined v-else class="text-gray-200 text-xl" />
                                     </button>
                                  </div>
                               </div>
                            </template>
                            <div class="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 rounded-2xl px-3 py-2 transition-all group/rate border border-transparent hover:border-gray-100">
                               <StarFilled class="text-yellow-400 text-[12px]" />
                               <span class="text-gray-900 font-black">{{ res.rating.toFixed(1) }}</span>
                               <span class="opacity-30">({{ res.reviews }})</span>
                            </div>
                         </a-popover>
                         <div class="flex items-center gap-1.5 group-hover:text-trc transition-colors">
                            <BankOutlined class="text-[11px]" /> BLOCK-SECURE
                         </div>
                      </div>

                      <div class="flex items-center gap-3 pt-2">
                         <button @click="handleRead(res)" class="flex-1 rounded-[1.8rem] bg-[#F8F6FF] py-4 text-[0.75rem] font-black uppercase tracking-widest text-trc hover:bg-trc hover:text-white transition-all shadow-sm">Explore Depth</button>
                         <button 
                           @click="handleDownload(res)" 
                           :disabled="downloadingId === res.id"
                           class="flex h-14 w-14 items-center justify-center rounded-[1.8rem] bg-white text-gray-400 shadow-sm border border-gray-100 hover:text-trc hover:border-trc/40 transition-all active:scale-95 shrink-0 disabled:opacity-50"
                         >
                            <LoadingOutlined v-if="downloadingId === res.id" style="font-size: 22px" />
                            <DownloadOutlined v-else style="font-size: 22px" />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div v-else class="flex flex-col items-center justify-center py-48 text-center bg-white rounded-[4rem] border border-dashed border-gray-100 shadow-inner">
             <div class="h-32 w-32 rounded-[3.5rem] bg-gray-50 flex items-center justify-center mb-10 border border-gray-100 shadow-sm">
                <SearchOutlined class="text-gray-100 text-6xl" />
             </div>
             <h3 class="text-4xl font-black text-gray-900 mb-4 tracking-tight">Zero Records Located</h3>
             <button @click="resetFilters" class="mt-12 px-10 py-5 rounded-[2rem] bg-trc text-white text-[0.8rem] font-black uppercase tracking-widest shadow-2xl shadow-trc/40 hover:scale-105 transition-all">Clear Filters</button>
          </div>
       </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, markRaw, watch } from 'vue'
import { useRoute } from 'vue-router'
import { 
  SearchOutlined, 
  StarFilled, 
  StarOutlined,
  DownloadOutlined,
  VerifiedOutlined,
  BankOutlined,
  LoadingOutlined,
  TranslationOutlined,
  ExperimentOutlined,
  EnvironmentOutlined
} from '@ant-design/icons-vue'
import { useResources } from '../composables/useResources'

const route = useRoute()
const { downloadingId, handleRead, handleDownload, handleRate, getFilteredResources, resources } = useResources()

const searchQuery = ref('')
const activeCategory = ref('')
const activeChips = ref<string[]>([])
const isSearching = ref(false)

const categoryList = [
  { name: 'History', icon: markRaw(BankOutlined) },
  { name: 'Linguistics', icon: markRaw(TranslationOutlined) },
  { name: 'Science', icon: markRaw(ExperimentOutlined) },
  { name: 'Geopolitics', icon: markRaw(EnvironmentOutlined) },
]

onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q as string
    triggerSearch()
  }
})

const triggerSearch = () => {
  isSearching.value = true
  setTimeout(() => {
    isSearching.value = false
  }, 600)
}

watch([activeCategory, activeChips], () => {
  triggerSearch()
})

const filteredResults = computed(() => {
  let results = getFilteredResources(searchQuery.value)
  if (activeCategory.value) {
    results = results.filter(r => r.category === activeCategory.value)
  }
  if (activeChips.value.includes('Verified Only')) {
    results = results.filter(r => r.verified)
  }
  return results
})

const getReactiveCount = (catName: string) => {
  const baselineResults = getFilteredResources(searchQuery.value)
  return baselineResults.filter(r => r.category === catName).length
}

const toggleChip = (chip: string) => {
  const index = activeChips.value.indexOf(chip)
  if (index > -1) activeChips.value.splice(index, 1)
  else activeChips.value.push(chip)
}

const resetFilters = () => {
  searchQuery.value = ''
  activeCategory.value = ''
  activeChips.value = []
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes mesh {
  0% { transform: scale(1) rotate(0deg); opacity: 0.4; }
  50% { transform: scale(1.05) rotate(1deg); opacity: 0.5; }
  100% { transform: scale(1) rotate(0deg); opacity: 0.4; }
}
.animate-mesh {
  animation: mesh 15s infinite ease-in-out;
}

.reveal-item {
  opacity: 0;
  transform: translateY(20px);
  animation: revealUp 0.5s cubic-bezier(0.2, 1, 0.3, 1) forwards;
}

@keyframes revealUp {
  to { opacity: 1; transform: translateY(0); }
}

.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>

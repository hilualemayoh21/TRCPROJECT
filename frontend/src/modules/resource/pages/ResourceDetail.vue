<template>
  <div class="animate-fade-in flex flex-col gap-10 pb-20">
    <!-- Skeleton Loading -->
    <div v-if="loading" class="max-w-6xl mx-auto w-full space-y-10">
      <div class="h-[400px] bg-white rounded-[3rem] animate-pulse"></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div class="lg:col-span-2 space-y-6">
          <div class="h-10 w-3/4 bg-white rounded-full animate-pulse"></div>
          <div class="h-32 w-full bg-white rounded-3xl animate-pulse"></div>
        </div>
        <div class="space-y-6">
          <div class="h-64 w-full bg-white rounded-[3rem] animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="resource" class="max-w-6xl mx-auto w-full flex flex-col gap-10">
      
      <!-- HERO HEADER -->
      <header class="relative overflow-hidden rounded-[3rem] bg-[#1a1d26] min-h-[400px] flex items-end p-8 md:p-16 text-white group">
        <div 
          v-if="resource.thumbnailUrl" 
          :style="{ backgroundImage: `url(${resource.thumbnailUrl})` }" 
          class="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-[2s]"
        ></div>
        <div class="absolute inset-0 bg-gradient-to-t from-[#1a1d26] via-[#1a1d26]/60 to-transparent"></div>
        
        <div class="relative z-10 w-full">
          <div class="flex flex-wrap items-center gap-3 mb-6">
            <span v-if="resource.category" class="px-5 py-2 rounded-2xl bg-trc/20 backdrop-blur-xl border border-trc/30 text-[0.65rem] font-black uppercase tracking-widest text-trc-light">
              {{ resource.category.name }}
            </span>
            <span class="px-5 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 text-[0.65rem] font-black uppercase tracking-widest text-white/60">
              {{ resource.type }}
            </span>
          </div>
          <h1 class="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight italic">{{ resource.title }}</h1>
          
          <div class="flex flex-wrap items-center gap-8">
            <div class="flex items-center gap-4">
              <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(resource.author?.name || 'U')}&background=6C2BD9&color=fff`" class="h-12 w-12 rounded-2xl border-2 border-white/10" />
              <div>
                <p class="text-[0.65rem] font-black uppercase tracking-widest text-white/30">Curated By</p>
                <p class="text-sm font-bold text-white">{{ resource.author?.name }}</p>
              </div>
            </div>
            
            <div class="h-10 w-px bg-white/10 hidden sm:block"></div>
            
            <div>
              <p class="text-[0.65rem] font-black uppercase tracking-widest text-white/30">Release Date</p>
              <p class="text-sm font-bold text-white">{{ new Date(resource.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }}</p>
            </div>
            
            <div class="h-10 w-px bg-white/10 hidden sm:block"></div>
            
            <div class="flex items-center gap-2">
              <StarFilled class="text-yellow-400 text-xl" />
              <span class="text-2xl font-black text-white">{{ (resource.averageRating || 0).toFixed(1) }}</span>
              <span class="text-sm font-bold text-white/30">({{ resource._count?.ratings || 0 }} reviews)</span>
            </div>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <!-- LEFT: DESCRIPTION & COMMENTS -->
        <div class="lg:col-span-2 flex flex-col gap-10">
          
          <!-- DESCRIPTION -->
          <section class="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
            <h2 class="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              Archive Description
              <div class="h-2 w-2 rounded-full bg-trc animate-pulse"></div>
            </h2>
            <div class="prose prose-slate max-w-none">
              <p class="text-lg text-gray-600 leading-relaxed font-medium">
                {{ resource.description }}
              </p>
            </div>
            
            <div v-if="resource.tags?.length" class="mt-10 flex flex-wrap gap-2">
              <span v-for="tag in resource.tags" :key="tag" class="px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-[0.7rem] font-black text-gray-400 uppercase tracking-widest hover:text-trc hover:border-trc/30 transition-colors cursor-default">
                #{{ tag }}
              </span>
            </div>
          </section>

          <!-- COMMENTS -->
          <section class="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm flex flex-col gap-8">
            <h2 class="text-2xl font-black text-gray-900 flex items-center justify-between">
              Discussion Hub
              <span class="px-4 py-1.5 rounded-full bg-slate-50 text-[0.7rem] font-black text-slate-400 tracking-widest uppercase">
                {{ comments?.length || 0 }} Entries
              </span>
            </h2>

            <!-- Add Comment -->
            <div class="relative group">
              <textarea 
                v-model="newComment"
                placeholder="Contribute to the scholarly discourse..."
                class="w-full min-h-[120px] rounded-[2rem] bg-gray-50 border border-gray-100 p-6 text-sm font-medium text-gray-700 outline-none focus:ring-4 focus:ring-trc/10 focus:bg-white focus:border-trc/30 transition-all resize-none"
              ></textarea>
              <button 
                @click="submitComment"
                :disabled="addingComment || !newComment.trim()"
                class="absolute bottom-4 right-4 h-12 px-8 rounded-2xl bg-trc text-white text-[0.75rem] font-black uppercase tracking-widest shadow-xl shadow-trc/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post Entry
              </button>
            </div>

            <!-- Comment List -->
            <div v-if="loadingComments" class="space-y-6">
              <div v-for="i in 3" :key="i" class="h-24 bg-gray-50 rounded-3xl animate-pulse"></div>
            </div>
            <div v-else-if="comments?.length" class="space-y-6">
              <div v-for="comment in comments" :key="comment.id" class="p-6 rounded-3xl bg-gray-50 border border-transparent hover:border-gray-100 hover:bg-white transition-all flex gap-4">
                <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.name || 'U')}&background=random&color=fff`" class="h-10 w-10 rounded-xl" />
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-black text-gray-900">{{ comment.author?.name }}</span>
                    <span class="text-[0.65rem] font-bold text-gray-300 uppercase tracking-widest">{{ new Date(comment.createdAt).toLocaleDateString() }}</span>
                  </div>
                  <p class="text-sm font-medium text-gray-500 leading-relaxed">{{ comment.content }}</p>
                </div>
              </div>
            </div>
            <div v-else class="py-12 text-center text-gray-300">
               <MessageOutlined class="text-4xl mb-4 opacity-20" />
               <p class="text-sm font-black uppercase tracking-widest">No discourse entries yet.</p>
            </div>
          </section>
        </div>

        <!-- RIGHT: INFO & ACTIONS -->
        <aside class="flex flex-col gap-8">
          
          <!-- ACCESS CARD -->
          <div class="bg-[#F8F6FF] rounded-[3rem] p-10 border border-trc/10 shadow-sm flex flex-col gap-8 sticky top-8">
            <h3 class="text-[0.7rem] font-black uppercase tracking-[0.2em] text-trc mb-2">Protocol Access</h3>
            
            <div class="space-y-6">
              <div class="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-xl bg-trc/5 flex items-center justify-center text-trc">
                    <DownloadOutlined />
                  </div>
                  <span class="text-[0.7rem] font-black text-gray-500 uppercase tracking-widest">Downloads</span>
                </div>
                <span class="text-lg font-black text-gray-900">{{ resource.downloadCount }}</span>
              </div>
              
              <div class="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <EyeOutlined />
                  </div>
                  <span class="text-[0.7rem] font-black text-gray-500 uppercase tracking-widest">Total Views</span>
                </div>
                <span class="text-lg font-black text-gray-900">{{ resource.viewCount }}</span>
              </div>
            </div>

            <button 
              @click="handleDownload(resource)"
              class="w-full py-6 rounded-[2rem] bg-trc text-white font-black uppercase tracking-[0.2em] text-[0.8rem] shadow-2xl shadow-trc/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <DownloadOutlined class="text-xl" />
              Download Archive
            </button>
            
            <p class="text-[0.6rem] text-center font-bold text-gray-400 uppercase tracking-widest leading-loose">
              Archive secured via Tigray Resource Center Distributed Protocol 2024
            </p>
          </div>

          <!-- RATING QUICK CARD -->
          <div class="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm text-center">
             <h3 class="text-[0.7rem] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Expert Verification</h3>
             <div class="flex justify-center gap-3 mb-4">
                <button 
                  v-for="i in 5" 
                  :key="i" 
                  @click="handleRate(resource, i)"
                  class="group relative"
                >
                   <StarFilled 
                     :class="[
                       'text-3xl transition-all hover:scale-125 active:scale-90',
                       i <= Math.round(resource.averageRating || 0) ? 'text-yellow-400' : 'text-gray-100'
                     ]" 
                   />
                </button>
             </div>
             <p class="text-[0.8rem] font-medium text-gray-400">Tap to contribute your academic evaluation</p>
          </div>

        </aside>

      </div>

    </div>

    <!-- 404 STATE -->
    <div v-else class="py-48 text-center">
       <h2 class="text-4xl font-black text-gray-900 mb-6">Resource Not Found</h2>
       <RouterLink to="/search" class="px-10 py-4 rounded-2xl bg-trc text-white font-black uppercase tracking-widest text-[0.8rem]">Return to Archive</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { 
  StarFilled, 
  DownloadOutlined, 
  EyeOutlined, 
  MessageOutlined,
  VerifiedOutlined
} from '@ant-design/icons-vue'
import { useResourceDetail, useResources } from '../composables/useResources'

const route = useRoute()
const resourceId = route.params.id as string

const { resource, loading, comments, loadingComments, addComment, addingComment } = useResourceDetail(resourceId)
const { handleDownload, handleRate } = useResources()

const newComment = ref('')

async function submitComment() {
  if (!newComment.value.trim()) return
  try {
    await addComment(newComment.value)
    newComment.value = ''
  } catch (e) {}
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

.italic { font-style: italic; }
</style>

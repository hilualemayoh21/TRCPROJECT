<template>
  <div class="max-w-7xl mx-auto w-full font-sans text-gray-900 dark:text-gray-100 pb-16 md:pb-10 p-4 md:p-6 lg:p-8 transition-colors duration-300">
    
    <!-- Breadcrumb -->
    <div class="flex items-center gap-1 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 animate-fade-in">
      <span>Activity</span>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="opacity-60"><polyline points="9 18 15 12 9 6"></polyline></svg>
      <span class="text-[#6C2BD9] dark:text-purple-400">Notifications</span>
    </div>

    <!-- Main Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
      <div>
        <h1 class="text-3xl font-black text-gray-900 dark:text-gray-50 tracking-tight">System Updates</h1>
        <p class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-[#6C2BD9] animate-pulse"></span>
          {{ unreadCount }} Unread updates based on your role
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button 
          @click="markAllAsRead"
          class="px-6 py-3.5 bg-purple-50 dark:bg-purple-950/40 text-[#6C2BD9] dark:text-purple-300 font-black text-[11px] tracking-wider uppercase rounded-2xl shadow-sm transition-all hover:bg-purple-100/80 dark:hover:bg-purple-900/40 hover:-translate-y-0.5 active:translate-y-0"
        >
          Mark all as read
        </button>
        <button 
          @click="toggleFilterView"
          class="px-6 py-3.5 bg-[#6C2BD9] dark:bg-purple-700 hover:bg-[#5B21B6] dark:hover:bg-purple-800 text-white font-black text-[11px] tracking-wider uppercase rounded-2xl shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
        >
          <SearchOutlined /> Filter View
        </button>
      </div>
    </div>

    <!-- Main Two-Column Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- LEFT COLUMN: Notification Cards (8 Cols) -->
      <div class="lg:col-span-8 flex flex-col gap-6 animate-fade-up">
        
        <!-- Search bar toggle -->
        <div v-if="showFilterView" class="bg-[#FBFBFF] dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 rounded-[1.75rem] p-5 shadow-sm">
          <div class="relative w-full">
            <SearchOutlined class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search notifications..." 
              class="w-full bg-white dark:bg-gray-800 border-none rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C2BD9] placeholder-gray-400 text-gray-900 dark:text-gray-50 shadow-sm"
            />
          </div>
        </div>

        <div v-if="filteredNotifications.length === 0" class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-12 text-center py-20">
          <div class="w-20 h-20 bg-purple-50 dark:bg-purple-950/60 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-[#6C2BD9] dark:text-purple-400">
            <CheckCircleOutlined style="font-size: 32px" />
          </div>
          <h3 class="text-base font-black text-gray-900 dark:text-gray-100 mb-2">You're all caught up!</h3>
          <p class="text-xs text-gray-400 dark:text-gray-500 font-medium max-w-sm mx-auto">
            No notifications found matching your current filter. Check back later for new updates.
          </p>
        </div>

        <div v-else class="space-y-4">
          <!-- Notification Card Item -->
          <div 
            v-for="item in filteredNotifications" 
            :key="item.id" 
            @click="markAsRead(item.id)"
            class="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.008)] flex gap-5 hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
            :class="[
              item.unread ? 'bg-gradient-to-r from-purple-50/10 to-white dark:from-purple-950/5 dark:to-gray-900' : '',
              item.type === 'approval' ? 'border-l-[4px] border-[#6C2BD9]' : '',
              item.type === 'comment' ? 'border-l-[4px] border-gray-300 dark:border-gray-700' : '',
              item.type === 'rejection' ? 'border-l-[4px] border-red-500' : '',
              item.type === 'rating' ? 'border-l-[4px] border-amber-500' : ''
            ]"
          >
            <!-- Left Circular/Squircle Icon -->
            <div class="shrink-0">
              <!-- Avatar Style -->
              <img 
                v-if="item.avatar" 
                :src="item.avatar" 
                alt="Sender Avatar" 
                class="w-11 h-11 rounded-2xl object-cover shadow-sm bg-gray-50"
              />
              
              <!-- Approval Tick -->
              <div 
                v-else-if="item.type === 'approval'" 
                class="w-11 h-11 bg-purple-50 dark:bg-purple-950 text-[#6C2BD9] dark:text-purple-400 rounded-2xl flex items-center justify-center shadow-sm"
              >
                <CheckOutlined class="text-base font-black" />
              </div>

              <!-- Rejection Cross -->
              <div 
                v-else-if="item.type === 'rejection'" 
                class="w-11 h-11 bg-red-50 dark:bg-red-950/60 text-red-600 rounded-2xl flex items-center justify-center shadow-sm"
              >
                <CloseOutlined class="text-base font-black" />
              </div>

              <!-- Rating Star -->
              <div 
                v-else-if="item.type === 'rating'" 
                class="w-11 h-11 bg-amber-50 dark:bg-amber-950/60 text-amber-500 rounded-2xl flex items-center justify-center shadow-sm"
              >
                <StarFilled class="text-base" />
              </div>

              <!-- Default Comment Balloon -->
              <div 
                v-else 
                class="w-11 h-11 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center shadow-sm"
              >
                <MessageOutlined class="text-base" />
              </div>
            </div>

            <!-- Content Area -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between gap-4">
                  <h4 class="text-sm font-black text-gray-900 dark:text-gray-50 tracking-tight leading-tight group-hover:text-[#6C2BD9] transition-colors">
                    {{ item.title }}
                  </h4>
                  <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 shrink-0">
                    {{ item.time }}
                  </span>
                </div>
                
                <p class="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed mt-2" v-html="highlightText(item.desc)"></p>
              </div>

              <!-- Bottom Tag and Link Actions -->
              <div class="flex items-center gap-3.5 mt-4">
                <span 
                  class="px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase rounded-lg"
                  :class="[
                    item.type === 'approval' ? 'bg-purple-50 dark:bg-purple-950/60 text-[#6C2BD9] dark:text-purple-400' : '',
                    item.type === 'comment' ? 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400' : '',
                    item.type === 'rejection' ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400' : '',
                    item.type === 'rating' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400' : ''
                  ]"
                >
                  {{ item.tag }}
                </span>
                
                <button 
                  v-if="item.actionText"
                  @click.stop="triggerAction(item.actionText)"
                  class="text-[10px] font-black text-[#6C2BD9] dark:text-purple-400 hover:underline hover:opacity-85 transition-opacity"
                >
                  {{ item.actionText }}
                </button>
              </div>
            </div>

            <!-- Unread small dot badge -->
            <div v-if="item.unread" class="absolute right-4 bottom-4 w-2 h-2 rounded-full bg-[#6C2BD9]"></div>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN: Sidebar (4 Cols) -->
      <div class="lg:col-span-4 flex flex-col gap-6 animate-fade-up" style="animation-delay: 0.1s">
        
        <!-- Activity Summary Card -->
        <div class="bg-[#FBFBFF] dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 rounded-[2rem] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.005)]">
          <h3 class="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Activity Summary</h3>
          
          <div class="space-y-4">
            <!-- Row 1: Unread -->
            <div class="flex items-center justify-between pb-3.5 border-b border-gray-100 dark:border-gray-800/80">
              <span class="text-xs font-bold text-gray-500 dark:text-gray-400">Unread</span>
              <div class="w-6 h-6 rounded-full bg-[#6C2BD9] flex items-center justify-center text-[10px] font-black text-white shadow-sm">
                {{ sidebarMetrics.unread }}
              </div>
            </div>

            <!-- Row 2: Approvals -->
            <div class="flex items-center justify-between pb-3.5 border-b border-gray-100 dark:border-gray-800/80">
              <span class="text-xs font-bold text-gray-500 dark:text-gray-400">Approvals</span>
              <span class="text-xs font-black text-gray-800 dark:text-gray-200">{{ sidebarMetrics.approvals }}</span>
            </div>

            <!-- Row 3: Comments -->
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-gray-500 dark:text-gray-400">Comments</span>
              <span class="text-xs font-black text-gray-800 dark:text-gray-200">{{ sidebarMetrics.comments }}</span>
            </div>
          </div>
        </div>

        <!-- Growth Purple Card -->
        <div class="bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] dark:from-purple-950/80 dark:to-purple-900/60 rounded-[2.2rem] p-6 text-white shadow-lg relative overflow-hidden">
          <div class="absolute -right-6 -bottom-6 h-28 w-28 text-white/5 shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full"><path d="M12 2L2 22h20L12 2z"/></svg>
          </div>
          
          <div class="flex items-center gap-2 mb-4">
            <ThunderboltFilled class="text-amber-300 text-sm animate-pulse" />
            <h4 class="text-[10px] font-black uppercase tracking-widest text-purple-200">Growth</h4>
          </div>
          
          <p class="text-xs font-bold leading-relaxed pr-4">
            Your engagement is up 24% this week. Keep sharing and reviewing resources!
          </p>
        </div>

        <!-- Filter Categories Card -->
        <div class="bg-[#FBFBFF] dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 rounded-[2rem] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.005)]">
          <h3 class="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-5">Filter categories</h3>
          
          <div class="flex flex-wrap gap-2.5">
            <button 
              v-for="cat in ['All Updates', 'Approvals', 'Rejections', 'Comments', 'Ratings']" 
              :key="cat"
              @click="activeFilter = cat"
              class="px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border"
              :class="[
                activeFilter === cat
                  ? 'bg-purple-500 border-purple-500 text-white shadow-sm hover:opacity-95'
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              {{ cat }}
            </button>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { 
  CheckCircleOutlined, CheckOutlined, CloseOutlined, 
  StarFilled, MessageOutlined, SearchOutlined, ThunderboltFilled 
} from '@ant-design/icons-vue'
import { useAuthStore } from '@/modules/auth/auth.store'

const authStore = useAuthStore()
const showFilterView = ref(true)
const searchQuery = ref('')
const activeFilter = ref('All Updates')

const userRole = computed(() => authStore.user?.role || 'public_user')

const toggleFilterView = () => {
  showFilterView.value = !showFilterView.value
}

// Dynamic Mock Notifications list per role
const adminNotifications = ref([
  {
    id: 1,
    title: 'Resource Pending Approval',
    category: 'Approvals',
    time: '2 mins ago',
    desc: 'A new researcher submission "Ancient Artifacts of Aksum" has been submitted for verification.',
    tag: 'PENDING APPROVAL',
    actionText: 'Review Submission',
    actionType: 'review',
    unread: true,
    type: 'approval'
  },
  {
    id: 2,
    title: 'New User Report',
    category: 'Comments',
    time: '45 mins ago',
    desc: 'A public user reported a broken external document link in the "Ge\'ez Manuscripts Collection".',
    tag: 'REPORTED',
    actionText: 'Investigate Link',
    actionType: 'audit',
    unread: true,
    type: 'comment'
  },
  {
    id: 3,
    title: 'System Node Alert',
    category: 'Rejections',
    time: '2 hours ago',
    desc: 'Storage cluster node TRC-West is reaching 92% capacity limit. High replication latency warning.',
    tag: 'SYSTEM ERROR',
    actionText: 'View Cluster Logs',
    actionType: 'logs',
    unread: true,
    type: 'rejection'
  },
  {
    id: 4,
    title: 'Security Sync Successful',
    category: 'Ratings',
    time: '5 hours ago',
    desc: 'Automatic weekly platform vulnerability scan and access control audit completed with zero threats detected.',
    tag: 'SECURITY',
    actionText: 'Download PDF Report',
    actionType: 'security',
    unread: false,
    type: 'rating'
  }
])

const researcherNotifications = ref([
  {
    id: 1,
    title: 'Resource Approved',
    category: 'Approvals',
    time: '2 mins ago',
    desc: 'Your submission "Cultural Heritage Archive 2024" has been vetted and published to the public directory.',
    tag: 'APPROVAL',
    actionText: 'View Asset',
    actionType: 'view',
    unread: true,
    type: 'approval'
  },
  {
    id: 2,
    title: 'New Comment',
    category: 'Comments',
    time: '45 mins ago',
    desc: 'Sarah Connor left a note on your recent collection entry about Tigrinya dialects: "The historical references here are incredibly detailed. Could you provide the source for the 18th-century manuscript mentioned?"',
    tag: 'COMMENT',
    actionText: 'Reply',
    actionType: 'reply',
    unread: true,
    type: 'comment',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    title: 'Submission Rejected',
    category: 'Rejections',
    time: '2 hours ago',
    desc: 'The document "Economic Indicators Q3" was rejected due to missing metadata tags and low-resolution source files.',
    tag: 'REJECTION',
    actionText: 'Edit & Resubmit',
    actionType: 'edit',
    unread: true,
    type: 'rejection'
  },
  {
    id: 4,
    title: 'Asset Rated High',
    category: 'Ratings',
    time: '5 hours ago',
    desc: 'Your resource "Topographical Maps of Axum" just received a 5-star rating from a peer reviewer.',
    tag: 'RATING',
    actionText: '',
    actionType: '',
    unread: false,
    type: 'rating'
  }
])

const publicNotifications = ref([
  {
    id: 1,
    title: 'Resource Saved to Library',
    category: 'Approvals',
    time: '5 mins ago',
    desc: 'You successfully bookmarked "Preserving Aksumite Archeology". It is now added to your local library.',
    tag: 'SAVED',
    actionText: 'Open Library',
    actionType: 'library',
    unread: true,
    type: 'approval'
  },
  {
    id: 2,
    title: 'New Resource in Linguistics',
    category: 'Comments',
    time: '1 hour ago',
    desc: 'A new premium publication "Evolution of Tigrinya Orthography" has been verified and published in your followed category.',
    tag: 'RECOMMENDED',
    actionText: 'Read Publication',
    actionType: 'read',
    unread: true,
    type: 'comment'
  },
  {
    id: 3,
    title: 'Download Limit Alert',
    category: 'Rejections',
    time: '3 hours ago',
    desc: 'You have reached 80% of your daily anonymous download bandwidth limit. Log in with full credentials for unlimited storage access.',
    tag: 'LIMIT ALERT',
    actionText: 'Upgrade Access',
    actionType: 'upgrade',
    unread: true,
    type: 'rejection'
  },
  {
    id: 4,
    title: 'Account Verification Level 2',
    category: 'Ratings',
    time: '1 day ago',
    desc: 'Congratulations! Your community curation contributions have unlocked verified level 2 library badge privilege.',
    tag: 'BADGE UPGRADE',
    actionText: 'View Badges',
    actionType: 'badges',
    unread: false,
    type: 'rating'
  }
])

const activeNotificationsList = computed(() => {
  const role = String(userRole.value).toLowerCase()
  if (role === 'admin' || role === 'super_admin') {
    return adminNotifications.value
  } else if (role === 'researcher') {
    return researcherNotifications.value
  } else {
    return publicNotifications.value
  }
})

const unreadCount = computed(() => {
  return activeNotificationsList.value.filter(n => n.unread).length
})

const sidebarMetrics = computed(() => {
  const list = activeNotificationsList.value
  const approvalsCount = list.filter(n => n.category === 'Approvals').length + 47
  const commentsCount = list.filter(n => n.category === 'Comments').length + 154
  return {
    unread: unreadCount.value + 10,
    approvals: approvalsCount,
    comments: commentsCount
  }
})

const filteredNotifications = computed(() => {
  return activeNotificationsList.value.filter(n => {
    // category filter
    const matchesFilter = activeFilter.value === 'All Updates' || n.category === activeFilter.value
    
    // search filter
    const matchesSearch = !searchQuery.value.trim() || 
      n.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      n.desc.toLowerCase().includes(searchQuery.value.toLowerCase())
      
    return matchesFilter && matchesSearch
  })
})

const highlightText = (text: string) => {
  if (!text) return ''
  // Highlight quoted strings or uppercase title fragments
  return text.replace(/"([^"]+)"/g, '<strong class="font-extrabold text-gray-800 dark:text-gray-100">"$1"</strong>')
}

const markAsRead = (id: number) => {
  const item = activeNotificationsList.value.find(n => n.id === id)
  if (item && item.unread) {
    item.unread = false
    message.success('Notification marked as read')
  }
}

const markAllAsRead = () => {
  activeNotificationsList.value.forEach(n => {
    n.unread = false
  })
  message.success('All notifications marked as read!')
}

const triggerAction = (actionText: string) => {
  message.success(`Redirecting to action: "${actionText}"`)
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
.animate-fade-up {
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

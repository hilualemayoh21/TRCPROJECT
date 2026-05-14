<template>
  <div class="h-[calc(100vh-14rem)] flex gap-8 transition-colors duration-300">
    
    <!-- ── LEFT: NOTIFICATION LIST CARD ── -->
    <div class="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl shadow-trc/5 border border-gray-100 dark:border-gray-800 overflow-hidden">
      <!-- Header Controls -->
      <div class="bg-white dark:bg-gray-900 p-8 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div class="flex flex-col gap-1">
          <h1 class="text-2xl font-black text-gray-900 dark:text-gray-100 uppercase tracking-tight">Notifications</h1>
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-trc animate-pulse"></span>
            <span class="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest">{{ unreadCount }} Unread messages</span>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <NotificationFilters v-model="activeFilter" />
          <button 
            @click="markAllAsRead"
            class="hidden xl:block px-6 py-2.5 bg-trc/5 text-trc rounded-xl text-[0.65rem] font-black uppercase tracking-widest hover:bg-trc hover:text-white transition-all shadow-sm"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <!-- Notification List -->
      <div class="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
        <div v-if="loading" class="space-y-6 pt-6">
          <!-- Skeletons -->
          <div v-for="i in 5" :key="i" class="flex gap-4 p-5 rounded-3xl bg-gray-50/50 animate-pulse">
            <div class="w-12 h-12 rounded-2xl bg-gray-100"></div>
            <div class="flex-1 space-y-3">
              <div class="h-4 bg-gray-100 rounded w-1/4"></div>
              <div class="h-3 bg-gray-100 rounded w-3/4"></div>
            </div>
          </div>
        </div>

        <div v-else-if="filteredNotifications.length === 0" class="h-full flex flex-col items-center justify-center text-center opacity-50 py-20">
           <div class="w-24 h-24 rounded-[2.5rem] bg-gray-50 flex items-center justify-center mb-6">
              <CheckCircleOutlined style="font-size: 40px" class="text-gray-200" />
           </div>
           <h3 class="text-lg font-black text-gray-400 uppercase tracking-tight mb-2">You're all caught up!</h3>
           <p class="text-sm text-gray-300 font-bold uppercase">No notifications found for this filter.</p>
        </div>

        <div v-else class="space-y-10 pt-6">
          <!-- Group: Today -->
          <div v-if="todayNotifications.length > 0">
            <div class="sticky top-0 z-10 bg-white dark:bg-gray-900 py-2 mb-4">
               <span class="text-[0.65rem] font-black text-gray-300 dark:text-gray-600 uppercase tracking-[0.25em]">Today</span>
            </div>
            <div class="space-y-3">
              <NotificationItem 
                v-for="n in todayNotifications" 
                :key="n.id" 
                :notification="n"
                :isActive="selectedNotification?.id === n.id"
                @select="selectNotification"
                @toggleRead="toggleRead"
                @delete="deleteNotification"
              />
            </div>
          </div>

          <!-- Group: Earlier -->
          <div v-if="earlierNotifications.length > 0">
            <div class="sticky top-0 z-10 bg-white py-2 mb-4">
               <span class="text-[0.65rem] font-black text-gray-300 uppercase tracking-[0.25em]">Earlier This Week</span>
            </div>
            <div class="space-y-3">
              <NotificationItem 
                v-for="n in earlierNotifications" 
                :key="n.id" 
                :notification="n"
                :isActive="selectedNotification?.id === n.id"
                @select="selectNotification"
                @toggleRead="toggleRead"
                @delete="deleteNotification"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── RIGHT: DETAIL PREVIEW CARD ── -->
    <div class="hidden lg:block w-[450px] xl:w-[550px] bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl shadow-trc/5 border border-gray-100 dark:border-gray-800 overflow-hidden">
      <NotificationDetail 
        :notification="selectedNotification"
        @close="selectedNotification = null"
        @toggleRead="toggleRead"
        @delete="deleteNotification"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CheckCircleOutlined } from '@ant-design/icons-vue'
import NotificationItem from '@/modules/notification/components/NotificationItem.vue'
import NotificationFilters from '@/modules/notification/components/NotificationFilters.vue'
import NotificationDetail from '@/modules/notification/components/NotificationDetail.vue'
import { useNotificationStore } from '@/modules/notification/notification.store'
import type { Notification } from '@/modules/notification/notification.types'

const store = useNotificationStore()
const selectedNotification = ref<Notification | null>(null)

const loading = computed(() => store.loading)
const activeFilter = computed({
  get: () => store.activeFilter,
  set: (val) => store.setFilter(val)
})

const unreadCount = computed(() => store.unreadCount)
const filteredNotifications = computed(() => store.filteredNotifications)
const todayNotifications = computed(() => store.todayNotifications)
const earlierNotifications = computed(() => store.earlierNotifications)

const selectNotification = (n: Notification) => {
  selectedNotification.value = n
  if (n.unread) {
    store.toggleRead(n.id)
  }
}

const toggleRead = (n: Notification) => {
  store.toggleRead(n.id)
}

const deleteNotification = (n: Notification) => {
  store.deleteNotification(n.id)
  if (selectedNotification.value?.id === n.id) {
    selectedNotification.value = null
  }
}

const markAllAsRead = () => {
  store.markAllAsRead()
}

onMounted(() => {
  store.fetchNotifications()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f1f1f1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #e5e5e5;
}
</style>

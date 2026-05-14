<template>
  <div class="h-full flex flex-col bg-white dark:bg-gray-900 p-8 transition-colors">
    <div v-if="notification" class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex justify-between items-start mb-10">
        <div class="flex-shrink-0 w-16 h-16 rounded-[1.5rem] bg-trc/5 flex items-center justify-center text-trc">
           <HistoryOutlined style="font-size: 28px" />
        </div>
        <button 
          @click="$emit('close')"
          class="p-2 rounded-xl text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-all"
        >
          <CloseOutlined />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1">
        <span class="text-[0.65rem] font-black text-trc uppercase tracking-[0.25em] mb-4 block">
          {{ notification.type }} Notification
        </span>
        <h2 class="text-2xl font-black text-gray-900 dark:text-gray-100 leading-tight mb-6 uppercase tracking-tight">
          {{ notification.title }}
        </h2>
        <p class="text-gray-500 dark:text-gray-400 leading-relaxed font-medium mb-8">
          {{ notification.message }}
        </p>

        <!-- Meta Data Card -->
        <div class="bg-gray-50/50 dark:bg-gray-800/50 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-[0.6rem] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Received</span>
            <span class="text-[0.65rem] font-black text-gray-900 dark:text-gray-100 uppercase tracking-widest">{{ notification.timestamp }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[0.6rem] font-black text-gray-400 uppercase tracking-widest">Status</span>
            <span 
              class="px-3 py-1 rounded-lg text-[0.6rem] font-black uppercase tracking-widest"
              :class="notification.unread ? 'bg-trc/10 text-trc' : 'bg-gray-100 text-gray-400'"
            >
              {{ notification.unread ? 'Unread' : 'Read' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="pt-8 border-t border-gray-50 flex gap-4">
        <button 
          class="flex-1 py-4 bg-trc text-white rounded-2xl font-black text-[0.7rem] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-trc/20"
          @click="$emit('toggleRead', notification)"
        >
          {{ notification.unread ? 'Mark as Read' : 'Mark as Unread' }}
        </button>
        <button 
          class="w-14 h-14 flex items-center justify-center border border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600 hover:text-red-500 hover:border-red-100 transition-all rounded-2xl"
          @click="$emit('delete', notification)"
        >
          <DeleteOutlined />
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="h-full flex flex-col items-center justify-center text-center px-10">
      <div class="w-20 h-20 rounded-[2rem] bg-gray-50 flex items-center justify-center text-gray-200 mb-6">
        <BellOutlined style="font-size: 32px" />
      </div>
      <h3 class="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Select a notification</h3>
      <p class="text-xs text-gray-300 font-bold leading-relaxed uppercase">Click on an item from the list to view its full details and available actions.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  CloseOutlined, 
  HistoryOutlined, 
  BellOutlined,
  DeleteOutlined 
} from '@ant-design/icons-vue'

interface Notification {
  id: string | number
  type: 'success' | 'info' | 'warning' | 'error' | 'activity'
  title: string
  message: string
  timestamp: string
  unread: boolean
}

defineProps<{
  notification: Notification | null
}>()

defineEmits(['close', 'toggleRead', 'delete'])
</script>

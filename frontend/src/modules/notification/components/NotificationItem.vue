<template>
  <div 
    class="relative flex items-start gap-4 p-5 rounded-3xl transition-all duration-300 cursor-pointer group"
    :class="[
      notification.unread ? 'bg-trc/5 shadow-sm dark:bg-trc/10' : 'bg-white dark:bg-gray-900 hover:bg-gray-50/50 dark:hover:bg-gray-800/50',
      isActive ? 'ring-2 ring-trc bg-trc/[0.02] dark:bg-trc/[0.05] shadow-lg shadow-trc/5 scale-[1.01]' : 'border border-transparent'
    ]"
    @click="$emit('select', notification)"
  >
    <!-- Status Indicator (Unread Bar) -->
    <div 
      v-if="notification.unread" 
      class="absolute left-0 top-6 bottom-6 w-1 bg-trc rounded-r-full"
    ></div>

    <!-- Icon based on Type -->
    <div 
      class="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
      :class="typeStyles[notification.type].bg"
    >
      <component :is="typeStyles[notification.type].icon" class="text-xl" :class="typeStyles[notification.type].text" />
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-start mb-1">
        <h3 
          class="text-[0.9rem] leading-tight truncate pr-4"
          :class="notification.unread ? 'font-black text-gray-900 dark:text-gray-100' : 'font-bold text-gray-600 dark:text-gray-400'"
        >
          {{ notification.title }}
        </h3>
        <span class="text-[0.65rem] font-black text-gray-300 uppercase tracking-widest whitespace-nowrap">
          {{ notification.timestamp }}
        </span>
      </div>
      <p 
        class="text-xs leading-relaxed line-clamp-2"
        :class="notification.unread ? 'text-gray-600 dark:text-gray-300 font-medium' : 'text-gray-400 dark:text-gray-500 font-medium'"
      >
        {{ notification.message }}
      </p>

      <!-- Quick Actions (Hidden by default, show on hover) -->
      <div class="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          class="p-2 rounded-lg bg-white shadow-sm border border-gray-100 text-gray-400 hover:text-trc hover:border-trc/20 transition-all"
          @click.stop="$emit('toggleRead', notification)"
          title="Mark as read/unread"
        >
          <CheckCircleOutlined v-if="notification.unread" />
          <EyeOutlined v-else />
        </button>
        <button 
          class="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:border-red-100 transition-all"
          @click.stop="$emit('delete', notification)"
          title="Delete"
        >
          <DeleteOutlined />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  CheckCircleOutlined, 
  EyeOutlined, 
  DeleteOutlined,
  InfoCircleOutlined,
  CheckOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  HistoryOutlined
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
  notification: Notification
  isActive?: boolean
}>()

defineEmits(['select', 'toggleRead', 'delete'])

const typeStyles = {
  success: { bg: 'bg-green-50', text: 'text-green-500', icon: CheckOutlined },
  info: { bg: 'bg-blue-50', text: 'text-blue-500', icon: InfoCircleOutlined },
  warning: { bg: 'bg-amber-50', text: 'text-amber-500', icon: WarningOutlined },
  error: { bg: 'bg-red-50', text: 'text-red-500', icon: CloseCircleOutlined },
  activity: { bg: 'bg-trc/5', text: 'text-trc', icon: HistoryOutlined }
}
</script>

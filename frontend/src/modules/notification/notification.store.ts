import { defineStore } from 'pinia';
import { notificationService } from './notification.service';
import type { Notification, NotificationState } from './notification.types';

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => ({
    notifications: [],
    loading: false,
    activeFilter: 'All'
  }),

  getters: {
    unreadCount: (state) => state.notifications.filter(n => n.unread).length,
    
    filteredNotifications: (state) => {
      if (state.activeFilter === 'All') return state.notifications;
      if (state.activeFilter === 'Unread') return state.notifications.filter(n => n.unread);
      return state.notifications.filter(n => n.type === state.activeFilter.toLowerCase());
    },

    todayNotifications(): Notification[] {
      const today = new Date().toISOString().split('T')[0];
      return this.filteredNotifications.filter(n => n.date.startsWith(today));
    },

    earlierNotifications(): Notification[] {
      const today = new Date().toISOString().split('T')[0];
      return this.filteredNotifications.filter(n => !n.date.startsWith(today));
    }
  },

  actions: {
    async fetchNotifications() {
      this.loading = true;
      try {
        const oldUnreadCount = this.unreadCount;
        this.notifications = await notificationService.getNotifications();
        
        // Play sound if there are new unread notifications
        if (this.unreadCount > oldUnreadCount) {
          this.playNotificationSound();
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        this.loading = false;
      }
    },

    playNotificationSound() {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => {
        console.warn('Sound playback blocked by browser. User interaction required.', err);
      });
    },

    async toggleRead(id: string | number) {
      const notification = this.notifications.find(n => n.id === id);
      if (notification) {
        notification.unread = !notification.unread;
        if (!notification.unread) {
          await notificationService.markAsRead(id);
        }
      }
    },

    async markAllAsRead() {
      this.notifications.forEach(n => n.unread = false);
      await notificationService.markAllAsRead();
    },

    async deleteNotification(id: string | number) {
      this.notifications = this.notifications.filter(n => n.id !== id);
      await notificationService.deleteNotification(id);
    },

    setFilter(filter: string) {
      this.activeFilter = filter;
    }
  }
});

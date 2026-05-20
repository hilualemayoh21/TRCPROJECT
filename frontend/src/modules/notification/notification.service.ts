import type { Notification } from './notification.types';

const DEFAULT_MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Resource Approved',
    message: 'Your research paper on "Modern Geopolitics of the Horn of Africa" has been verified and published.',
    timestamp: '14:20 PM',
    unread: true,
    date: new Date().toISOString()
  },
  {
    id: '2',
    type: 'activity',
    title: 'Profile Updated',
    message: 'Your academic credentials have been successfully updated in the curator database.',
    timestamp: '11:05 AM',
    unread: true,
    date: new Date().toISOString()
  },
  {
    id: '3',
    type: 'warning',
    title: 'Storage Capacity Alert',
    message: 'Your personal archive is reaching 90% capacity. Consider upgrading for more research space.',
    timestamp: 'Yesterday',
    unread: false,
    date: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '4',
    type: 'info',
    title: 'New Community Event',
    message: 'A roundtable discussion on "Digital Preservation" is starting in 30 minutes. Join the live stream.',
    timestamp: '2 Days ago',
    unread: false,
    date: new Date(Date.now() - 172800000).toISOString()
  }
];

const getStoredNotifications = (): Notification[] => {
  try {
    const saved = localStorage.getItem('trc_notifications');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load notifications from local storage', e);
  }
  return [...DEFAULT_MOCK_NOTIFICATIONS];
};

const saveNotifications = (notifications: Notification[]) => {
  localStorage.setItem('trc_notifications', JSON.stringify(notifications));
};

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getStoredNotifications()), 800);
    });
  },

  async markAsRead(id: string | number): Promise<void> {
    const notifications = getStoredNotifications();
    const target = notifications.find(n => n.id === String(id));
    if (target) {
      target.unread = false;
      saveNotifications(notifications);
    }
  },

  async markAllAsRead(): Promise<void> {
    const notifications = getStoredNotifications();
    notifications.forEach(n => n.unread = false);
    saveNotifications(notifications);
  },

  async deleteNotification(id: string | number): Promise<void> {
    const notifications = getStoredNotifications().filter(n => n.id !== String(id));
    saveNotifications(notifications);
  }
};

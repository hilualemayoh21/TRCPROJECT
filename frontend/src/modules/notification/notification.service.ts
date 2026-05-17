import type { Notification } from './notification.types';

const MOCK_NOTIFICATIONS: Notification[] = [
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

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_NOTIFICATIONS]);
      }, 800);
    });
  },

  async markAsRead(id: string | number): Promise<void> {
    console.log(`Marking notification ${id} as read`);
  },

  async markAllAsRead(): Promise<void> {
    console.log('Marking all notifications as read');
  },

  async deleteNotification(id: string | number): Promise<void> {
    console.log(`Deleting notification ${id}`);
  }
};

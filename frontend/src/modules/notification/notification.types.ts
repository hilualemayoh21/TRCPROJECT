export type NotificationType = 'success' | 'info' | 'warning' | 'error' | 'activity';

export interface Notification {
  id: string | number;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
  date: string; // ISO date for grouping
}

export interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  activeFilter: string;
}

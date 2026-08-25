import type { Pagination } from "./api";

export type NotificationType =
  | "booking_created"
  | "booking_status_changed"
  | "service_approved"
  | "service_rejected";

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  relatedId?: string;
  createdAt: string;
}

export interface NotificationStats {
  unreadCount: number;
}

export interface NotificationListResponse {
  message: string;
  statusCode: number;
  data: Notification[];
  pagination: Pagination;
  info: NotificationStats;
}

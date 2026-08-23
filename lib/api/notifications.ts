"use client";

import { apiClient } from "./client";
import type { ApiResponse, Notification, NotificationListResponse } from "@/types";

export interface NotificationListParams {
  page?: number;
  limit?: number;
}

export const notificationApi = {
  getNotifications: async (params: NotificationListParams = {}) => {
    const res = await apiClient.get<NotificationListResponse>("/notifications", { params });
    return res.data;
  },

  markAsRead: async (id: string) => {
    const res = await apiClient.patch<ApiResponse<Notification>>(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await apiClient.patch<ApiResponse<null>>("/notifications/read-all");
    return res.data;
  },
};

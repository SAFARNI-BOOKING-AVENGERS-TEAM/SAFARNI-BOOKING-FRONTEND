"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { setNotificationCount } from "@/store/slices/uiSlice";
import { notificationApi, NotificationListParams } from "@/lib/api/notifications";

export function useNotifications(params: NotificationListParams = {}) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return useQuery({
    queryKey: ["notifications", "list", params],
    queryFn: () => notificationApi.getNotifications(params),
    enabled: isAuthenticated,
    placeholderData: (prev) => prev,
  });
}

// Mount once (in the customer layout) so the sidebar's unread badge — built
// in Stage 1, never populated until now — stays accurate on every customer
// page, not just /notifications. Uses its own lightweight query (limit: 1)
// rather than piggybacking on useNotifications, since the page actually
// showing the list may be requesting a different page/limit.
export function useNotificationBadgeSync() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const { data } = useQuery({
    queryKey: ["notifications", "badge"],
    queryFn: () => notificationApi.getNotifications({ page: 1, limit: 1 }),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (data?.info) dispatch(setNotificationCount(data.info.unreadCount));
  }, [data?.info, dispatch]);
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      // Matches both ["notifications","list",params] and ["notifications","badge"]
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

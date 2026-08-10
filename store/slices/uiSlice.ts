"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationBadge {
  count: number;
}

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
}

interface UIState {
  sidebarOpen: boolean;
  notificationBadge: NotificationBadge;
  searchQuery: string;
  toasts: ToastItem[];
}

const initialState: UIState = {
  sidebarOpen: false,
  notificationBadge: { count: 0 },
  searchQuery: "",
  toasts: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setNotificationCount: (state, action: PayloadAction<number>) => {
      state.notificationBadge.count = action.payload;
    },
    incrementNotificationCount: (state) => {
      state.notificationBadge.count += 1;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    // ─── Toasts ───
    // Global UI state on purpose: any mutation anywhere (booking created,
    // service rejected, profile updated) needs to trigger one of these,
    // regardless of which React Query hook fired it. That's a cross-cutting
    // concern, which is exactly what Redux (not component state) is for.
    addToast: {
      reducer: (state, action: PayloadAction<ToastItem>) => {
        state.toasts.push(action.payload);
      },
      prepare: (toast: Omit<ToastItem, "id">) => ({
        payload: { ...toast, id: crypto.randomUUID() },
      }),
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setNotificationCount,
  incrementNotificationCount,
  setSearchQuery,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;

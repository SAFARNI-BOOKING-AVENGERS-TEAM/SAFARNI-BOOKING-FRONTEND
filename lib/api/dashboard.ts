"use client";

import { apiClient } from "./client";
import type { ApiResponse } from "@/types";

export interface StatusCount {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface AdminDashboardStats {
  users: {
    total: number;
    byRole: { user: number; provider: number; admin: number };
  };
  services: {
    hotels: StatusCount;
    cars: StatusCount;
    flights: StatusCount;
    tours: StatusCount;
    packages: StatusCount;
    esimPlans: StatusCount;
  };
  bookings: {
    byCategory: Array<{ _id: string; totalBookings: number }>;
    byStatus: Array<{ _id: string; count: number; totalBookings?: number }>;
    revenueByCategory: Array<{ _id: string; revenue?: number; totalRevenue?: number }>;
  };
  esim: { completedOrders: number; revenue: number };
  payments: { totalConfirmedRevenue: number };
}

export interface ProviderDashboardStats {
  services: {
    hotels: StatusCount;
    cars: StatusCount;
    flights: StatusCount;
    tours: StatusCount;
    esimPlans: StatusCount;
  };
  bookings: {
    total: number;
    totalRevenue: number;
    byStatus: { pending: number; confirmed: number; cancelled: number };
  };
  esim: {
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    failedOrders: number;
    revenue: number;
  };
  revenue: {
    travel: number;
    esim: number;
    total: number;
  };
}

export const dashboardApi = {
  getAdminStats: async () => {
    const res = await apiClient.get<ApiResponse<AdminDashboardStats>>("/admin/dashboard/stats");
    return res.data;
  },
  getProviderStats: async () => {
    const res = await apiClient.get<ApiResponse<ProviderDashboardStats>>("/provider/dashboard/stats");
    return res.data;
  },
};

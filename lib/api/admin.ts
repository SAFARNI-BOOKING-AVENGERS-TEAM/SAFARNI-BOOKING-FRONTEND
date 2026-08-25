"use client";

import { apiClient } from "./client";
import type { ApiResponse, UserRole, ProviderType } from "@/types";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  providerType?: ProviderType;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface Paginated<T> {
  items: T[];
  pagination: Pagination;
}

export interface AdminService extends Record<string, any> {
  _id: string;
  serviceType: "hotels" | "cars" | "flights" | "tours" | "packages" | "esim";
  status?: "pending" | "approved" | "rejected";
  createdAt?: string;
}

export interface AdminBooking {
  _id: string;
  userId?: { _id?: string; name?: string; email?: string } | string;
  category: "tours" | "flights" | "cars" | "hotels";
  itemId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export interface AuditLog {
  _id: string;
  userEmail: string;
  method: string;
  path: string;
  statusCode: number;
  success: boolean;
  createdAt: string;
}

const params = (values: Record<string, string | number | undefined>) => ({
  params: Object.fromEntries(Object.entries(values).filter(([, value]) => value !== undefined && value !== "")),
});

export const adminApi = {
  getUsers: async (filters: { search?: string; role?: string; verified?: string; page?: number } = {}) => {
    const res = await apiClient.get<ApiResponse<Paginated<AdminUser>>>("/admin/users", params(filters));
    return res.data;
  },
  updateUserRole: async (id: string, role: UserRole, providerType?: ProviderType) => {
    const res = await apiClient.patch<ApiResponse<AdminUser>>(`/admin/users/${id}/role`, { role, providerType });
    return res.data;
  },
  getServices: async (filters: { type?: string; status?: string } = {}) => {
    const res = await apiClient.get<ApiResponse<AdminService[]>>("/admin/services", params(filters));
    return res.data;
  },
  updateServiceStatus: async (type: string, id: string, status: "pending" | "approved" | "rejected") => {
    const res = await apiClient.patch<ApiResponse<AdminService>>(`/admin/services/${type}/${id}/status`, { status });
    return res.data;
  },
  getBookings: async (filters: { category?: string; status?: string; page?: number } = {}) => {
    const res = await apiClient.get<ApiResponse<Paginated<AdminBooking>>>("/admin/bookings", params(filters));
    return res.data;
  },
  updateBookingStatus: async (id: string, status: "pending" | "confirmed" | "cancelled") => {
    const res = await apiClient.patch<ApiResponse<AdminBooking>>(`/admin/bookings/${id}/status`, { status });
    return res.data;
  },
  getAuditLogs: async (filters: { search?: string; method?: string; success?: string; page?: number } = {}) => {
    const res = await apiClient.get<ApiResponse<Paginated<AuditLog>>>("/admin/audit-logs", params(filters));
    return res.data;
  },
};
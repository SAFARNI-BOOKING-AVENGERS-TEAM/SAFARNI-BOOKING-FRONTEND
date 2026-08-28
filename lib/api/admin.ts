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

export interface AdminService {
  _id: string;
  serviceType: "hotels" | "cars" | "flights" | "tours" | "packages" | "esim";
  status?: "pending" | "approved" | "rejected";
  createdAt?: string;
  name?: string;
  title?: string;
  hotelName?: string;
  model?: string;
  flightNumber?: string;
  planName?: string;
  city?: string;
  location?: string;
  airline?: string;
  brand?: string;
  destination?: string;
  country?: string;
  providerName?: string;
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

export type CommissionStatus = "pending" | "earned" | "reversal_pending" | "reversed";

export interface AdminCommissionRecord {
  _id: string;
  bookingId: string;
  packageBookingId?: string;
  paymentId: string;
  providerId: { _id: string; name?: string; email?: string } | string;
  category: "tours" | "flights" | "cars" | "hotels";
  grossAmount: number;
  commissionRatePercent: number;
  commissionAmount: number;
  providerNetAmount: number;
  currency: string;
  bookingEndDate: string;
  status: CommissionStatus;
  recognizedAt?: string;
  reversedAt?: string;
  stripeRefundId?: string;
  refundAmount?: number;
  createdAt: string;
  updatedAt: string;
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

export interface StripeDiagnostics {
  configured: boolean;
  reachable: boolean;
  mode: "test" | "live" | "unknown" | "not_configured";
  webhookConfigured: boolean;
  message: string;
}

export interface AISearchDiagnostics {
  aiConfigured: boolean;
  aiModel: string;
  n8nConfigured: boolean;
  webhookSecretConfigured: boolean;
  cacheTtlSeconds: number;
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
  getProviders: async () => {
    const res = await apiClient.get<ApiResponse<AdminUser[]>>("/auth/service-providers");
    return res.data;
  },
  createProvider: async (data: { name: string; email: string; password: string; providerType: ProviderType }) => {
    const res = await apiClient.post<ApiResponse<AdminUser>>("/auth/service-providers", data);
    return res.data;
  },
  updateProvider: async (id: string, data: { name?: string; email?: string; providerType?: ProviderType }) => {
    const res = await apiClient.patch<ApiResponse<AdminUser>>(`/auth/service-providers/${id}`, data);
    return res.data;
  },
  deleteProvider: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(`/auth/service-providers/${id}`);
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
  getCommissions: async (filters: { status?: CommissionStatus | ""; providerId?: string; page?: number } = {}) => {
    const res = await apiClient.get<ApiResponse<Paginated<AdminCommissionRecord>>>("/admin/commissions", params(filters));
    return res.data;
  },
  getAuditLogs: async (filters: { search?: string; method?: string; success?: string; page?: number } = {}) => {
    const res = await apiClient.get<ApiResponse<Paginated<AuditLog>>>("/admin/audit-logs", params(filters));
    return res.data;
  },
  getStripeStatus: async () => {
    const res = await apiClient.get<ApiResponse<StripeDiagnostics>>("/payments/status");
    return res.data;
  },
  getAISearchStatus: async () => {
    const res = await apiClient.get<ApiResponse<AISearchDiagnostics>>("/ai-search/status");
    return res.data;
  },
};

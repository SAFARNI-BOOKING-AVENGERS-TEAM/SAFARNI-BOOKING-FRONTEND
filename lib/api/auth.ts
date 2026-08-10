"use client";

import { apiClient } from "./client";
import type { LoginCredentials, RegisterCredentials, ApiResponse, AuthResponse } from "@/types";

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const res = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", credentials);
    return res.data;
  },

  register: async (data: RegisterCredentials) => {
    const res = await apiClient.post<ApiResponse<{ id: string; name: string; email: string; isVerified: boolean; createdAt: string }>>("/auth/signup", data);
    return res.data;
  },

  logout: async () => {
    const res = await apiClient.post<ApiResponse<null>>("/auth/logout");
    return res.data;
  },

  refreshToken: async () => {
    const res = await apiClient.post<ApiResponse<null>>("/auth/refresh-token");
    return res.data;
  },

  verifyEmail: async (token: string) => {
    const res = await apiClient.post<ApiResponse<null>>(`/auth/verify-email/${token}`);
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await apiClient.post<ApiResponse<string>>("/auth/forgot-password/request", { email });
    return res.data;
  },

  resetPassword: async (token: string, password: string, confirmPassword: string) => {
    const res = await apiClient.post<ApiResponse<null>>(`/auth/forgot-password/confirm/${token}`, {
      password,
      confirmPassword,
    });
    return res.data;
  },
};
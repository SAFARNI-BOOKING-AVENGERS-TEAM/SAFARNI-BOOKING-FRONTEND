"use client";

import { apiClient } from "./client";
import type { ApiResponse, User } from "@/types";

export const usersApi = {
  getProfile: async () => {
    const res = await apiClient.get<ApiResponse<User>>("/users/my-profile");
    return res.data;
  },

  updateProfile: async (data: { name?: string; email?: string }) => {
    const res = await apiClient.patch<ApiResponse<{ user: Partial<User> }>>("/users/update-profile-info", data);
    return res.data;
  },

  uploadAvatar: async (formData: FormData) => {
    const res = await apiClient.post<ApiResponse<{ profilePicture: { url: string; publicId: string } }>>(
      "/users/upload-profile-picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  },
};
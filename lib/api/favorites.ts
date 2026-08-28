"use client";

import { apiClient } from "./client";
import type { ApiResponse, FavoriteCategory, FavoriteListItem } from "@/types";

export const favoriteApi = {
  getFavorites: async () => {
    const res = await apiClient.get<ApiResponse<FavoriteListItem[]>>("/favorites");
    return res.data;
  },

  addFavorite: async (category: FavoriteCategory, itemId: string) => {
    const res = await apiClient.post<ApiResponse<unknown>>("/favorites", { category, itemId });
    return res.data;
  },

  removeFavorite: async (category: FavoriteCategory, itemId: string) => {
    const res = await apiClient.delete<ApiResponse<null>>(`/favorites/${category}/${itemId}`);
    return res.data;
  },
};

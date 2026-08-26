"use client";

import { apiClient } from "./client";
import type { ApiResponse } from "@/types";
import type { AIFlightSearchResponse } from "@/types/ai-search";

export const aiSearchApi = {
  searchFlights: async (prompt: string) => {
    const res = await apiClient.post<ApiResponse<AIFlightSearchResponse>>("/ai-search/flights", { prompt });
    return res.data;
  },
};

"use client";

import { AxiosError } from "axios";
import type { ApiError } from "@/types";

/**
 * Safely extracts the error message from an Axios error.
 * Use this in all mutation error handlers to avoid TypeScript issues.
 */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiError | undefined;
    return data?.message || error.message || "Something went wrong";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
}
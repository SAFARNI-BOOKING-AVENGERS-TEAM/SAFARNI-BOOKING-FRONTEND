"use client";

import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // sends httpOnly cookies automatically
});

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/tours",
  "/hotels",
  "/cars",
  "/flights",
  "/packages",
  "/esim",
  "/search",
];

function isPublicBrowserPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

// Request interceptor — can add headers if needed
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 with token refresh rotation
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt token refresh — backend rotates refreshTokenVersion.
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Retry original request with the newly rotated access_token cookie.
        return apiClient(originalRequest);
      } catch (refreshError) {
        // A logged-out visitor may legitimately trigger a 401 while a public
        // page probes for the current session. Never reload/redirect a public
        // page in that case; doing so on /login creates an infinite reload loop.
        if (typeof window !== "undefined" && !isPublicBrowserPath(window.location.pathname)) {
          const returnTo = `${window.location.pathname}${window.location.search}`;
          window.location.replace(`/login?redirect=${encodeURIComponent(returnTo)}`);
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
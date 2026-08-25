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

const AUTH_ENDPOINTS_WITHOUT_REFRESH = [
  "/auth/login",
  "/auth/signup",
  "/auth/refresh-token",
  "/auth/logout",
  "/auth/forgot-password",
  "/auth/verify-email",
];

function isPublicBrowserPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function isAuthEndpointWithoutRefresh(url?: string): boolean {
  if (!url) return false;
  return AUTH_ENDPOINTS_WITHOUT_REFRESH.some(
    (path) => url === path || url.startsWith(`${path}/`)
  );
}

// Request interceptor — can add headers if needed
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor — refresh an expired authenticated session, but never
// intercept authentication endpoints themselves. A failed login is a real
// login error, not a signal to refresh an older session cookie.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url as string | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpointWithoutRefresh(requestUrl)
    ) {
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
        // Public pages must never be reload-looped because an optional session
        // probe found stale or missing cookies.
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

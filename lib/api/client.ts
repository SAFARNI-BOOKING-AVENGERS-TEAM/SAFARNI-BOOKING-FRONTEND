"use client";

import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // sends httpOnly cookies automatically
});

// Request interceptor — can add headers if needed
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Requests to these endpoints failing with 401 should never trigger a
// "try to refresh the token" attempt — if /auth/refresh-token itself is
// what failed, or a login/signup call somehow came back 401, retrying a
// refresh makes no sense and only adds noise.
const AUTH_ENDPOINTS = ["/auth/login", "/auth/signup", "/auth/refresh-token", "/auth/logout"];

// Public-ish pages where a guest is expected to have no session. If we're
// already sitting on one of these, don't force another redirect there —
// that's exactly what turns "not logged in" into an infinite reload loop.
function isOnPublicAuthPage() {
  if (typeof window === "undefined") return false;
  return window.location.pathname.startsWith("/login");
}

// Response interceptor — handle 401 with token refresh rotation
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl: string = originalRequest?.url || "";
    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => requestUrl.includes(path));

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        // Attempt token refresh — backend rotates refreshTokenVersion.
        // Uses the raw axios instance (not apiClient) so this call itself
        // isn't subject to this same interceptor.
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        // Retry original request with new access_token cookie
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed — there's genuinely no session. Only bounce to
        // /login if we're not already there; otherwise this becomes the
        // reload loop this guard exists to prevent.
        if (typeof window !== "undefined" && !isOnPublicAuthPage()) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
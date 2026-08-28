"use client";

import { usePathname } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { setUser, clearUser } from "@/store/slices/authSlice";
import { authApi } from "@/lib/api/auth";
import { usersApi } from "@/lib/api/users";
import type { LoginCredentials, RegisterCredentials, User } from "@/types";

const AUTH_ENTRY_PATHS = ["/login", "/register", "/forgot-password"];

function shouldSkipProfileBootstrap(pathname: string): boolean {
  return (
    AUTH_ENTRY_PATHS.includes(pathname) ||
    pathname.startsWith("/reset-password/") ||
    pathname.startsWith("/verify-email/")
  );
}

function toSessionUser(user: Awaited<ReturnType<typeof authApi.login>>["data"]["user"]): User {
  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    providerType: user.providerType,
    isVerified: user.isVerified,
    profilePicture: user.profilePicture,
  };
}

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  // Fetch current user on pages where session-aware UI is useful. Auth entry
  // pages intentionally skip this probe so logged-out visitors don't create a
  // pointless 401 -> refresh attempt before they have even submitted the form.
  const { isLoading: isProfileLoading } = useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      try {
        const res = await usersApi.getProfile();
        dispatch(setUser(res.data));
        return res.data;
      } catch {
        dispatch(clearUser());
        return null;
      }
    },
    enabled: !shouldSkipProfileBootstrap(pathname),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  // Login mutation
  const login = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (res) => {
      // Backend returns a compact session user in the login response, so map
      // its `id` field to the `_id` shape used by the frontend store.
      if (res.data?.user) {
        dispatch(setUser(toSessionUser(res.data.user)));
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  // Register mutation
  const register = useMutation({
    mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
  });

  // Logout mutation
  const logout = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      dispatch(clearUser());
      queryClient.clear();
      // Full reload is intentional here so every in-memory client store is reset after logout.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/login";
    },
  });

  // Combined loading state. Disabled profile queries are not loading.
  const loading = isLoading || isProfileLoading;

  return {
    user,
    isAuthenticated,
    isLoading: loading,
    role: user?.role ?? null,
    providerType: user?.providerType ?? null,
    login,
    register,
    logout,
  };
}

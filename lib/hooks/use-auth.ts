"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store";
import { setUser, clearUser, setLoading } from "@/store/slices/authSlice";
import { authApi } from "@/lib/api/auth";
import { usersApi } from "@/lib/api/users";
import type { LoginCredentials, RegisterCredentials } from "@/types";

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  // Fetch current user on mount — syncs Redux with server state
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
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  // Login mutation
  const login = useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      // Backend returns user in login response — no need for extra fetch
      if (res.data?.user) {
        dispatch(setUser(res.data.user as any));
      }
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  // Register mutation
  const register = useMutation({
    mutationFn: authApi.register,
  });

  // Logout mutation
  const logout = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      dispatch(clearUser());
      queryClient.clear();
      window.location.href = "/login";
    },
  });

  // Combined loading state
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
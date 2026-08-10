"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { updateUser } from "@/store/slices/authSlice";
import { usersApi } from "@/lib/api/users";

export function useUser() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const res = await usersApi.getProfile();
      return res.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const updateProfile = useMutation({
    mutationFn: usersApi.updateProfile,
    onSuccess: (res) => {
      if (res.data?.user) {
        dispatch(updateUser(res.data.user));
      }
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });

  const uploadAvatar = useMutation({
    mutationFn: usersApi.uploadAvatar,
    onSuccess: (res) => {
      if (res.data?.profilePicture) {
        dispatch(updateUser({ profilePicture: res.data.profilePicture }));
      }
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
  });

  return {
    user: profileQuery.data ?? null,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    updateProfile,
    uploadAvatar,
  };
}
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { favoriteApi } from "@/lib/api/favorites";
import type { FavoriteCategory, FavoriteListItem } from "@/types";

// Gated on isAuthenticated (via Redux, not useAuth — no need to pull in
// useAuth's own profile-fetch-on-mount just for a boolean check here) so
// guests browsing public pages never fire a doomed 401 request per card.
export function useFavorites() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  return useQuery({
    queryKey: ["favorites"],
    queryFn: () => favoriteApi.getFavorites(),
    enabled: isAuthenticated,
  });
}

interface FavoriteMutationVars {
  category: FavoriteCategory;
  itemId: string;
}

type FavoritesCache = { data: FavoriteListItem[] } | undefined;

// Optimistic add/remove: the heart flips instantly and reconciles with the
// server after. This is the right call specifically because a failed
// favorite toggle is low-stakes and instantly visible/undoable — the UI
// shouldn't make someone wait on a round trip for something this small.
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: ({ category, itemId }: FavoriteMutationVars) =>
      favoriteApi.addFavorite(category, itemId),
    onMutate: async ({ category, itemId }) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const previous = queryClient.getQueryData<FavoritesCache>(["favorites"]);
      queryClient.setQueryData<FavoritesCache>(["favorites"], (old) =>
        old
          ? {
              ...old,
              data: [
                {
                  favoriteId: `optimistic-${itemId}`,
                  category,
                  itemId,
                  addedAt: new Date().toISOString(),
                  item: null,
                },
                ...old.data,
              ],
            }
          : old
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(["favorites"], context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  const removeMutation = useMutation({
    mutationFn: ({ category, itemId }: FavoriteMutationVars) =>
      favoriteApi.removeFavorite(category, itemId),
    onMutate: async ({ category, itemId }) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const previous = queryClient.getQueryData<FavoritesCache>(["favorites"]);
      queryClient.setQueryData<FavoritesCache>(["favorites"], (old) =>
        old
          ? { ...old, data: old.data.filter((f) => !(f.category === category && f.itemId === itemId)) }
          : old
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(["favorites"], context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  return { addMutation, removeMutation };
}

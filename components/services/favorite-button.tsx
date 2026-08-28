"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useFavorites, useToggleFavorite } from "@/lib/hooks/use-favorites";
import { useToast } from "@/lib/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/api/error";
import { cn } from "@/lib/utils";
import type { FavoriteCategory } from "@/types";

interface FavoriteButtonProps {
  category: FavoriteCategory;
  itemId: string;
  className?: string;
  size?: number;
}

export default function FavoriteButton({ category, itemId, className, size = 18 }: FavoriteButtonProps) {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { data } = useFavorites();
  const { addMutation, removeMutation } = useToggleFavorite();
  const toast = useToast();

  const isFavorited = !!data?.data.some((f) => f.category === category && f.itemId === itemId);
  const isPending = addMutation.isPending || removeMutation.isPending;

  const handleClick = (e: React.MouseEvent) => {
    // Cards wrap this button in a <Link> — stop the click from navigating.
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (isFavorited) {
      removeMutation.mutate(
        { category, itemId },
        { onError: (err) => toast.error("Couldn't remove favorite", getApiErrorMessage(err)) }
      );
    } else {
      addMutation.mutate(
        { category, itemId },
        { onError: (err) => toast.error("Couldn't add favorite", getApiErrorMessage(err)) }
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-sm transition-colors disabled:opacity-60",
        className
      )}
    >
      <Heart size={size} className={isFavorited ? "fill-red-500 text-red-500" : "text-gray-500"} />
    </button>
  );
}

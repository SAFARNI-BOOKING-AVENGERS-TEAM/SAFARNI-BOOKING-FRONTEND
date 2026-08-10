import type { Hotel, Car, Flight, Tour } from "./service";

// Only these four categories are favoritable — favorite.controller.ts's
// modelsByCategory map has no entry for packages or esim.
export type FavoriteCategory = "tours" | "hotels" | "cars" | "flights";

// Matches what GET /favorites actually returns (favoriteId/addedAt, no
// userId) — not the same shape as the Favorite/FavoriteWithItem interfaces
// this file used to have, which were written before we had the real backend.
export interface FavoriteListItem {
  favoriteId: string;
  category: FavoriteCategory;
  itemId: string;
  addedAt: string;
  item: Hotel | Car | Flight | Tour | null; // null if the item was later deleted
}

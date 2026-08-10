import type { Hotel, Room, Package, Tour, Car, Flight } from "./service";
import type { Pagination } from "./api";
import type { BookingCategory, Booking } from "./booking";

// The hotel module's GET routes bypass the shared successResponse() helper
// and hand-roll their own response shape — no `message`/`statusCode`,
// and a top-level `count`. Every other module uses ApiResponse/PaginatedResponse.
export interface HotelListApiResponse {
  success: boolean;
  count: number;
  pagination: Pagination;
  data: Hotel[];
}

export interface HotelDetailApiResponse {
  success: boolean;
  data: {
    hotel: Hotel;
    rooms: Room[];
  };
}

// GET /tours/:id/reviews populates userId -> { _id, name }.
// POST/DELETE .../reviews return the raw (unpopulated) array instead.
export interface PopulatedTourReviewUser {
  _id: string;
  name: string;
}

export interface PopulatedTourReview {
  _id?: string;
  userId: PopulatedTourReviewUser | null;
  rating: number;
  comment?: string;
}

export interface TourReviewsData {
  reviews: PopulatedTourReview[];
  averageRating: number;
  totalReviews: number;
}

export interface RawTourReview {
  _id?: string;
  userId: string;
  rating: number;
  comment?: string;
}

// GET /packages/:id resolves each bundled item's underlying document
export interface PackageResolvedItem {
  category: BookingCategory;
  itemId: string;
  order: number;
  room?: Room;
  hotel?: Hotel;
  item?: Tour | Car | Flight;
}

export interface PackagePricing {
  estimatedOriginalPrice: number;
  discountPercentage: number;
  estimatedSavings: number;
  estimatedFinalPrice: number;
  note: string;
}

export interface PackageDetailsData {
  package: Package;
  items: PackageResolvedItem[];
  pricing: PackagePricing;
}

// POST /packages/:id/book books every item back-to-back and returns all
// the resulting bookings together under one packageBookingId.
export interface PackageBookingResult {
  packageBookingId: string;
  bookings: Booking[];
}

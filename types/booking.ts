export type BookingCategory = "hotels" | "tours" | "flights" | "cars";
export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  _id: string;
  userId: string;
  category: BookingCategory;
  itemId: string;
  packageBookingId?: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  details?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface BookingInput {
  category: BookingCategory;
  itemId: string;
  startDate: string;
  endDate: string;
  details?: Record<string, any>;
}

export interface PackageBookingInput {
  items: {
    category: BookingCategory;
    itemId: string;
    startDate: string;
    endDate: string;
    details?: Record<string, any>;
  }[];
}
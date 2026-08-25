export type ServiceStatus = "pending" | "approved" | "rejected";
export type ServiceCategory = "hotels" | "cars" | "flights" | "tours" | "packages" | "esim";

export interface BaseService {
  _id: string;
  status: ServiceStatus;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface HotelLocation { city?: string; address?: string; lat?: number; lng?: number; }
export interface HotelGalleryItem { url: string; publicId: string; }
export interface HotelPolicies { checkIn?: string; checkOut?: string; cancellation?: string; }
export interface Hotel extends BaseService {
  name: string; description?: string; rating: number; location: HotelLocation; amenities: string[];
  gallery: HotelGalleryItem[]; policies: HotelPolicies;
}

export interface RoomOccupancy { adults: number; children: number; }
export interface Room {
  _id: string; hotelId: string; name: string; occupancy: RoomOccupancy; pricePerNight: number;
  refundable: boolean; amenities?: string[]; createdAt: string; updatedAt: string;
}

export type CarType = "SUV" | "Sedan" | "Hatchback" | "Convertible" | "Luxury";
export type TransmissionType = "Automatic" | "Manual";
export type FuelType = "Petrol" | "Diesel" | "Electric" | "Hybrid";
export interface CarLocation { city: string; address?: string; }
export interface Car extends BaseService {
  brand: string; model: string; year?: number; type: CarType; transmission: TransmissionType; fuelType: FuelType;
  seats: number; pricePerDay: number; available: boolean; location: CarLocation; image?: string;
}

export type FlightClass = "Economy" | "Business" | "First";
export interface Flight extends BaseService {
  airline: string; flightNumber: string; departureAirport: string; arrivalAirport: string;
  departureTime: string; arrivalTime: string; price: number; availableSeats: number; class: FlightClass;
}

export interface TourLocation { name: string; country: string; city?: string; }
export interface TourPriceTier { type: string; price: number; }
export interface TourStartDate { date: string; capacity: number; }
export interface TourProviderInfo { name: string; contact?: string; }
export interface TourReview { userId: string; rating: number; comment?: string; }
export interface Tour extends BaseService {
  title: string; slug: string; summary: string; fullDescription?: string; mainImage: string; gallery?: string[];
  startDates?: TourStartDate[]; duration: string; highlights?: string[]; activities?: string[]; locations: TourLocation[];
  priceTiers: TourPriceTier[]; inclusiveItems?: string[]; exclusiveItems?: string[]; cancellationPolicy?: string;
  languages: string[]; difficulty?: string; providerInfo: TourProviderInfo; reviews: TourReview[]; tags?: string[]; recommended: boolean;
}

export type PackageType = "family" | "couples" | "luxury" | "budget" | "adventure" | "business";
export type PackageSourceType = "provider" | "curated";
export interface PackageItem { category: "hotels" | "tours" | "flights" | "cars"; itemId: string; order: number; }
export interface Package extends BaseService {
  title: string; description?: string; coverImage?: string; gallery?: string[]; country?: string; cities?: string[]; tags?: string[];
  packageType?: PackageType; durationLabel?: string; items: PackageItem[]; discountPercentage: number; estimatedOriginalPrice: number;
  featured: boolean; validUntil?: string; sourceType: PackageSourceType;
}

export type DataUnit = "MB" | "GB" | "Unlimited";
export interface ESIMPlan extends BaseService {
  name: string; country: string; region?: string; dataAmount: number; dataUnit: DataUnit;
  validityDays: number; price: number; currency: string;
}

export type ESIMOrderStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";
export type ESIMPaymentStatus = "unpaid" | "pending" | "succeeded" | "failed";
export type ESIMProfileStatus = "ready" | "activated" | "expired" | "suspended";
export interface ESIMProfile {
  iccid: string;
  activationCode: string;
  qrCode: string;
  smdpAddress: string;
  status: ESIMProfileStatus;
  expiresAt?: string;
}
export interface ESIMOrder {
  _id: string;
  userId: string;
  planId: ESIMPlan | string;
  status: ESIMOrderStatus;
  paymentStatus: ESIMPaymentStatus;
  price: number;
  currency: string;
  packageBookingId?: string;
  profile?: ESIMProfile;
  createdAt: string;
  updatedAt: string;
}

export type Service = Hotel | Car | Flight | Tour | Package | ESIMPlan;

export interface ServiceMeta {
  key: ServiceCategory;
  label: string;
  pluralLabel: string;
  icon: string;
  detailRoute: string;
}

export const SERVICE_META: Record<Exclude<ServiceCategory, "esim">, ServiceMeta> = {
  hotels: { key: "hotels", label: "Hotel", pluralLabel: "Hotels", icon: "Building2", detailRoute: "/hotels" },
  cars: { key: "cars", label: "Car", pluralLabel: "Cars", icon: "Car", detailRoute: "/cars" },
  flights: { key: "flights", label: "Flight", pluralLabel: "Flights", icon: "Plane", detailRoute: "/flights" },
  tours: { key: "tours", label: "Tour", pluralLabel: "Tours", icon: "MapPin", detailRoute: "/tours" },
  packages: { key: "packages", label: "Package", pluralLabel: "Packages", icon: "Package", detailRoute: "/packages" },
};

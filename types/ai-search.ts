export type AISearchStatus = "needs_input" | "results";

export interface AIFlightIntent {
  from: string | null;
  to: string | null;
  departureDate: string | null;
  adults: number;
  children: number;
  infants: number;
  cabinClass: "Economy" | "Business" | "First" | "Premium_Economy";
  currency: string;
  limit: number;
  nonstopOnly: boolean;
  summary: string;
  missingFields: string[];
}

export interface AIFlightResult {
  rank: number;
  itineraryId: string;
  price: number;
  currency: string;
  priceStatus: string | null;
  quoteAgeMinutes: number | null;
  departure: string | null;
  arrival: string | null;
  durationMinutes: number | null;
  stops: number | null;
  airlineName: string | null;
  airlineCode: string | null;
  flightNumber: string | null;
  bookingUrl: string | null;
}

export interface AIFlightSearchResponse {
  status: AISearchStatus;
  intent: AIFlightIntent;
  results: AIFlightResult[];
  source: string;
  cached: boolean;
  searchedAt?: string;
}

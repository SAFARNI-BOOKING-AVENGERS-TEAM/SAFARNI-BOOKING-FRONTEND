export type BookingType   = "FLIGHT" | "HOTEL" | "TOUR" | "CAR"
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"

export interface Flight {
  id:          string
  airline:     string
  logo:        string
  from:        string
  to:          string
  fromCity:    string
  toCity:      string
  departure:   string
  arrival:     string
  duration:    number
  stops:       number
  price:       number
  class:       "Economy" | "Business" | "First"
  seats:       number
  rating:      number
}

export interface Hotel {
  id:           string
  name:         string
  city:         string
  country:      string
  image:        string
  images:       string[]
  stars:        number
  rating:       number
  reviewCount:  number
  pricePerNight: number
  amenities:    string[]
  description:  string
  address:      string
  latitude:     number
  longitude:    number
}

export interface Tour {
  id:          string
  name:        string
  destination: string
  country:     string
  image:       string
  images:      string[]
  duration:    number
  groupSize:   number
  price:       number
  rating:      number
  reviewCount: number
  category:    string
  includes:    string[]
  description: string
  highlights:  string[]
  difficulty:  "Easy" | "Moderate" | "Hard"
}

export interface Car {
  id:           string
  brand:        string
  model:        string
  image:        string
  type:         "Economy" | "Compact" | "SUV" | "Luxury" | "Van"
  transmission: "Automatic" | "Manual"
  seats:        number
  pricePerDay:  number
  features:     string[]
  location:     string
  rating:       number
}

export interface SearchParams {
  from?:       string
  to?:         string
  checkIn?:    string
  checkOut?:   string
  passengers?: number
  guests?:     number
  type?:       string
}

export interface Booking {
  id:         string
  type:       BookingType
  status:     BookingStatus
  totalPrice: number
  details:    any
  createdAt:  string
}
import type { ProfilePicture, ProviderType, UserRole } from "./user";

export interface ApiResponse<T = unknown> {
  message: string;
  statusCode: number;
  data: T;
  info?: string | object;
}

export interface PaginatedResponse<T = unknown> {
  message: string;
  statusCode: number;
  data: T[];
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
  cause?: unknown;
  stack?: string;
}

// ─── Query params shared across listing endpoints ───
export interface ListQueryParams {
  page?: number;
  limit?: number;
  city?: string;
  name?: string;
  title?: string;
  status?: string;
  [key: string]: unknown;
}

// ─── Auth ───
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    providerType?: ProviderType;
    isVerified: boolean;
    profilePicture?: ProfilePicture;
  };
}

// ─── Admin ───
export interface AdminDashboardStats {
  users: {
    total: number;
    byRole: {
      user: number;
      provider: number;
      admin: number;
    };
  };
  services: {
    hotels: StatusCount;
    cars: StatusCount;
    flights: StatusCount;
    tours: StatusCount;
    packages: StatusCount;
  };
  bookings: {
    byCategory: CategoryCount[];
    byStatus: StatusCountItem[];
    revenueByCategory: RevenueItem[];
  };
}

export interface StatusCount {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface CategoryCount {
  _id: string;
  totalBookings: number;
}

export interface StatusCountItem {
  _id: string;
  count: number;
}

export interface RevenueItem {
  _id: string;
  totalRevenue: number;
  totalBookings: number;
}

export interface AuditLog {
  _id: string;
  userId?: string;
  userEmail: string;
  method: string;
  path: string;
  statusCode: number;
  success: boolean;
  createdAt: string;
}

// ─── Provider ───
export interface ProviderDashboardStats {
  services: {
    hotels: StatusCount;
    cars: StatusCount;
    flights: StatusCount;
    tours: StatusCount;
  };
  bookings: {
    total: number;
    totalRevenue: number;
    byStatus: {
      pending: number;
      confirmed: number;
      cancelled: number;
    };
  };
}

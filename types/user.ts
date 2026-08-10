export type UserRole = "user" | "provider" | "admin";
export type ProviderType = "travel" | "telecom" | "both";

export interface ProfilePicture {
  url: string;
  publicId: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  providerType?: ProviderType;
  isVerified: boolean;
  profilePicture?: ProfilePicture;
  refreshTokenVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface PublicUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  providerType?: ProviderType;
  profilePicture?: ProfilePicture;
}
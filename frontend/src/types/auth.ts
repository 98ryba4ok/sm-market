// Auth types

export interface User {
  id: number;
  email: string;
  phone: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  email: string;
  phone: string;
  access: string;
  refresh: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface RefreshTokenPayload {
  refresh: string;
}

export interface LogoutPayload {
  refresh: string;
}

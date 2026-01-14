// Auth types

export interface User {
  id: number;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  full_name: string;
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

// Profile update
export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  phone?: string;
}

export interface UpdateProfileResponse {
  detail: string;
  user: User;
}

// Change email
export interface ChangeEmailPayload {
  new_email: string;
  password: string;
}

export interface ChangeEmailResponse {
  detail: string;
  email: string;
}

// Change password
export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordResponse {
  detail: string;
}

// Password reset
export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetRequestResponse {
  detail: string;
}

export interface PasswordResetConfirmPayload {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface PasswordResetConfirmResponse {
  detail: string;
}

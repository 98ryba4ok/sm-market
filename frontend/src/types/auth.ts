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
  first_name: string;
  last_name: string;
  middle_name: string;
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

// Secure email change
export interface SecureEmailChangeRequestPayload {
  new_email: string;
  password: string;
}

export interface SecureEmailChangeRequestResponse {
  detail: string;
  request_id: number;
  old_email: string;
  new_email: string;
}

export interface EmailConfirmationPayload {
  token: string;
}

export interface EmailConfirmationResponse {
  detail: string;
  status?: string;
  new_email?: string;
}

export interface EmailCancellationPayload {
  cancel_token: string;
}

export interface EmailCancellationResponse {
  detail: string;
}

export interface EmailChangeStatusResponse {
  has_pending_request: boolean;
  request?: {
    id: number;
    old_email: string;
    new_email: string;
    status: string;
    old_email_confirmed: boolean;
    new_email_confirmed: boolean;
    can_cancel_until: string;
    created_at: string;
  };
}

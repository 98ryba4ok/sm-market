// Auth API

import type {
  ChangeEmailPayload,
  ChangeEmailResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
  LoginPayload,
  LogoutPayload,
  PasswordResetConfirmPayload,
  PasswordResetConfirmResponse,
  PasswordResetRequestPayload,
  PasswordResetRequestResponse,
  RefreshTokenPayload,
  RegisterPayload,
  RegisterResponse,
  TokenResponse,
  UpdateProfilePayload,
  UpdateProfileResponse,
  User,
} from "../types/auth";

import api from "./axios";

export const authApi = {
  /**
   * Регистрация нового пользователя
   * POST /api/auth/register/
   */
  register: (data: RegisterPayload) =>
    api.post<RegisterResponse>("/auth/register/", data),

  /**
   * Вход (получение токенов)
   * POST /api/auth/login/
   */
  login: (data: LoginPayload) => api.post<TokenResponse>("/auth/login/", data),

  /**
   * Выход (добавление refresh токена в blacklist)
   * POST /api/auth/logout/
   */
  logout: (data: LogoutPayload) => api.post<void>("/auth/logout/", data),

  /**
   * Обновление access токена
   * POST /api/auth/refresh/
   */
  refresh: (data: RefreshTokenPayload) =>
    api.post<{ access: string }>("/auth/refresh/", data),

  /**
   * Получение данных текущего пользователя
   * GET /api/auth/me/
   */
  me: () => api.get<User>("/auth/me/"),

  /**
   * Обновление профиля пользователя (ФИО, телефон)
   * PATCH /api/auth/profile/update/
   */
  updateProfile: (data: UpdateProfilePayload) =>
    api.patch<UpdateProfileResponse>("/auth/profile/update/", data),

  /**
   * Смена email
   * POST /api/auth/profile/change-email/
   */
  changeEmail: (data: ChangeEmailPayload) =>
    api.post<ChangeEmailResponse>("/auth/profile/change-email/", data),

  /**
   * Смена пароля
   * POST /api/auth/profile/change-password/
   */
  changePassword: (data: ChangePasswordPayload) =>
    api.post<ChangePasswordResponse>("/auth/profile/change-password/", data),

  /**
   * Запрос на сброс пароля (отправка email)
   * POST /api/auth/password-reset/
   */
  passwordResetRequest: (data: PasswordResetRequestPayload) =>
    api.post<PasswordResetRequestResponse>("/auth/password-reset/", data),

  /**
   * Подтверждение сброса пароля с токеном
   * POST /api/auth/password-reset/confirm/
   */
  passwordResetConfirm: (data: PasswordResetConfirmPayload) =>
    api.post<PasswordResetConfirmResponse>("/auth/password-reset/confirm/", data),
};

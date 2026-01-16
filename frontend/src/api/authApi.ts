// Auth API

import type {
  ChangeEmailPayload,
  ChangeEmailResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
  EmailCancellationPayload,
  EmailCancellationResponse,
  EmailChangeStatusResponse,
  EmailConfirmationPayload,
  EmailConfirmationResponse,
  LoginPayload,
  LogoutPayload,
  PasswordResetConfirmPayload,
  PasswordResetConfirmResponse,
  PasswordResetRequestPayload,
  PasswordResetRequestResponse,
  RefreshTokenPayload,
  RegisterPayload,
  RegisterResponse,
  SecureEmailChangeRequestPayload,
  SecureEmailChangeRequestResponse,
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

  /**
   * Валидация токена взлома и отправка ссылки для сброса пароля
   * POST /api/auth/account-compromised/
   */
  validateCompromisedToken: (data: { token: string }) =>
    api.post<{ detail: string; email: string }>("/auth/account-compromised/", data),

  /**
   * Запрос на безопасную смену email (с двойным подтверждением)
   * POST /api/users/email-change/request/
   */
  secureEmailChangeRequest: (data: SecureEmailChangeRequestPayload) =>
    api.post<SecureEmailChangeRequestResponse>("/users/email-change/request/", data),

  /**
   * Подтверждение старого email
   * POST /api/users/email-change/confirm-old/
   */
  confirmOldEmail: (data: EmailConfirmationPayload) =>
    api.post<EmailConfirmationResponse>("/users/email-change/confirm-old/", data),

  /**
   * Подтверждение нового email (завершает смену)
   * POST /api/users/email-change/confirm-new/
   */
  confirmNewEmail: (data: EmailConfirmationPayload) =>
    api.post<EmailConfirmationResponse>("/users/email-change/confirm-new/", data),

  /**
   * Отмена смены email (в течение 48 часов)
   * POST /api/users/email-change/cancel/
   */
  cancelEmailChange: (data: EmailCancellationPayload) =>
    api.post<EmailCancellationResponse>("/users/email-change/cancel/", data),

  /**
   * Получение статуса текущего запроса на смену email
   * GET /api/users/email-change/status/
   */
  getEmailChangeStatus: () =>
    api.get<EmailChangeStatusResponse>("/users/email-change/status/"),
};

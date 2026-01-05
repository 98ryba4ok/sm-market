// Auth API

import api from "./axios";
import type {
  LoginPayload,
  RegisterPayload,
  TokenResponse,
  RefreshTokenPayload,
  LogoutPayload,
  User,
} from "../types/auth";

export const authApi = {
  /**
   * Регистрация нового пользователя
   * POST /api/auth/register/
   */
  register: (data: RegisterPayload) =>
    api.post<{ id: number; email: string; phone: string }>("/auth/register/", data),

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
};

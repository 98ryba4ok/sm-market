import axios from 'axios';

import type { AuthTokens, LoginCredentials, RegisterData, User } from '../types/user';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

import axiosInstance from './axios';

/**
 * Вход пользователя
 */
export const login = async (credentials: LoginCredentials): Promise<AuthTokens> => {
  const response = await axios.post<AuthTokens>(
    `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}${API_ENDPOINTS.LOGIN}`,
    credentials
  );
  
  // Сохраняем токены
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.access);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refresh);
  
  return response.data;
};

/**
 * Регистрация пользователя
 */
export const register = async (data: RegisterData): Promise<AuthTokens> => {
  const response = await axios.post<AuthTokens>(
    `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}${API_ENDPOINTS.REGISTER}`,
    data
  );
  
  // Сохраняем токены
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.access);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refresh);
  
  return response.data;
};

/**
 * Выход пользователя
 */
export const logout = async (): Promise<void> => {
  try {
    await axiosInstance.post(API_ENDPOINTS.LOGOUT);
  } finally {
    // Очищаем токены в любом случае
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
};

/**
 * Обновление access токена
 */
export const refreshToken = async (refresh: string): Promise<{ access: string }> => {
  const response = await axios.post<{ access: string }>(
    `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}${API_ENDPOINTS.TOKEN_REFRESH}`,
    { refresh }
  );
  
  return response.data;
};

/**
 * Получить профиль текущего пользователя
 */
export const getUserProfile = async (): Promise<User> => {
  const response = await axiosInstance.get<User>(API_ENDPOINTS.USER_PROFILE);
  return response.data;
};

/**
 * Обновить профиль пользователя
 */
export const updateUserProfile = async (data: Partial<User>): Promise<User> => {
  const response = await axiosInstance.patch<User>(
    API_ENDPOINTS.USER_PROFILE,
    data
  );
  return response.data;
};

/**
 * Проверка, авторизован ли пользователь
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Получить access токен
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

/**
 * Получить refresh токен
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};
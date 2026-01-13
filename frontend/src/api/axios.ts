import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  withCredentials: true, // Важно для отправки cookies (сессий)
});

// Request interceptor - добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - автоматическое обновление токена при 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Если ошибка 401 и это не запрос на refresh и запрос еще не повторялся
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh/")
    ) {
      if (isRefreshing) {
        // Если уже идет обновление токена, добавляем запрос в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // Нет refresh токена - открываем модалку логина
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Отправляем событие для открытия модалки логина
        window.dispatchEvent(new CustomEvent("openLoginModal"));
        return Promise.reject(error);
      }

      try {
        // Попытка обновить токен
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/auth/refresh/`,
          { refresh: refreshToken }
        );

        const { access } = response.data;

        localStorage.setItem("accessToken", access);

        // Обновляем токен в заголовке оригинального запроса
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }

        // Обрабатываем очередь запросов
        processQueue(null, access);

        isRefreshing = false;

        // Повторяем оригинальный запрос
        return api(originalRequest);
      } catch (refreshError) {
        // Не удалось обновить токен - очищаем данные и открываем модалку логина
        processQueue(refreshError as Error, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Отправляем событие для открытия модалки логина
        window.dispatchEvent(new CustomEvent("openLoginModal"));
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

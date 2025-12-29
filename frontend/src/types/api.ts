// Базовые типы для API ответов

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  detail?: string;
  [key: string]: any;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
// Reviews API

import api from "./axios";
import type {
  ProductReview,
  CreateReviewPayload,
  UpdateReviewPayload,
} from "../types/product";
import type { PaginatedResponse } from "../types/api";

export const reviewsApi = {
  /**
   * Получить список отзывов текущего пользователя
   * GET /api/catalog/reviews/
   */
  list: (page?: number) =>
    api.get<PaginatedResponse<ProductReview>>("/catalog/reviews/", {
      params: { page },
    }),

  /**
   * Создать отзыв
   * POST /api/catalog/reviews/
   */
  create: (data: CreateReviewPayload) =>
    api.post<ProductReview>("/catalog/reviews/", data),

  /**
   * Получить отзыв по ID
   * GET /api/catalog/reviews/{id}/
   */
  retrieve: (id: number) => api.get<ProductReview>(`/catalog/reviews/${id}/`),

  /**
   * Обновить отзыв (полное обновление)
   * PUT /api/catalog/reviews/{id}/
   */
  update: (id: number, data: CreateReviewPayload) =>
    api.put<ProductReview>(`/catalog/reviews/${id}/`, data),

  /**
   * Частичное обновление отзыва
   * PATCH /api/catalog/reviews/{id}/
   */
  partialUpdate: (id: number, data: UpdateReviewPayload) =>
    api.patch<ProductReview>(`/catalog/reviews/${id}/`, data),

  /**
   * Удалить отзыв
   * DELETE /api/catalog/reviews/{id}/
   */
  delete: (id: number) => api.delete<void>(`/catalog/reviews/${id}/`),
};

import type { PaginatedResponse } from '../types/api';
import type { Review } from '../types/product';
import { API_ENDPOINTS } from '../utils/constants';

import axiosInstance from './axios';

/**
 * Получить отзывы
 */
export const fetchReviews = async (
  params?: {
    product?: number;
    page?: number;
  }
): Promise<PaginatedResponse<Review>> => {
  const response = await axiosInstance.get<PaginatedResponse<Review>>(
    API_ENDPOINTS.REVIEWS,
    { params }
  );
  return response.data;
};

/**
 * Создать отзыв
 */
export const createReview = async (data: {
  product: number;
  rating: number;
  comment: string;
}): Promise<Review> => {
  const response = await axiosInstance.post<Review>(
    API_ENDPOINTS.REVIEWS,
    data
  );
  return response.data;
};

/**
 * Обновить отзыв
 */
export const updateReview = async (
  id: number,
  data: {
    rating?: number;
    comment?: string;
  }
): Promise<Review> => {
  const response = await axiosInstance.patch<Review>(
    API_ENDPOINTS.REVIEW_DETAIL(id),
    data
  );
  return response.data;
};

/**
 * Удалить отзыв
 */
export const deleteReview = async (id: number): Promise<void> => {
  await axiosInstance.delete(API_ENDPOINTS.REVIEW_DETAIL(id));
};
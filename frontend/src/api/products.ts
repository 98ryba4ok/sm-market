import type { PaginatedResponse } from '../types/api';
import type { Product, ProductsParams, Review } from '../types/product';
import { API_ENDPOINTS } from '../utils/constants';

import axiosInstance from './axios';

/**
 * Получить список продуктов с фильтрацией и пагинацией
 */
export const fetchProducts = async (
  params?: ProductsParams
): Promise<PaginatedResponse<Product>> => {
  const response = await axiosInstance.get<PaginatedResponse<Product>>(
    API_ENDPOINTS.PRODUCTS,
    { params }
  );
  return response.data;
};

/**
 * Получить продукт по ID
 */
export const fetchProductById = async (id: number): Promise<Product> => {
  const response = await axiosInstance.get<Product>(
    API_ENDPOINTS.PRODUCT_DETAIL(id)
  );
  return response.data;
};

/**
 * Поиск продуктов
 */
export const searchProducts = async (
  query: string,
  params?: Omit<ProductsParams, 'search'>
): Promise<PaginatedResponse<Product>> => {
  const response = await axiosInstance.get<PaginatedResponse<Product>>(
    API_ENDPOINTS.PRODUCTS,
    {
      params: {
        ...params,
        search: query,
      },
    }
  );
  return response.data;
};

/**
 * Получить отзывы продукта
 */
export const fetchProductReviews = async (
  productId: number,
  page?: number
): Promise<PaginatedResponse<Review>> => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.PRODUCT_REVIEWS(productId),
    {
      params: { page },
    }
  );
  return response.data;
};

/**
 * Увеличить счетчик просмотров продукта
 */
export const incrementProductViews = async (id: number): Promise<void> => {
  await axiosInstance.post(`${API_ENDPOINTS.PRODUCT_DETAIL(id)}increment_views/`);
};
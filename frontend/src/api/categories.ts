import type { PaginatedResponse } from '../types/api';
import type { Category, Product } from '../types/product';
import { API_ENDPOINTS } from '../utils/constants';

import axiosInstance from './axios';

/**
 * Получить список всех категорий
 */
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get<PaginatedResponse<Category>>(
    API_ENDPOINTS.CATEGORIES
  );
  return response.data.results;
};

/**
 * Получить категорию по ID
 */
export const fetchCategoryById = async (id: number): Promise<Category> => {
  const response = await axiosInstance.get<Category>(
    API_ENDPOINTS.CATEGORY_DETAIL(id)
  );
  return response.data;
};

/**
 * Получить продукты категории
 */
export const fetchCategoryProducts = async (
  categoryId: number,
  params?: {
    page?: number;
    page_size?: number;
    ordering?: string;
  }
): Promise<PaginatedResponse<Product>> => {
  const response = await axiosInstance.get<PaginatedResponse<Product>>(
    API_ENDPOINTS.CATEGORY_PRODUCTS(categoryId),
    { params }
  );
  return response.data;
};
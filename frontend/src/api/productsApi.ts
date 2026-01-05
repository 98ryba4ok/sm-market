// Products API

import api from "./axios";
import type {
  Product,
  ProductListItem,
  ProductFilters,
  ProductReview,
} from "../types/product";
import type { PaginatedResponse } from "../types/api";

export const productsApi = {
  /**
   * Получить список товаров с фильтрацией и поиском
   * GET /api/catalog/products/
   */
  list: (filters?: ProductFilters) =>
    api.get<PaginatedResponse<ProductListItem>>("/catalog/products/", {
      params: filters,
    }),

  /**
   * Получить товар по ID или slug
   * GET /api/catalog/products/{id_or_slug}/
   */
  retrieve: (idOrSlug: string | number) =>
    api.get<Product>(`/catalog/products/${idOrSlug}/`),

  /**
   * Получить отзывы о товаре
   * GET /api/catalog/products/{id}/reviews/
   */
  reviews: (id: number, page?: number) =>
    api.get<PaginatedResponse<ProductReview>>(
      `/catalog/products/${id}/reviews/`,
      { params: { page } }
    ),
};

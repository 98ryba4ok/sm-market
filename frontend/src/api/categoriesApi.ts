// Categories API

import api from "./axios";
import type { Category, CategoryListItem } from "../types/category";
import type { PaginatedResponse, ProductListItem, ProductFilters } from "../types";

export const categoriesApi = {
  /**
   * Получить список всех категорий (только корневые)
   * GET /api/catalog/categories/
   */
  list: () => api.get<PaginatedResponse<CategoryListItem>>("/catalog/categories/"),

  /**
   * Получить категорию по slug
   * GET /api/catalog/categories/{slug}/
   */
  retrieve: (slug: string) => api.get<Category>(`/catalog/categories/${slug}/`),

  /**
   * Получить товары категории (включая подкатегории)
   * GET /api/catalog/categories/{slug}/products/
   */
  products: (slug: string, filters?: ProductFilters) =>
    api.get<PaginatedResponse<ProductListItem>>(
      `/catalog/categories/${slug}/products/`,
      { params: filters }
    ),
};

import { useQuery } from '@tanstack/react-query';

import * as productsApi from '../api/products';
import type { PaginatedResponse } from '../types/api';
import type { Product, ProductsParams } from '../types/product';
import { queryKeys } from '../utils/queryKeys';

/**
 * Custom hook for fetching products list with filters
 */
export const useProducts = (params: ProductsParams = {}) => {
  const query = useQuery<PaginatedResponse<Product>>({
    queryKey: queryKeys.products.list(params),
    queryFn: () => productsApi.fetchProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });

  return {
    products: query.data?.results || [],
    count: query.data?.count || 0,
    next: query.data?.next,
    previous: query.data?.previous,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Custom hook for fetching single product details
 */
export const useProduct = (productId: number | string | undefined) => {
  const numericId = productId ? Number(productId) : 0;
  
  const query = useQuery<Product>({
    queryKey: queryKeys.products.detail(numericId),
    queryFn: () => productsApi.fetchProductById(numericId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!productId && !isNaN(numericId), // Only fetch if productId is valid
  });

  return {
    product: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Custom hook for searching products
 */
export const useProductSearch = (searchQuery: string, enabled: boolean = true) => {
  const query = useQuery<PaginatedResponse<Product>>({
    queryKey: queryKeys.products.list({ search: searchQuery }),
    queryFn: () => productsApi.searchProducts(searchQuery),
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for search)
    enabled: enabled && searchQuery.length > 0, // Only search if query is not empty
  });

  return {
    results: query.data?.results || [],
    count: query.data?.count || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
import type { Wishlist } from '../types/product';
import { API_ENDPOINTS } from '../utils/constants';

import axiosInstance from './axios';

/**
 * Получить wishlist пользователя
 */
export const getWishlist = async (): Promise<Wishlist> => {
  const response = await axiosInstance.get<Wishlist>(
    API_ENDPOINTS.WISHLIST
  );
  return response.data;
};

/**
 * Добавить товар в wishlist
 */
export const addToWishlist = async (productId: number): Promise<Wishlist> => {
  const response = await axiosInstance.post<Wishlist>(
    API_ENDPOINTS.WISHLIST_ADD,
    { product_id: productId }
  );
  return response.data;
};

/**
 * Удалить товар из wishlist
 */
export const removeFromWishlist = async (productId: number): Promise<Wishlist> => {
  const response = await axiosInstance.delete<Wishlist>(
    API_ENDPOINTS.WISHLIST_REMOVE(productId)
  );
  return response.data;
};
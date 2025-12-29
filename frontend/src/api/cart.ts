import type { AddToCartData, Cart } from '../types/cart';
import { API_ENDPOINTS } from '../utils/constants';

import axiosInstance from './axios';

/**
 * Получить текущую корзину
 */
export const getCart = async (): Promise<Cart> => {
  const response = await axiosInstance.get<Cart>(API_ENDPOINTS.CART);
  return response.data;
};

/**
 * Добавить товар в корзину
 */
export const addToCart = async (data: AddToCartData): Promise<Cart> => {
  const response = await axiosInstance.post<Cart>(
    API_ENDPOINTS.CART_ADD,
    data
  );
  return response.data;
};

/**
 * Обновить количество товара в корзине
 */
export const updateCartItem = async (
  itemId: number,
  quantity: number
): Promise<Cart> => {
  const response = await axiosInstance.patch<Cart>(
    API_ENDPOINTS.CART_UPDATE(itemId),
    { quantity }
  );
  return response.data;
};

/**
 * Удалить товар из корзины
 */
export const removeFromCart = async (itemId: number): Promise<Cart> => {
  const response = await axiosInstance.delete<Cart>(
    API_ENDPOINTS.CART_REMOVE(itemId)
  );
  return response.data;
};

/**
 * Очистить корзину
 */
export const clearCart = async (): Promise<void> => {
  await axiosInstance.post(API_ENDPOINTS.CART_CLEAR);
};
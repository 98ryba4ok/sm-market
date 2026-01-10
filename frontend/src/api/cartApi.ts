// Cart API

import type { MessageResponse } from "../types/api";
import type {
  AddToCartPayload,
  Cart,
  UpdateCartItemPayload,
} from "../types/cart";

import api from "./axios";

export const cartApi = {
  /**
   * Получить корзину текущего пользователя/гостя
   * GET /api/cart/
   */
  get: () => api.get<Cart>("/cart/"),

  /**
   * Добавить товар в корзину
   * POST /api/cart/add_item/
   */
  addItem: (data: AddToCartPayload) =>
    api.post<Cart>("/cart/add_item/", data),

  /**
   * Обновить количество товара в корзине
   * PATCH /api/cart/items/{item_id}/
   */
  updateItem: (itemId: number, data: UpdateCartItemPayload) =>
    api.patch<Cart>(`/cart/items/${itemId}/`, data),

  /**
   * Удалить товар из корзины
   * DELETE /api/cart/items/{item_id}/
   */
  removeItem: (itemId: number) => api.delete<Cart>(`/cart/items/${itemId}/`),

  /**
   * Очистить корзину
   * POST /api/cart/clear/
   */
  clear: () => api.post<MessageResponse>("/cart/clear/"),
};

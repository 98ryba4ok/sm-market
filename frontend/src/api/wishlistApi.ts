// Wishlist API

import api from "./axios";
import type { Wishlist, WishlistAddRemovePayload } from "../types/wishlist";
import type { MessageResponse } from "../types/api";

export const wishlistApi = {
  /**
   * Получить список желаний пользователя
   * GET /api/catalog/wishlist/
   */
  list: () => api.get<Wishlist>("/catalog/wishlist/"),

  /**
   * Добавить товар в список желаний
   * POST /api/catalog/wishlist/add/
   */
  add: (data: WishlistAddRemovePayload) =>
    api.post<MessageResponse>("/catalog/wishlist/add/", data),

  /**
   * Удалить товар из списка желаний
   * POST /api/catalog/wishlist/remove/
   */
  remove: (data: WishlistAddRemovePayload) =>
    api.post<MessageResponse>("/catalog/wishlist/remove/", data),

  /**
   * Очистить список желаний
   * POST /api/catalog/wishlist/clear/
   */
  clear: () => api.post<MessageResponse>("/catalog/wishlist/clear/"),
};

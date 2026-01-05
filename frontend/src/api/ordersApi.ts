// Orders API

import api from "./axios";
import type {
  Order,
  CreateOrderPayload,
  UpdateOrderStatusPayload,
} from "../types/order";
import type { PaginatedResponse } from "../types/api";

export const ordersApi = {
  /**
   * Получить список заказов пользователя
   * GET /api/orders/
   */
  list: (page?: number) =>
    api.get<PaginatedResponse<Order>>("/orders/", { params: { page } }),

  /**
   * Создать заказ из корзины
   * POST /api/orders/
   */
  create: (data: CreateOrderPayload) => api.post<Order>("/orders/", data),

  /**
   * Получить детальную информацию о заказе
   * GET /api/orders/{id}/
   */
  retrieve: (id: number) => api.get<Order>(`/orders/${id}/`),

  /**
   * Отменить заказ
   * POST /api/orders/{id}/cancel/
   */
  cancel: (id: number) =>
    api.post<{ detail: string; order: Order }>(`/orders/${id}/cancel/`),

  /**
   * Обновить статус заказа (только для администраторов)
   * PATCH /api/orders/{id}/update_status/
   */
  updateStatus: (id: number, data: UpdateOrderStatusPayload) =>
    api.patch<{ detail: string; order: Order }>(
      `/orders/${id}/update_status/`,
      data
    ),
};

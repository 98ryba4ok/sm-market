// Payment API

import api from "./axios";

export interface PaymentCreation {
  payment_id: string | null;
  confirmation_url: string | null;
  message?: string;
}

export const paymentApi = {
  /**
   * Создать платеж для заказа
   * POST /api/orders/{id}/create_payment/
   * 
   * Возвращает:
   * - payment_id: ID платежа в ЮКассе
   * - confirmation_url: URL для перехода на страницу оплаты (null если интеграция отключена)
   * - message: информационное сообщение
   */
  createPayment: (orderId: number) =>
    api.post<PaymentCreation>(`/orders/${orderId}/create_payment/`),
};

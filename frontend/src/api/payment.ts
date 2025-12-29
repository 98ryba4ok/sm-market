import type { PaymentData, PaymentStatus } from '../types/payment';
import { API_ENDPOINTS } from '../utils/constants';

import axiosInstance from './axios';

/**
 * Создать платеж через ЮKassa
 */
export const createPayment = async (orderId: number): Promise<PaymentData> => {
  const response = await axiosInstance.post<PaymentData>(
    API_ENDPOINTS.PAYMENT_CREATE,
    { order_id: orderId }
  );
  return response.data;
};

/**
 * Проверить статус платежа
 */
export const checkPaymentStatus = async (paymentId: string): Promise<PaymentStatus> => {
  const response = await axiosInstance.get<PaymentStatus>(
    `${API_ENDPOINTS.PAYMENT_STATUS}${paymentId}/`
  );
  return response.data;
};

/**
 * Подтвердить платеж (webhook callback)
 * Обычно вызывается автоматически ЮKassa
 */
export const confirmPayment = async (paymentId: string): Promise<void> => {
  await axiosInstance.post(`${API_ENDPOINTS.PAYMENT_CONFIRM}${paymentId}/`);
};
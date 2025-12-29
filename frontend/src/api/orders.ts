import type { PaginatedResponse } from '../types/api';
import type { CreateOrderData, Order } from '../types/order';
import { API_ENDPOINTS } from '../utils/constants';

import axiosInstance from './axios';

/**
 * Создать заказ
 */
export const createOrder = async (data: CreateOrderData): Promise<Order> => {
  const response = await axiosInstance.post<Order>(
    API_ENDPOINTS.ORDERS,
    data
  );
  return response.data;
};

/**
 * Получить список заказов пользователя
 */
export const fetchOrders = async (
  page?: number
): Promise<PaginatedResponse<Order>> => {
  const response = await axiosInstance.get<PaginatedResponse<Order>>(
    API_ENDPOINTS.ORDERS,
    {
      params: { page },
    }
  );
  return response.data;
};

/**
 * Получить заказ по ID
 */
export const fetchOrderById = async (id: number): Promise<Order> => {
  const response = await axiosInstance.get<Order>(
    API_ENDPOINTS.ORDER_DETAIL(id)
  );
  return response.data;
};

/**
 * Отменить заказ
 */
export const cancelOrder = async (id: number): Promise<Order> => {
  const response = await axiosInstance.post<Order>(
    API_ENDPOINTS.ORDER_CANCEL(id)
  );
  return response.data;
};
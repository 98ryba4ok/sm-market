import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import * as ordersApi from '../api/orders';
import type { PaginatedResponse } from '../types/api';
import type { CreateOrderData, Order } from '../types/order';
import { queryKeys } from '../utils/queryKeys';

/**
 * Custom hook for fetching user's orders list
 */
export const useOrders = (page?: number) => {
  const query = useQuery<PaginatedResponse<Order>>({
    queryKey: queryKeys.orders.list({ page }),
    queryFn: () => ordersApi.fetchOrders(page),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    orders: query.data?.results || [],
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
 * Custom hook for fetching single order details
 */
export const useOrder = (orderId: number | string | undefined) => {
  const numericId = orderId ? Number(orderId) : 0;

  const query = useQuery<Order>({
    queryKey: queryKeys.orders.detail(numericId),
    queryFn: () => ordersApi.fetchOrderById(numericId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!orderId && !isNaN(numericId), // Only fetch if orderId is valid
  });

  return {
    order: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Custom hook for creating an order
 */
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (orderData: CreateOrderData) => ordersApi.createOrder(orderData),
    onSuccess: (data) => {
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      // Invalidate cart since it should be cleared after order
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      
      toast.success('Заказ успешно создан!');
      return data;
    },
    onError: (error) => {
      const message = (error as any)?.response?.data?.detail || 'Ошибка создания заказа';
      toast.error(message);
    },
  });

  return {
    createOrder: mutation.mutate,
    createOrderAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
};

/**
 * Custom hook for cancelling an order
 */
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (orderId: number) => ordersApi.cancelOrder(orderId),
    onSuccess: (data, orderId) => {
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      // Invalidate specific order
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
      
      toast.success('Заказ отменен');
    },
    onError: (error) => {
      const message = (error as any)?.response?.data?.detail || 'Ошибка отмены заказа';
      toast.error(message);
    },
  });

  return {
    cancelOrder: mutation.mutate,
    isCancelling: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};
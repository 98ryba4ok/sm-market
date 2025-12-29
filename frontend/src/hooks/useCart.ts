import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import * as cartApi from '../api/cart';
import { useCartStore } from '../store/cartStore';
import type { AddToCartData } from '../types/cart';
import { queryKeys } from '../utils/queryKeys';

/**
 * Custom hook for cart operations
 * Manages cart state and API calls with optimistic updates
 */
export const useCart = () => {
  const queryClient = useQueryClient();
  const { cart, itemsCount, setCart, openCart } = useCartStore();

  // Fetch cart
  const { data: cartData, isLoading } = useQuery({
    queryKey: queryKeys.cart.current(),
    queryFn: cartApi.getCart,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  // Sync cart data with store
  useEffect(() => {
    if (cartData && cartData !== cart) {
      setCart(cartData);
    }
  }, [cartData, cart, setCart]);

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: (data: AddToCartData) => cartApi.addToCart(data),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.current() });

      // Snapshot previous value
      const previousCart = queryClient.getQueryData(queryKeys.cart.current());

      // Optimistically update cart
      // (We'll get the real data from the server response)

      return { previousCart };
    },
    onSuccess: (data) => {
      setCart(data);
      queryClient.setQueryData(queryKeys.cart.current(), data);
      toast.success('Товар добавлен в корзину');
      openCart();
    },
    onError: (error: unknown, _newItem, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.current(), context.previousCart);
      }
      const message = (error as any)?.response?.data?.detail || 'Ошибка добавления в корзину';
      toast.error(message);
    },
  });

  // Update cart item mutation
  const updateCartItemMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      cartApi.updateCartItem(itemId, quantity),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.current() });
      const previousCart = queryClient.getQueryData(queryKeys.cart.current());
      return { previousCart };
    },
    onSuccess: (data) => {
      setCart(data);
      queryClient.setQueryData(queryKeys.cart.current(), data);
      toast.success('Количество обновлено');
    },
    onError: (error: unknown, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.current(), context.previousCart);
      }
      const message = (error as any)?.response?.data?.detail || 'Ошибка обновления';
      toast.error(message);
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: (itemId: number) => cartApi.removeFromCart(itemId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.current() });
      const previousCart = queryClient.getQueryData(queryKeys.cart.current());
      return { previousCart };
    },
    onSuccess: (data) => {
      setCart(data);
      queryClient.setQueryData(queryKeys.cart.current(), data);
      toast.success('Товар удален из корзины');
    },
    onError: (error: unknown, _itemId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.current(), context.previousCart);
      }
      toast.error('Ошибка удаления товара');
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      setCart(null);
      queryClient.setQueryData(queryKeys.cart.current(), null);
      toast.success('Корзина очищена');
    },
    onError: () => {
      toast.error('Ошибка очистки корзины');
    },
  });

  return {
    // State
    cart: cartData || cart,
    itemsCount,
    isLoading,
    
    // Actions
    addToCart: addToCartMutation.mutate,
    updateCartItem: updateCartItemMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    
    // Mutation states
    isAddingToCart: addToCartMutation.isPending,
    isUpdatingCart: updateCartItemMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
    isClearingCart: clearCartMutation.isPending,
  };
};
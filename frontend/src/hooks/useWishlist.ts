import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

import * as wishlistApi from '../api/wishlist';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import type { Product, Wishlist } from '../types/product';
import { queryKeys } from '../utils/queryKeys';

/**
 * Custom hook for wishlist operations
 * Manages wishlist state with TanStack Query and Zustand
 * Syncs with backend when user is authenticated
 */
export const useWishlist = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { productIds, addProduct, removeProduct, setProducts, clearWishlist } = useWishlistStore();

  // Fetch wishlist from backend (only for authenticated users)
  const { data: wishlist, isLoading } = useQuery<Wishlist>({
    queryKey: queryKeys.wishlist.current(),
    queryFn: wishlistApi.getWishlist,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Sync backend wishlist with local store
  useEffect(() => {
    if (wishlist?.products) {
      const ids = wishlist.products.map((p) => p.id);
      setProducts(ids);
    }
  }, [wishlist, setProducts]);

  // Add product to wishlist
  const addToWishlistMutation = useMutation({
    mutationFn: (productId: number) => wishlistApi.addToWishlist(productId),
    onMutate: async (productId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.wishlist.current() });

      // Snapshot previous value
      const previousWishlist = queryClient.getQueryData<Wishlist>(queryKeys.wishlist.current());

      // Optimistically update local store
      addProduct(productId);

      // Optimistically update cache if authenticated
      if (isAuthenticated && previousWishlist) {
        queryClient.setQueryData<Wishlist>(queryKeys.wishlist.current(), (old) => {
          if (!old) return old;
          return {
            ...old,
            products: [...old.products, { id: productId } as Product], // Simplified for optimistic update
          };
        });
      }

      return { previousWishlist };
    },
    onError: (error, productId, context) => {
      // Rollback on error
      removeProduct(productId);
      if (context?.previousWishlist) {
        queryClient.setQueryData(queryKeys.wishlist.current(), context.previousWishlist);
      }
      const message = (error as any)?.response?.data?.detail || 'Ошибка добавления в избранное';
      toast.error(message);
    },
    onSuccess: () => {
      toast.success('Товар добавлен в избранное');
    },
    onSettled: () => {
      // Refetch to ensure sync
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.current() });
      }
    },
  });

  // Remove product from wishlist
  const removeFromWishlistMutation = useMutation({
    mutationFn: (productId: number) => wishlistApi.removeFromWishlist(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.wishlist.current() });

      const previousWishlist = queryClient.getQueryData<Wishlist>(queryKeys.wishlist.current());

      // Optimistically update local store
      removeProduct(productId);

      // Optimistically update cache if authenticated
      if (isAuthenticated && previousWishlist) {
        queryClient.setQueryData<Wishlist>(queryKeys.wishlist.current(), (old) => {
          if (!old) return old;
          return {
            ...old,
            products: old.products.filter((p) => p.id !== productId),
          };
        });
      }

      return { previousWishlist };
    },
    onError: (error, productId, context) => {
      // Rollback on error
      addProduct(productId);
      if (context?.previousWishlist) {
        queryClient.setQueryData(queryKeys.wishlist.current(), context.previousWishlist);
      }
      const message = (error as any)?.response?.data?.detail || 'Ошибка удаления из избранного';
      toast.error(message);
    },
    onSuccess: () => {
      toast.success('Товар удален из избранного');
    },
    onSettled: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.current() });
      }
    },
  });

  // Toggle product in wishlist
  const toggleWishlist = (productId: number) => {
    const isInWishlist = productIds.includes(productId);
    
    if (isInWishlist) {
      removeFromWishlistMutation.mutate(productId);
    } else {
      addToWishlistMutation.mutate(productId);
    }
  };

  // Clear entire wishlist
  const clearWishlistMutation = useMutation({
    mutationFn: async () => {
      // Remove all products one by one
      const promises = productIds.map(id => wishlistApi.removeFromWishlist(id));
      await Promise.all(promises);
    },
    onSuccess: () => {
      clearWishlist();
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.current() });
      toast.success('Избранное очищено');
    },
    onError: (error) => {
      const message = (error as any)?.response?.data?.detail || 'Ошибка очистки избранного';
      toast.error(message);
    },
  });

  return {
    // Data
    wishlist,
    productIds,
    isLoading,
    
    // Computed
    itemsCount: productIds.length,
    isInWishlist: (productId: number) => productIds.includes(productId),
    
    // Actions
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    toggleWishlist,
    clearWishlist: clearWishlistMutation.mutate,
    
    // Loading states
    isAdding: addToWishlistMutation.isPending,
    isRemoving: removeFromWishlistMutation.isPending,
    isClearing: clearWishlistMutation.isPending,
  };
};
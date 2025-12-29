import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  productIds: number[];
  
  // Actions
  addProduct: (productId: number) => void;
  removeProduct: (productId: number) => void;
  toggleProduct: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
  setProducts: (productIds: number[]) => void;
}

/**
 * Wishlist store using Zustand
 * Persists wishlist product IDs to localStorage
 * Syncs with backend when user is authenticated
 */
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      addProduct: (productId) => {
        set((state) => {
          if (state.productIds.includes(productId)) {
            return state;
          }
          return { productIds: [...state.productIds, productId] };
        });
      },

      removeProduct: (productId) => {
        set((state) => ({
          productIds: state.productIds.filter((id) => id !== productId),
        }));
      },

      toggleProduct: (productId) => {
        const isInList = get().isInWishlist(productId);
        if (isInList) {
          get().removeProduct(productId);
        } else {
          get().addProduct(productId);
        }
      },

      isInWishlist: (productId) => {
        return get().productIds.includes(productId);
      },

      clearWishlist: () => {
        set({ productIds: [] });
      },

      setProducts: (productIds) => {
        set({ productIds });
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
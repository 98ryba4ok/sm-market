import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Cart } from '../types/cart';

interface CartState {
  cart: Cart | null;
  itemsCount: number;
  isOpen: boolean;
  
  // Actions
  setCart: (cart: Cart | null) => void;
  updateItemsCount: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearCart: () => void;
}

/**
 * Cart store using Zustand
 * Persists cart data to localStorage
 * Manages cart drawer state
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      itemsCount: 0,
      isOpen: false,

      setCart: (cart) => {
        set({ cart });
        get().updateItemsCount();
      },

      updateItemsCount: () => {
        const cart = get().cart;
        if (!cart || !cart.items) {
          set({ itemsCount: 0 });
          return;
        }
        
        const count = cart.items.reduce((total, item) => total + item.quantity, 0);
        set({ itemsCount: count });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      clearCart: () => {
        set({ 
          cart: null, 
          itemsCount: 0,
          isOpen: false 
        });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        cart: state.cart,
        itemsCount: state.itemsCount,
      }),
    }
  )
);
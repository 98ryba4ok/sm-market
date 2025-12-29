// Типы для корзины

import type { Product } from './product';

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  subtotal: string;
  added_at: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_items: number;
  total_price: string;
  created_at: string;
  updated_at: string;
}

export interface AddToCartData {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}
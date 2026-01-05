// Cart types

import type { ProductListItem } from "./product";

export interface CartItem {
  id: number;
  cart: number;
  product: number;
  product_detail: ProductListItem;
  quantity: number;
  subtotal: string;
  added_at: string;
}

export interface Cart {
  id: number;
  user: number | null;
  session_key: string | null;
  items: CartItem[];
  total_amount: string;
  total_items: number;
  created_at: string;
  updated_at: string;
}

export interface AddToCartPayload {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

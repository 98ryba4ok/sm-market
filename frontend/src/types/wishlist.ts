// Wishlist types

import type { ProductListItem } from "./product";

export interface Wishlist {
  id: number;
  user: number;
  products: ProductListItem[];
  created_at: string;
}

export interface WishlistAddRemovePayload {
  product_id: number;
}

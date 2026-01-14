// Category types

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  room_ids: number[];
  image: string | null;
  order: number;
  is_active: boolean;
  products_count: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryListItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  room_ids: number[];
  image: string | null;
  order: number;
  is_active: boolean;
  products_count: number;
  created_at: string;
  updated_at: string;
}

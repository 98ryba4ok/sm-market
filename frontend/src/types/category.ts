// Category types

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number | null;
  subcategories: Category[];
  image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryListItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number | null;
  image: string | null;
  is_active: boolean;
  subcategories: CategoryListItem[];
  products_count: number;
  created_at: string;
  updated_at: string;
}

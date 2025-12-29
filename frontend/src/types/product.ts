// Типы для продуктов и категорий

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  parent: number | null;
  subcategories?: Category[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_main: boolean;
  order: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  discount_price: string | null;
  final_price: string;
  discount_percentage: number;
  category: Category;
  stock_quantity: number;
  in_stock: boolean;
  is_active: boolean;
  views_count: number;
  average_rating: number;
  reviews_count: number;
  main_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductDetail extends Product {
  images: ProductImage[];
}

export interface Review {
  id: number;
  product: number;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  rating: number;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewData {
  rating: number;
  comment: string;
}

export interface Wishlist {
  id: number;
  user: number;
  products: Product[];
  created_at: string;
}

export interface ProductsParams {
  page?: number;
  search?: string;
  category?: number;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  in_stock?: boolean;
  on_sale?: boolean;
  ordering?: string;
}
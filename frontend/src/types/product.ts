// Product types

export interface ProductImage {
  id: number;
  image: string;
  is_main: boolean;
  order: number;
  alt_text: string;
}

export interface ProductReview {
  id: number;
  product: number;
  user: {
    id: number;
    email: string;
  };
  rating: number;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  sku: string;
  category: number;
  category_name: string;
  brand_id: number | null;
  brand_name: string | null;
  price: string;
  discount_price: string | null;
  final_price: string;
  discount_percentage: number;
  stock_quantity: number;
  in_stock: boolean;
  main_image: string | null;
  average_rating: number | null;
  reviews_count: number;
  views_count: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: number;
  category_name: string;
  category_slug: string;
  brand: {
    id: number;
    name: string;
    slug: string;
    description: string;
    order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  } | null;
  price: string;
  discount_price: string | null;
  final_price: string;
  discount_percentage: number;
  stock_quantity: number;
  in_stock: boolean;
  is_active: boolean;
  sku: string;
  specifications: Record<string, string>;
  country_of_origin: string;
  warranty_months: number;
  images: ProductImage[];
  reviews: ProductReview[];
  average_rating: number | null;
  reviews_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  on_sale?: boolean;
  min_rating?: number;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface CreateReviewPayload {
  product: number;
  rating: number;
  comment: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

// Promo code types

export interface PromoCode {
  id: number;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order_amount: string;
  max_discount: string | null;
  is_active: boolean;
  valid_from: string;
  valid_to: string;
  usage_limit: number | null;
  used_count: number;
}

export interface PromoCodeValidation {
  is_valid: boolean;
  discount_amount: string;
  discount_type?: "percent" | "fixed";
  error: string | null;
}

export interface OrderTotals {
  subtotal: string;
  promo_discount: string;
  delivery_cost: string;
  total: string;
  promo_error?: string | null;
}

// Order types

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentMethod = "new_card";
export type DeliveryMethod = "courier" | "pickup";

export interface OrderItem {
  id: number;
  order: number;
  product: number;
  product_name: string;
  quantity: number;
  price_at_purchase: string;
  subtotal: string;
}

export interface Order {
  id: number;
  user: number | null;
  order_number: string;
  status: OrderStatus;
  status_display: string;
  total_amount: string;
  delivery_method: DeliveryMethod;
  delivery_method_display: string;
  delivery_address: string;
  delivery_city: string;
  delivery_postal_code: string;
  delivery_date: string | null;
  delivery_time: string | null;
  phone: string;
  email: string;
  payment_status: PaymentStatus;
  payment_status_display: string;
  payment_method: PaymentMethod;
  payment_method_display: string;
  payment_id: string | null;
  promo_code: string | null;
  promo_discount: string;
  bonus_discount: string;
  items: OrderItem[];
  can_be_cancelled: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderPayload {
  delivery_method: DeliveryMethod;
  delivery_address: string;
  delivery_city: string;
  delivery_postal_code: string;
  delivery_date?: string;
  delivery_time?: string;
  phone: string;
  email: string;
  payment_method: PaymentMethod;
  promo_code?: string;
  use_bonuses?: boolean;
  selected_items?: number[];
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

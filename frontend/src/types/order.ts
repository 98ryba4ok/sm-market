// Типы для заказов

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'card' | 'cash';

export interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price_at_purchase: string;
  subtotal: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  total_amount: string;
  delivery_address: string;
  delivery_city: string;
  delivery_postal_code: string;
  phone: string;
  email: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CreateOrderData {
  delivery_address: string;
  delivery_city: string;
  delivery_postal_code: string;
  phone: string;
  email: string;
  payment_method: PaymentMethod;
}
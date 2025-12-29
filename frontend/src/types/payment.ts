/**
 * Типы для работы с платежами
 */

export interface PaymentData {
  id: string;
  status: PaymentStatusType;
  amount: {
    value: string;
    currency: string;
  };
  confirmation: {
    type: string;
    confirmation_url: string;
  };
  created_at: string;
  description?: string;
  metadata?: {
    order_id: number;
  };
}

export interface PaymentStatus {
  id: string;
  status: PaymentStatusType;
  paid: boolean;
  amount: {
    value: string;
    currency: string;
  };
  created_at: string;
  captured_at?: string;
  metadata?: {
    order_id: number;
  };
}

export type PaymentStatusType = 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled';

export interface CreatePaymentRequest {
  order_id: number;
}
import api from "./axios";

export interface PaymentCreation {
  order_id: number;
  payment_id: string | null;
  confirmation_url: string | null;
  message?: string;
}

export interface PaymentStatus {
  status: string;
  paid: boolean;
  order_id: number;
}

export const paymentApi = {
  /** POST /api/orders/{id}/create_payment/ */
  createPayment: (orderId: number) =>
    api.post<PaymentCreation>(`/orders/${orderId}/create_payment/`),

  /** POST /api/orders/create-payment-by-number/ */
  createPaymentByOrderNumber: (orderNumber: string) =>
    api.post<PaymentCreation>(`/orders/create-payment-by-number/`, { order_number: orderNumber }),

  /** GET /api/orders/{id}/check_payment/ */
  checkPaymentStatus: (orderId: number) =>
    api.get<PaymentStatus>(`/orders/${orderId}/check_payment/`),
};

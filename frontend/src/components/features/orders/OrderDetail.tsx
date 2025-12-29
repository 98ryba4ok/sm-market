import { Calendar, CreditCard, MapPin } from 'lucide-react';
import React from 'react';

import type { Order } from '../../../types/order';
import { formatDate, formatPrice } from '../../../utils/format';
import { Badge } from '../../ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';

interface OrderDetailProps {
  order: Order;
  className?: string;
}

const statusConfig = {
  pending: { label: 'Pending', variant: 'default' as const },
  processing: { label: 'Processing', variant: 'primary' as const },
  shipped: { label: 'Shipped', variant: 'info' as const },
  delivered: { label: 'Delivered', variant: 'success' as const },
  cancelled: { label: 'Cancelled', variant: 'danger' as const },
};

export const OrderDetail: React.FC<OrderDetailProps> = ({ order, className = '' }) => {
  const statusInfo = statusConfig[order.status] || statusConfig.pending;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Order #{order.order_number}</CardTitle>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <Calendar size={14} />
                <span>Placed on {formatDate(order.created_at)}</span>
              </div>
            </div>
            <Badge variant={statusInfo.variant} size="lg">
              {statusInfo.label}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
              >
                <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded border border-gray-200">
                  <img
                    src="/placeholder-product.jpg"
                    alt={item.product_name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 line-clamp-2">
                    {item.product_name}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatPrice(item.price_at_purchase)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Subtotal: {formatPrice(Number(item.price_at_purchase) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-gray-500" />
              <CardTitle>Delivery Address</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">{order.delivery_address}</p>
              <p className="text-gray-700">
                {order.delivery_city}, {order.delivery_postal_code}
              </p>
              {order.phone && (
                <p className="text-gray-700">Phone: {order.phone}</p>
              )}
              {order.email && (
                <p className="text-gray-700">Email: {order.email}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-gray-500" />
              <CardTitle>Payment Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium text-gray-900">
                  {order.payment_method || 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Status</span>
                <Badge
                  variant={order.payment_status === 'paid' ? 'success' : 'warning'}
                  size="sm"
                >
                  {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                </Badge>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(order.total_amount)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
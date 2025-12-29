import { Calendar, ChevronRight, CreditCard, Package } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import type { Order } from '../../../types/order';
import { formatDate, formatPrice } from '../../../utils/format';
import { Badge } from '../../ui/Badge';

interface OrderCardProps {
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

export const OrderCard: React.FC<OrderCardProps> = ({ order, className = '' }) => {
  const statusInfo = statusConfig[order.status] || statusConfig.pending;

  return (
    <Link
      to={`/orders/${order.id}`}
      className={`block bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all ${className}`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Package size={18} className="text-gray-500" />
              <span className="font-semibold text-gray-900">
                Order #{order.order_number}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={14} />
              <span>{formatDate(order.created_at)}</span>
            </div>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>

        {/* Items Preview */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
          </p>
          <div className="flex gap-2 overflow-x-auto">
            {order.items.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded border border-gray-200"
              >
                <img
                  src={'/placeholder-product.jpg'}
                  alt={item.product_name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ))}
            {order.items.length > 4 && (
              <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                <span className="text-sm text-gray-600 font-medium">
                  +{order.items.length - 4}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(order.total_amount)}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-primary-600">
            View Details
            <ChevronRight size={16} />
          </div>
        </div>

        {/* Payment Status */}
        {order.payment_status && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <CreditCard size={14} className="text-gray-500" />
              <span className="text-gray-600">Payment:</span>
              <Badge
                variant={order.payment_status === 'paid' ? 'success' : 'warning'}
                size="sm"
              >
                {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};
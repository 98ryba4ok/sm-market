import { Package } from 'lucide-react';
import React from 'react';

import { OrderCard } from '../components/features/orders/OrderCard';
import { MainLayout } from '../components/layout/MainLayout';
import { EmptyState } from '../components/ui/EmptyState';
import { Pagination } from '../components/ui/Pagination';
import { Spinner } from '../components/ui/Spinner';
import { useOrders } from '../hooks/useOrders';

export const OrdersPage: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const { orders, count, isLoading } = useOrders(page);

  const totalPages = Math.ceil(count / 20);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (orders.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="You haven't placed any orders yet"
            action={{
              label: 'Start Shopping',
              onClick: () => window.location.href = '/products',
            }}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
};
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { OrderDetail } from '../components/features/orders/OrderDetail';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { useOrder } from '../hooks/useOrders';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { order, isLoading } = useOrder(id);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">Order not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          leftIcon={<ChevronLeft size={18} />}
          onClick={() => navigate('/orders')}
          className="mb-4"
        >
          Back to Orders
        </Button>

        <OrderDetail order={order} />
      </div>
    </MainLayout>
  );
};
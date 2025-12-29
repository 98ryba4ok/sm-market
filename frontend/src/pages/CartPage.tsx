import { ShoppingBag } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { CartItem } from '../components/features/cart/CartItem';
import { CartSummary } from '../components/features/cart/CartSummary';
import { MainLayout } from '../components/layout/MainLayout';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { useCart } from '../hooks/useCart';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, isLoading, updateCartItem, removeFromCart, clearCart } = useCart();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Add some products to your cart to see them here"
            action={{
              label: 'Continue Shopping',
              onClick: () => navigate('/products'),
            }}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <Button variant="outline" onClick={() => clearCart()}>
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
              />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary cart={cart} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
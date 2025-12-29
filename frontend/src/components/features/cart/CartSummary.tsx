import { ShoppingBag } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import type { Cart } from '../../../types/cart';
import { formatPrice } from '../../../utils/format';
import { Button } from '../../ui/Button';
import { Card, CardContent, CardFooter } from '../../ui/Card';

interface CartSummaryProps {
  cart: Cart | null;
  className?: string;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ cart, className = '' }) => {
  const navigate = useNavigate();

  if (!cart || cart.items.length === 0) {
    return null;
  }

  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => {
    const price = Number(item.product.discount_price || item.product.price);
    return sum + price * item.quantity;
  }, 0);

  const shipping = 0; // Free shipping for now
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <Card className={className}>
      <CardContent className="space-y-4">
        <h3 className="font-semibold text-lg">Order Summary</h3>

        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({cart.items.length} items)</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-green-600">
            {shipping === 0 ? 'Free' : formatPrice(shipping)}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (10%)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Total */}
        <div className="flex justify-between">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-bold text-lg text-primary-600">
            {formatPrice(total)}
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleCheckout}
          fullWidth
          size="lg"
          leftIcon={<ShoppingBag size={20} />}
        >
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
};
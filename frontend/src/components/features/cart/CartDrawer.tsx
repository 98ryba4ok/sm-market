import { ShoppingCart, X } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { useCart } from '../../../hooks/useCart';
import { useCartStore } from '../../../store/cartStore';
import { formatPrice } from '../../../utils/format';
import { Button } from '../../ui/Button';
import { Spinner } from '../../ui/Spinner';

import { CartItem } from './CartItem';

export const CartDrawer: React.FC = () => {
  const { isOpen, closeCart } = useCartStore();
  const { cart, isLoading, updateCartItem, removeFromCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : !cart || !cart.items || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ShoppingCart size={48} className="text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 text-center">Add some products to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items && cart.items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total:</span>
              <span className="text-primary-600">
                {formatPrice(cart.total_price)}
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Link to="/cart" onClick={closeCart}>
                <Button variant="outline" fullWidth>
                  View Cart
                </Button>
              </Link>
              <Link to="/checkout" onClick={closeCart}>
                <Button variant="primary" fullWidth>
                  Checkout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
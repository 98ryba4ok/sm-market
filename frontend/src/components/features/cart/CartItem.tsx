import { Minus, Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { useCart } from '../../../hooks/useCart';
import type { CartItem as CartItemType } from '../../../types/cart';
import { formatPrice } from '../../../utils/format';
import { Button } from '../../ui/Button';

interface CartItemProps {
  item: CartItemType;
  className?: string;
}

export const CartItem: React.FC<CartItemProps> = ({ item, className = '' }) => {
  const { updateCartItem, removeFromCart, isUpdatingCart, isRemovingFromCart } = useCart();

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock_quantity) return;
    
    updateCartItem({ itemId: item.id, quantity: newQuantity });
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  const subtotal = Number(item.product.discount_price || item.product.price) * item.quantity;
  const isOutOfStock = item.product.stock_quantity === 0;
  const isLowStock = item.product.stock_quantity < item.quantity;

  return (
    <div className={`flex gap-4 p-4 bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Product Image */}
      <Link
        to={`/products/${item.product.id}`}
        className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden"
      >
        <img
          src={item.product.main_image || '/placeholder-product.jpg'}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${item.product.id}`}
          className="font-medium text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
        >
          {item.product.name}
        </Link>

        {/* Category */}
        {item.product.category && (
          <p className="text-sm text-gray-500 mt-1">{item.product.category.name}</p>
        )}

        {/* Stock Status */}
        {isOutOfStock && (
          <p className="text-sm text-red-600 mt-1 font-medium">Out of stock</p>
        )}
        {isLowStock && !isOutOfStock && (
          <p className="text-sm text-orange-600 mt-1">
            Only {item.product.stock_quantity} left in stock
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2">
          {item.product.discount_price ? (
            <>
              <span className="text-lg font-bold text-primary-600">
                {formatPrice(item.product.discount_price)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(item.product.price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(item.product.price)}
            </span>
          )}
        </div>
      </div>

      {/* Quantity Controls & Remove */}
      <div className="flex flex-col items-end justify-between">
        {/* Quantity Controls */}
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
          <button
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1 || isUpdatingCart}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          
          <span className="w-12 text-center font-medium">{item.quantity}</span>
          
          <button
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            disabled={item.quantity >= item.product.stock_quantity || isUpdatingCart}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-right">
          <p className="text-sm text-gray-500">Subtotal</p>
          <p className="text-lg font-bold text-gray-900">{formatPrice(subtotal)}</p>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          disabled={isRemovingFromCart}
          leftIcon={<Trash2 size={16} />}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Remove
        </Button>
      </div>
    </div>
  );
};
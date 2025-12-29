import { ShoppingCart } from 'lucide-react';
import React from 'react';

import { Button } from '../../../../ui/Button';
import type { AddToCartButtonProps } from '../types';

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  stockQuantity,
  onAddToCart,
}) => {
  const isOutOfStock = stockQuantity === 0;

  return (
    <Button
      onClick={onAddToCart}
      disabled={isOutOfStock}
      leftIcon={<ShoppingCart size={18} />}
      fullWidth
      size="sm"
    >
      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
    </Button>
  );
};
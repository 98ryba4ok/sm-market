import { Heart } from 'lucide-react';
import React from 'react';

import { useWishlist } from '../../../hooks/useWishlist';
import { Button } from '../../ui/Button';

interface WishlistButtonProps {
  productId: number;
  variant?: 'icon' | 'button';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  variant = 'icon',
  size = 'md',
  className = '',
}) => {
  const { isInWishlist, toggleWishlist, isAdding, isRemoving } = useWishlist();
  const inWishlist = isInWishlist(productId);
  const isLoading = isAdding || isRemoving;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if button is inside a link
    e.stopPropagation(); // Prevent event bubbling
    toggleWishlist(productId);
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          inWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
        } ${className}`}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
          fill={inWishlist ? 'currentColor' : 'none'}
          className="transition-all"
        />
      </button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant={inWishlist ? 'primary' : 'outline'}
      size={size}
      leftIcon={
        <Heart
          size={18}
          fill={inWishlist ? 'currentColor' : 'none'}
        />
      }
      className={className}
    >
      {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
    </Button>
  );
};
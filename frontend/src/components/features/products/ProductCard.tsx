import { Heart, ShoppingCart } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

import { useCart } from '../../../hooks/useCart';
import { useWishlist } from '../../../hooks/useWishlist';
import type { Product } from '../../../types/product';
import { formatPrice } from '../../../utils/format';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Rating } from '../../ui/Rating';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product detail
    addToCart({ product_id: product.id, quantity: 1 });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product detail
    toggleWishlist(product.id);
  };

  // Calculate discount percentage
  const discountPercentage = product.discount_price
    ? Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100)
    : 0;

  // Get main image or placeholder
  const mainImage = product.main_image || '/placeholder-product.jpg';

  return (
    <Link
      to={`/products/${product.id}`}
      className={`group block bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 ${className}`}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <Badge
            variant="danger"
            className="absolute top-2 left-2"
          >
            -{discountPercentage}%
          </Badge>
        )}

        {/* Out of Stock Badge */}
        {product.stock_quantity === 0 && (
          <Badge
            variant="default"
            className="absolute top-2 left-2 bg-gray-900 text-white"
          >
            Out of Stock
          </Badge>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all ${
            inWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
        )}

        {/* Product Name */}
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.average_rating && product.reviews_count ? (
          <div className="flex items-center gap-2 mb-2">
            <Rating value={product.average_rating} readonly size="sm" />
            <span className="text-xs text-gray-500">
              ({product.reviews_count})
            </span>
          </div>
        ) : null}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          {product.discount_price ? (
            <>
              <span className="text-lg font-bold text-primary-600">
                {formatPrice(product.discount_price)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={product.stock_quantity === 0}
          leftIcon={<ShoppingCart size={18} />}
          fullWidth
          size="sm"
        >
          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </Link>
  );
};
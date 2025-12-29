import React from 'react';

import { useCart } from '../../../../hooks/useCart';
import { useWishlist } from '../../../../hooks/useWishlist';

import { PRODUCT_CARD_CONSTANTS } from './constants';
import {
    AddToCartButton,
    ProductBadges,
    ProductImage,
    ProductInfo,
    ProductPrice,
    WishlistButton,
} from './parts';
import * as S from './styles';
import type { ProductCardProps } from './types';
import { calculateDiscountPercentage, getProductImage } from './utils';

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({ product_id: product.id, quantity: 1 });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.id);
  };

  const discountPercentage = calculateDiscountPercentage(
    product.price,
    product.discount_price
  );
  const mainImage = getProductImage(
    product.main_image,
    PRODUCT_CARD_CONSTANTS.PLACEHOLDER_IMAGE
  );
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <S.StyledProductCard
      to={`/products/${product.id}`}
      className={className}
    >
      {/* Image with overlays */}
      <div style={{ position: 'relative' }}>
        <ProductImage src={mainImage} alt={product.name} />
        <ProductBadges
          discountPercentage={discountPercentage}
          isOutOfStock={isOutOfStock}
        />
        <WishlistButton
          productId={product.id}
          isInWishlist={inWishlist}
          onToggle={handleToggleWishlist}
        />
      </div>

      {/* Product Info */}
      <ProductInfo product={product} />

      {/* Price */}
      <div style={{ padding: `0 ${S.ContentContainer}` }}>
        <ProductPrice
          price={product.price}
          discountPrice={product.discount_price}
        />

        {/* Add to Cart Button */}
        <AddToCartButton
          productId={product.id}
          stockQuantity={product.stock_quantity}
          onAddToCart={handleAddToCart}
        />
      </div>
    </S.StyledProductCard>
  );
};
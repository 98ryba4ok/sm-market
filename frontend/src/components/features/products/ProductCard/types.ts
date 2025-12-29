import type { Product } from '../../../../types/product';

export interface ProductCardProps {
  product: Product;
  className?: string;
}

export interface ProductImageProps {
  src: string;
  alt: string;
}

export interface ProductBadgesProps {
  discountPercentage: number;
  isOutOfStock: boolean;
}

export interface WishlistButtonProps {
  productId: number;
  isInWishlist: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

export interface ProductInfoProps {
  product: Product;
}

export interface ProductPriceProps {
  price: string;
  discountPrice?: string | null;
}

export interface AddToCartButtonProps {
  productId: number;
  stockQuantity: number;
  onAddToCart: (e: React.MouseEvent) => void;
}
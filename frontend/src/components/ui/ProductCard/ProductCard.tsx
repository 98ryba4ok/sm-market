import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "../Button/Button";
import type { ProductListItem } from "../../../types";
import "./ProductCard.css";

interface ProductCardProps {
  product: ProductListItem;
  onAddToCart?: (productId: number) => void;
  onAddToWishlist?: (productId: number) => void;
}

export const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
}: ProductCardProps) => {
  const hasDiscount = product.discount_price !== null;

  return (
    <div className="product-card">
      {/* Image */}
      <div className="product-card__image-wrapper">
        {product.main_image && (
          <img
            src={product.main_image}
            alt={product.name}
            className="product-card__image"
          />
        )}
        {hasDiscount && (
          <div className="product-card__discount-badge">
            -{product.discount_percentage}%
          </div>
        )}
        <div className="product-card__new-badge">
          Новинка!
        </div>
      </div>

      {/* Content */}
      <div className="product-card__content">
        <h3 className="product-card__title">
          {product.name}
        </h3>

        {/* Price */}
        <div className="product-card__price-wrapper">
          <span className="product-card__price">
            {Number(product.final_price).toLocaleString("ru-RU")} ₽
          </span>
          {hasDiscount && (
            <span className="product-card__old-price">
              {Number(product.price).toLocaleString("ru-RU")} ₽
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="product-card__actions">
          <Button
            variant="primary"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            onClick={() => onAddToCart?.(product.id)}
          >
            <ShoppingCart size={16} />
            Добавить в корзину
          </Button>
          <button
            className="product-card__wishlist-btn"
            onClick={() => onAddToWishlist?.(product.id)}
            aria-label="В избранное"
          >
            <Heart size={16} className="product-card__wishlist-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

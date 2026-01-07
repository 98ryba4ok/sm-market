import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product.id);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToWishlist?.(product.id);
  };

  return (
    <div className="product-card">
      {/* New Badge */}
      <div className="product-card__new-badge">
        Новинка!
      </div>

      {/* Image */}
      <Link to={`/products/${product.slug}`} className="product-card__image-wrapper">
        {product.main_image && (
          <img
            src={product.main_image}
            alt={product.name}
            className="product-card__image"
          />
        )}
      </Link>

      {/* Content */}
      <div className="product-card__content">
        <Link to={`/products/${product.slug}`} className="product-card__title-link">
          <h3 className="product-card__title">
            {product.name}
          </h3>
        </Link>

        <p className="product-card__sku">
          Код товара: {product.sku || 'ABC-12345'}
        </p>

        <div className="product-card__divider"></div>

        {/* Price */}
        <div className="product-card__price-wrapper">
          <span className="product-card__price">
            {Number(product.final_price).toLocaleString("ru-RU")} ₽
          </span>
          {hasDiscount && (
            <>
              <span className="product-card__old-price">
                {Number(product.price).toLocaleString("ru-RU")} ₽
              </span>
              <span className="product-card__discount-badge">
                -{product.discount_percentage}%
              </span>
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="product-card__actions">
          <button
            className="product-card__cart-btn"
            onClick={handleAddToCart}
          >
            Добавить в корзину
          </button>
          <button
            className="product-card__wishlist-btn"
            onClick={handleAddToWishlist}
          >
            <Heart size={20} className="product-card__wishlist-icon" />
            В избранное
          </button>
        </div>
      </div>
    </div>
  );
};

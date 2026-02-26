import * as React from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check, Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { MobileQuantitySelector } from "../MobileQuantitySelector";
import type { CartItem } from "../../../types/cart";
import { getImageUrl } from "../../../utils/imageUrl";
import "./MobileCartItem.css";

interface MobileCartItemProps {
  item: CartItem;
  isSelected: boolean;
  onSelect: (itemId: number) => void;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
  onAddToWishlist: (productId: number) => void;
  isUpdating: boolean;
}

export const MobileCartItem: React.FC<MobileCartItemProps> = ({
  item,
  isSelected,
  onSelect,
  onUpdateQuantity,
  onRemove,
  onAddToWishlist,
  isUpdating,
}) => {
  return (
    <div className="mobile-cart-item">
      <div className="mobile-cart-item__header">
        <Checkbox.Root
          className="mobile-cart-item__checkbox"
          checked={isSelected}
          onCheckedChange={() => onSelect(item.id)}
          id={`checkbox-${item.id}`}
        >
          <Checkbox.Indicator className="mobile-cart-item__checkbox-indicator">
            <Check size={14} />
          </Checkbox.Indicator>
        </Checkbox.Root>

        <div className="mobile-cart-item__image">
          <img
            src={getImageUrl(item.product_detail.main_image) || "/placeholder.png"}
            alt={item.product_detail.name}
          />
        </div>

        <div className="mobile-cart-item__info">
          <Link
            to={`/products/${item.product_detail.slug}`}
            className="mobile-cart-item__name"
          >
            {item.product_detail.name}
          </Link>
          <p className="mobile-cart-item__category">
            {item.product_detail.category_name}
          </p>
        </div>
      </div>

      <div className="mobile-cart-item__body">
        <div className="mobile-cart-item__price-section">
          {item.product_detail.discount_price && (
            <span className="mobile-cart-item__old-price">
              {parseFloat(item.product_detail.price).toLocaleString("ru-RU")} ₽
            </span>
          )}
          <span className="mobile-cart-item__current-price">
            {parseFloat(item.subtotal).toLocaleString("ru-RU")} ₽
          </span>
        </div>

        <div className="mobile-cart-item__controls">
          <MobileQuantitySelector
            quantity={item.quantity}
            onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
            onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
            min={1}
            disabled={isUpdating}
          />

          <div className="mobile-cart-item__actions">
            <button
              className="mobile-cart-item__action-btn"
              onClick={() => onAddToWishlist(item.product)}
              aria-label="Добавить в избранное"
            >
              <Heart size={18} />
            </button>
            <button
              className="mobile-cart-item__action-btn mobile-cart-item__action-btn--danger"
              onClick={() => onRemove(item.id)}
              aria-label="Удалить"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
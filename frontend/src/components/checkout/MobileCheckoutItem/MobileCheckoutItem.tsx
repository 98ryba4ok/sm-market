import * as React from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { MobileQuantitySelector } from "../../cart/MobileQuantitySelector";
import type { CartItem } from "../../../types/cart";
import { getImageUrl } from "../../../utils/imageUrl";
import "./MobileCheckoutItem.css";

interface MobileCheckoutItemProps {
  item: CartItem;
  isSelected: boolean;
  onSelect: (itemId: number) => void;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
  isUpdating?: boolean;
}

export const MobileCheckoutItem: React.FC<MobileCheckoutItemProps> = ({
  item,
  isSelected,
  onSelect,
  onUpdateQuantity,
  onRemove,
  isUpdating = false,
}) => {
  return (
    <div className="mobile-checkout-item">
      <div className="mobile-checkout-item__header">
        <Checkbox.Root
          className="mobile-checkout-item__checkbox"
          checked={isSelected}
          onCheckedChange={() => onSelect(item.id)}
          id={`checkout-checkbox-${item.id}`}
        >
          <Checkbox.Indicator className="mobile-checkout-item__checkbox-indicator">
            <Check size={14} />
          </Checkbox.Indicator>
        </Checkbox.Root>

        <div className="mobile-checkout-item__image">
          <img
            src={getImageUrl(item.product_detail.main_image) || "/placeholder.png"}
            alt={item.product_detail.name}
          />
        </div>

        <div className="mobile-checkout-item__info">
          <Link
            to={`/products/${item.product_detail.slug}`}
            className="mobile-checkout-item__name"
          >
            {item.product_detail.name}
          </Link>
          <p className="mobile-checkout-item__category">
            {item.product_detail.category_name}
          </p>
        </div>

        <button
          className="mobile-checkout-item__remove"
          onClick={() => onRemove(item.id)}
          aria-label="Удалить"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="mobile-checkout-item__body">
        <div className="mobile-checkout-item__price-section">
          <span className="mobile-checkout-item__current-price">
            {parseFloat(item.subtotal).toLocaleString("ru-RU")} ₽
          </span>
        </div>

        <MobileQuantitySelector
          quantity={item.quantity}
          onDecrease={() => onUpdateQuantity(item.id, item.quantity - 1)}
          onIncrease={() => onUpdateQuantity(item.id, item.quantity + 1)}
          min={1}
          disabled={isUpdating}
        />
      </div>
    </div>
  );
};
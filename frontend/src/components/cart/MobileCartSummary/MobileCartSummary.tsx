import * as React from "react";

import { Button } from "../../ui/Button/Button";
import { Input } from "../../ui/Input/Input";
import "./MobileCartSummary.css";

interface MobileCartSummaryProps {
  selectedCount: number;
  total: string;
  discount: string;
  promoCode: string;
  onPromoCodeChange: (value: string) => void;
  onApplyPromoCode: () => void;
  onCheckout: () => void;
  disabled?: boolean;
}

export const MobileCartSummary: React.FC<MobileCartSummaryProps> = ({
  selectedCount,
  total,
  discount,
  promoCode,
  onPromoCodeChange,
  onApplyPromoCode,
  onCheckout,
  disabled = false,
}) => {
  const [isPromoExpanded, setIsPromoExpanded] = React.useState(false);

  return (
    <div className="mobile-cart-summary">
      <div className="mobile-cart-summary__main">
        <div className="mobile-cart-summary__total">
          <span className="mobile-cart-summary__total-label">Итого</span>
          <span className="mobile-cart-summary__total-value">
            {parseFloat(total).toLocaleString("ru-RU")} ₽
          </span>
        </div>

        <Button
          className="mobile-cart-summary__checkout-btn"
          onClick={onCheckout}
          disabled={disabled || selectedCount === 0}
        >
          Оформить ({selectedCount})
        </Button>
      </div>

      {isPromoExpanded && (
        <div className="mobile-cart-summary__promo">
          <Input
            type="text"
            placeholder="Промокод"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e.target.value)}
          />
          <Button
            variant="outline"
            size="md"
            onClick={onApplyPromoCode}
          >
            Применить
          </Button>
        </div>
      )}

      <button
        className="mobile-cart-summary__toggle"
        onClick={() => setIsPromoExpanded(!isPromoExpanded)}
        aria-expanded={isPromoExpanded}
      >
        {isPromoExpanded ? "Скрыть детали" : "Детали заказа"}
      </button>

      {isPromoExpanded && (
        <div className="mobile-cart-summary__details">
          <div className="mobile-cart-summary__row">
            <span>{selectedCount} товара</span>
            <span>{parseFloat(total).toLocaleString("ru-RU")} ₽</span>
          </div>
          {parseFloat(discount) > 0 && (
            <div className="mobile-cart-summary__row mobile-cart-summary__row--discount">
              <span>Скидка</span>
              <span>-{parseFloat(discount).toLocaleString("ru-RU")} ₽</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
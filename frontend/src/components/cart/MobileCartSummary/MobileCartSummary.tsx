import * as React from "react";

import { Button } from "../../ui/Button/Button";
import "./MobileCartSummary.css";

interface MobileCartSummaryProps {
  selectedCount: number;
  total: string;
  onCheckout: () => void;
  disabled?: boolean;
}

export const MobileCartSummary: React.FC<MobileCartSummaryProps> = ({
  selectedCount,
  total,
  onCheckout,
  disabled = false,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

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

      <button
        className="mobile-cart-summary__toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        {isExpanded ? "Скрыть детали" : "Детали заказа"}
      </button>

      {isExpanded && (
        <div className="mobile-cart-summary__details">
          <div className="mobile-cart-summary__row">
            <span>{selectedCount} товара</span>
            <span>{parseFloat(total).toLocaleString("ru-RU")} ₽</span>
          </div>
        </div>
      )}
    </div>
  );
};

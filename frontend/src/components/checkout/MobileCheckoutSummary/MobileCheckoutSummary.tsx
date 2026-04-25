import * as React from "react";
import { Link } from "react-router-dom";

import { Button } from "../../ui/Button/Button";
import { Input } from "../../ui/Input/Input";
import type { OrderTotals } from "../../../types/promo";
import "./MobileCheckoutSummary.css";

interface MobileCheckoutSummaryProps {
  totals: OrderTotals | null;
  selectedCount: number;
  promoCode: string;
  onPromoCodeChange: (value: string) => void;
  onApplyPromo: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  disabled?: boolean;
  offerAccepted: boolean;
  onOfferAcceptedChange: (value: boolean) => void;
}

export const MobileCheckoutSummary: React.FC<MobileCheckoutSummaryProps> = ({
  totals,
  selectedCount,
  promoCode,
  onPromoCodeChange,
  onApplyPromo,
  onSubmit,
  isSubmitting,
  disabled = false,
  offerAccepted,
  onOfferAcceptedChange,
}) => {
  const [isDetailsExpanded, setIsDetailsExpanded] = React.useState(false);

  return (
    <div className="mobile-checkout-summary">
      <div className="mobile-checkout-summary__main">
        <div className="mobile-checkout-summary__total">
          <span className="mobile-checkout-summary__total-label">Итого</span>
          <span className="mobile-checkout-summary__total-value">
            {totals ? `${parseFloat(totals.total).toLocaleString("ru-RU")} ₽` : "0 ₽"}
          </span>
        </div>

        <Button
          className="mobile-checkout-summary__submit-btn"
          onClick={onSubmit}
          disabled={disabled || isSubmitting || selectedCount === 0 || !offerAccepted}
        >
          {isSubmitting ? "Оформление..." : "Оформить заказ"}
        </Button>
      </div>

      <label className="mobile-checkout-offer-consent">
        <input
          type="checkbox"
          checked={offerAccepted}
          onChange={(e) => onOfferAcceptedChange(e.target.checked)}
          className="mobile-checkout-offer-consent__checkbox"
        />
        <span className="mobile-checkout-offer-consent__text">
          Согласен с{" "}
          <Link to="/offer" target="_blank" className="mobile-checkout-offer-consent__link">
            офертой
          </Link>{" "}
          и{" "}
          <Link to="/privacy" target="_blank" className="mobile-checkout-offer-consent__link">
            политикой конфиденциальности
          </Link>
        </span>
      </label>

      {isDetailsExpanded && (
        <div className="mobile-checkout-summary__promo">
          <Input
            type="text"
            placeholder="Промокод"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e.target.value)}
          />
          <Button
            variant="outline"
            size="md"
            onClick={onApplyPromo}
          >
            Применить
          </Button>
        </div>
      )}

      <button
        className="mobile-checkout-summary__toggle"
        onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
        aria-expanded={isDetailsExpanded}
      >
        {isDetailsExpanded ? "Скрыть детали" : "Детали заказа"}
      </button>

      {isDetailsExpanded && totals && (
        <div className="mobile-checkout-summary__details">
          <div className="mobile-checkout-summary__row">
            <span>{selectedCount} товара</span>
            <span>{parseFloat(totals.subtotal).toLocaleString("ru-RU")} ₽</span>
          </div>
          {parseFloat(totals.promo_discount) > 0 && (
            <div className="mobile-checkout-summary__row mobile-checkout-summary__row--discount">
              <span>Скидка по промокоду</span>
              <span>-{parseFloat(totals.promo_discount).toLocaleString("ru-RU")} ₽</span>
            </div>
          )}
          <div className="mobile-checkout-summary__row">
            <span>Доставка</span>
            <span>
              {parseFloat(totals.delivery_cost) > 0
                ? `${parseFloat(totals.delivery_cost).toLocaleString("ru-RU")} ₽`
                : "Без доплат"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
import { CreditCard } from "lucide-react";
import "./PaymentMethodSelector.css";

export type PaymentMethod = "new_card";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  className?: string;
}

export const PaymentMethodSelector = ({
  value,
  onChange,
  className = "",
}: PaymentMethodSelectorProps) => {
  return (
    <div className={`payment-method-selector ${className}`}>
      <button
        type="button"
        className={`payment-card ${
          value === "new_card" ? "payment-card--selected" : ""
        }`}
        onClick={() => onChange("new_card")}
      >
        <CreditCard size={28} className="payment-card__icon" />
        <span className="payment-card__label">Новой картой</span>
      </button>
    </div>
  );
};

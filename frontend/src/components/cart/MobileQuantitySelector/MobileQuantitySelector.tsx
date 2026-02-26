import * as React from "react";
import { Minus, Plus } from "lucide-react";
import "./MobileQuantitySelector.css";

interface MobileQuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export const MobileQuantitySelector: React.FC<MobileQuantitySelectorProps> = ({
  quantity,
  onDecrease,
  onIncrease,
  min = 1,
  max,
  disabled = false,
}) => {
  const canDecrease = quantity > min && !disabled;
  const canIncrease = !max || quantity < max;

  return (
    <div className="mobile-quantity-selector">
      <button
        className="mobile-quantity-selector__btn"
        onClick={onDecrease}
        disabled={!canDecrease}
        aria-label="Уменьшить количество"
      >
        <Minus size={16} />
      </button>
      <span className="mobile-quantity-selector__value">{quantity}</span>
      <button
        className="mobile-quantity-selector__btn"
        onClick={onIncrease}
        disabled={!canIncrease || disabled}
        aria-label="Увеличить количество"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};
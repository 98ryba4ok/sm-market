import "./DeliveryMethodSelector.css";

export type DeliveryMethod = "courier" | "pickup";

interface DeliveryMethodSelectorProps {
  value: DeliveryMethod;
  onChange: (method: DeliveryMethod) => void;
  className?: string;
}

export const DeliveryMethodSelector = ({
  value,
  onChange,
  className = "",
}: DeliveryMethodSelectorProps) => {
  return (
    <div className={`delivery-method-selector ${className}`}>
      <button
        type="button"
        className={`delivery-method-btn ${
          value === "courier" ? "delivery-method-btn--active" : ""
        }`}
        onClick={() => onChange("courier")}
      >
        Курьером
      </button>
      <button
        type="button"
        className={`delivery-method-btn ${
          value === "pickup" ? "delivery-method-btn--active" : ""
        }`}
        onClick={() => onChange("pickup")}
      >
        Самовывоз
      </button>
    </div>
  );
};

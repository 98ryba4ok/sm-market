import { InputHTMLAttributes } from "react";
import "./Checkbox.css";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Checkbox = ({ label, error, className = "", ...props }: CheckboxProps) => {
  return (
    <div className={`checkbox ${className}`}>
      <label className="checkbox__label">
        <input
          type="checkbox"
          className="checkbox__input"
          {...props}
        />
        {label && <span className="checkbox__text">{label}</span>}
      </label>
      {error && <span className="checkbox__error">{error}</span>}
    </div>
  );
};

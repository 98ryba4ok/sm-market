import type { InputHTMLAttributes } from "react";
import { Calendar } from "lucide-react";
import "./DatePicker.css";

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const DatePicker = ({
  label,
  error,
  className = "",
  ...props
}: DatePickerProps) => {
  return (
    <div className={`date-picker-wrapper ${className}`}>
      {label && <label className="date-picker__label">{label}</label>}
      <div className="date-picker">
        <input
          type="date"
          className={`date-picker__input ${error ? "date-picker__input--error" : ""}`}
          {...props}
        />
        <Calendar className="date-picker__icon" size={20} />
      </div>
      {error && <span className="date-picker__error">{error}</span>}
    </div>
  );
};

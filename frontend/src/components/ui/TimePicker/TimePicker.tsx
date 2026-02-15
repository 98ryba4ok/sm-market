import { InputHTMLAttributes } from "react";
import { Clock } from "lucide-react";
import "./TimePicker.css";

interface TimePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const TimePicker = ({
  label,
  error,
  className = "",
  ...props
}: TimePickerProps) => {
  return (
    <div className={`time-picker-wrapper ${className}`}>
      {label && <label className="time-picker__label">{label}</label>}
      <div className="time-picker">
        <input
          type="time"
          className={`time-picker__input ${error ? "time-picker__input--error" : ""}`}
          {...props}
        />
        <Clock className="time-picker__icon" size={20} />
      </div>
      {error && <span className="time-picker__error">{error}</span>}
    </div>
  );
};

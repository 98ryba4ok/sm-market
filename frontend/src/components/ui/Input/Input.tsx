import type { InputHTMLAttributes } from "react";
import "./Input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({
  label,
  error,
  className = "",
  ...props
}: InputProps) => {
  const inputClasses = `input ${error ? "input--error" : ""} ${className}`;

  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <input className={inputClasses} {...props} />
      {error && <p className="input-error-message">{error}</p>}
    </div>
  );
};

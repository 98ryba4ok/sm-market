import type { TextareaHTMLAttributes } from "react";
import "./Textarea.css";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = ({
  label,
  error,
  className = "",
  ...props
}: TextareaProps) => {
  return (
    <div className={`textarea-wrapper ${className}`}>
      {label && <label className="textarea__label">{label}</label>}
      <textarea
        className={`textarea ${error ? "textarea--error" : ""}`}
        {...props}
      />
      {error && <span className="textarea__error">{error}</span>}
    </div>
  );
};

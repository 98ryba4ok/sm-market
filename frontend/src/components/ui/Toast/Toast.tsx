import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { useEffect } from "react";
import "./Toast.css";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export const Toast = ({ message, type = "success", duration = 3000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
  };

  return (
    <div className={`toast toast--${type}`}>
      <div className="toast__icon">{icons[type]}</div>
      <p className="toast__message">{message}</p>
      <button className="toast__close" onClick={onClose} aria-label="Закрыть">
        <X size={18} />
      </button>
    </div>
  );
};
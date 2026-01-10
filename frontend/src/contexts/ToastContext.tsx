import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useState } from "react";

import type { ToastProps } from "../components/ui/Toast/Toast";
import { Toast } from "../components/ui/Toast/Toast";

interface ToastContextType {
  showToast: (message: string, type?: ToastProps["type"]) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

interface ToastState {
  id: number;
  message: string;
  type: ToastProps["type"];
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [nextId, setNextId] = useState(0);

  const showToast = useCallback((message: string, type: ToastProps["type"] = "success") => {
    const id = nextId;
    setNextId(prev => prev + 1);
    setToasts(prev => [...prev, { id, message, type }]);
  }, [nextId]);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 9999 }}>
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              marginBottom: index < toasts.length - 1 ? "0.5rem" : "0",
            }}
          >
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
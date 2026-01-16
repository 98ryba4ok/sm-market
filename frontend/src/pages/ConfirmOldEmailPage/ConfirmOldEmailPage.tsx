import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { authApi } from "../../api/authApi";
import "./ConfirmOldEmailPage.css";

export const ConfirmOldEmailPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const confirmEmail = async () => {
      if (!token) {
        if (isMounted) {
          setStatus("error");
          setMessage("Токен подтверждения не найден");
        }
        return;
      }

      try {
        console.log("[ConfirmOldEmailPage] Confirming old email with token:", token);
        const response = await authApi.confirmOldEmail({ token });
        console.log("[ConfirmOldEmailPage] Confirmation successful:", response.data);
        
        if (isMounted) {
          setStatus("success");
          setMessage(response.data.detail);
        }
      } catch (error: any) {
        console.error("[ConfirmOldEmailPage] Confirmation error:", error);
        console.error("[ConfirmOldEmailPage] Error response:", error.response?.data);
        
        if (isMounted) {
          setStatus("error");
          setMessage(
            error.response?.data?.detail ||
            error.response?.data?.error ||
            "Не удалось подтвердить email. Возможно, токен истек или недействителен."
          );
        }
      }
    };

    confirmEmail();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="confirm-email-page">
      <div className="confirm-email-container">
        {status === "loading" && (
          <div className="confirm-email-loading">
            <div className="spinner"></div>
            <h2>Подтверждение email...</h2>
            <p>Пожалуйста, подождите</p>
          </div>
        )}

        {status === "success" && (
          <div className="confirm-email-success">
            <div className="success-icon">✓</div>
            <h2>Email подтвержден</h2>
            <p className="success-message">{message}</p>
            <p className="next-step">
              Теперь проверьте новый email для завершения смены адреса.
            </p>
            <button onClick={handleGoHome} className="btn-primary">
              На главную
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="confirm-email-error">
            <div className="error-icon">✕</div>
            <h2>Ошибка подтверждения</h2>
            <p className="error-message">{message}</p>
            <div className="error-actions">
              <button onClick={handleGoHome} className="btn-secondary">
                На главную
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
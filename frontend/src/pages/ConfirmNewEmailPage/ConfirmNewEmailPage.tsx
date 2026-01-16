import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { authApi } from "../../api/authApi";
import { performLogout } from "../../utils/auth";
import "./ConfirmNewEmailPage.css";

export const ConfirmNewEmailPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [newEmail, setNewEmail] = useState("");

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
        console.log("[ConfirmNewEmailPage] Confirming new email with token:", token);
        const response = await authApi.confirmNewEmail({ token });
        console.log("[ConfirmNewEmailPage] Confirmation successful:", response.data);
        
        if (isMounted) {
          // Автоматически выходим из аккаунта после успешной смены email
          console.log("[ConfirmNewEmailPage] Performing logout after email change");
          performLogout();
          
          setStatus("success");
          setMessage(response.data.detail);
          if (response.data.new_email) {
            setNewEmail(response.data.new_email);
          }
        }
      } catch (error: any) {
        console.error("[ConfirmNewEmailPage] Confirmation error:", error);
        console.error("[ConfirmNewEmailPage] Error response:", error.response?.data);
        
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

  const handleGoToLogin = () => {
    // Перенаправляем на главную, где пользователь может войти заново
    navigate("/");
  };

  return (
    <div className="confirm-new-email-page">
      <div className="confirm-new-email-container">
        {status === "loading" && (
          <div className="confirm-new-email-loading">
            <div className="spinner"></div>
            <h2>Подтверждение нового email...</h2>
            <p>Пожалуйста, подождите</p>
          </div>
        )}

        {status === "success" && (
          <div className="confirm-new-email-success">
            <div className="success-icon">✓</div>
            <h2>Email успешно изменен!</h2>
            <p className="success-message">{message}</p>
            {newEmail && (
              <div className="new-email-info">
                <p>Ваш новый email:</p>
                <p className="email-value">{newEmail}</p>
              </div>
            )}
            <div className="security-notice">
              <p><strong>Важно:</strong></p>
              <p>Все активные сессии были завершены для безопасности.</p>
              <p>Вы автоматически вышли из аккаунта.</p>
              <p>Войдите заново, используя новый email.</p>
            </div>
            <div className="action-buttons">
              <button onClick={handleGoToLogin} className="btn-primary">
                Войти с новым email
              </button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="confirm-new-email-error">
            <div className="error-icon">✕</div>
            <h2>Ошибка подтверждения</h2>
            <p className="error-message">{message}</p>
            <div className="error-actions">
              <button onClick={handleGoToLogin} className="btn-secondary">
                На главную
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
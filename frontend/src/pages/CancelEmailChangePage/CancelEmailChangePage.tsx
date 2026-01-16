import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { authApi } from "../../api/authApi";
import "./CancelEmailChangePage.css";

export const CancelEmailChangePage = () => {
  const { token: cancelToken } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {

    if (!cancelToken) {
      setStatus("error");
      setMessage("Токен отмены не найден");
      return;
    }

    const cancelEmailChange = async () => {
      try {
        const response = await authApi.cancelEmailChange({ cancel_token: cancelToken });
        setStatus("success");
        setMessage(response.data.detail);
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Не удалось отменить смену email. Возможно, токен истек или недействителен."
        );
      }
    };

    cancelEmailChange();
  }, [cancelToken]);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="cancel-email-page">
      <div className="cancel-email-container">
        {status === "loading" && (
          <div className="cancel-email-loading">
            <div className="spinner"></div>
            <h2>Отмена смены email...</h2>
            <p>Пожалуйста, подождите</p>
          </div>
        )}

        {status === "success" && (
          <div className="cancel-email-success">
            <div className="success-icon">✓</div>
            <h2>Смена email отменена</h2>
            <p className="success-message">{message}</p>
            <div className="security-warning">
              <div className="warning-icon">⚠️</div>
              <div className="warning-content">
                <p><strong>Важно для безопасности:</strong></p>
                <p>Ваш аккаунт был временно заблокирован для защиты.</p>
                <p>Мы отправили вам письмо с инструкциями по восстановлению доступа.</p>
              </div>
            </div>
            <div className="next-steps">
              <h3>Что делать дальше?</h3>
              <ol>
                <li>Проверьте вашу почту</li>
                <li>Следуйте инструкциям в письме</li>
                <li>Смените пароль для безопасности</li>
                <li>Проверьте активность в аккаунте</li>
              </ol>
            </div>
            <button onClick={handleGoHome} className="btn-primary">
              На главную
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="cancel-email-error">
            <div className="error-icon">✕</div>
            <h2>Ошибка отмены</h2>
            <p className="error-message">{message}</p>
            <div className="error-help">
              <p>Возможные причины:</p>
              <ul>
                <li>Токен отмены истек (доступен 48 часов)</li>
                <li>Смена email уже была отменена</li>
                <li>Смена email уже завершена</li>
              </ul>
              <p>Если вы считаете, что это ошибка, обратитесь в поддержку.</p>
            </div>
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
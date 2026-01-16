import { AlertTriangle, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { authApi } from "../../api/authApi";
import { useToast } from "../../contexts/ToastContext";
import "./AccountCompromisedPage.css";

export const AccountCompromisedPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Недействительная ссылка");
      setLoading(false);
      return;
    }

    handleTokenValidation();
  }, [token]);

  const handleTokenValidation = async () => {
    setLoading(true);
    try {
      const response = await authApi.validateCompromisedToken({ token: token! });
      setSuccess(true);
      setUserEmail(response.data.email);
      showToast(response.data.detail, "success");
    } catch (err) {
      console.error("Error validating token:", err);
      setError("Ссылка недействительна или истекла");
      showToast("Не удалось обработать запрос", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="account-compromised-page">
        <div className="account-compromised-container">
          <Loader className="loading-spinner" size={48} />
          <p>Обработка запроса...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-compromised-page">
        <div className="account-compromised-container account-compromised-container--error">
          <AlertTriangle size={64} className="icon-error" />
          <h1>Ошибка</h1>
          <p>{error}</p>
          <button 
            className="btn-primary"
            onClick={() => navigate("/")}
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="account-compromised-page">
        <div className="account-compromised-container account-compromised-container--success">
          <h1>Ссылка для сброса пароля отправлена</h1>
          <p>
            Мы отправили ссылку для создания нового пароля на ваш email:
          </p>
          <p className="email-display">{userEmail}</p>
          <div className="info-box">
            <h3>Что делать дальше:</h3>
            <ol>
              <li>Проверьте почтовый ящик (и папку "Спам")</li>
              <li>Перейдите по ссылке из письма</li>
              <li>Создайте новый надежный пароль</li>
              <li>Войдите в аккаунт с новым паролем</li>
            </ol>
          </div>
          <div className="security-tips">
            <h3>🔒 Рекомендации по безопасности:</h3>
            <ul>
              <li>Используйте уникальный пароль для каждого сервиса</li>
              <li>Пароль должен содержать минимум 8 символов</li>
              <li>Не сообщайте пароль третьим лицам</li>
              <li>Регулярно меняйте пароли</li>
            </ul>
          </div>
          <button 
            className="btn-secondary"
            onClick={() => navigate("/")}
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return null;
};
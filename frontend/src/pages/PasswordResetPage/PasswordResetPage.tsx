import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { authApi } from "../../api/authApi";
import { Button } from "../../components/ui/Button/Button";
import { Input } from "../../components/ui/Input/Input";
import { useToast } from "../../contexts/ToastContext";
import "./PasswordResetPage.css";

export const PasswordResetPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Валидация
    const newErrors: { newPassword?: string; confirmPassword?: string } = {};
    if (!newPassword) {
      newErrors.newPassword = "Пароль обязателен";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Пароль должен содержать минимум 8 символов";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Подтверждение пароля обязательно";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!token) {
      showToast("Недействительная ссылка", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.passwordResetConfirm({
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      showToast(response.data.detail, "success");
      setTimeout(() => {
        navigate("/");
        window.dispatchEvent(new CustomEvent("openLoginModal"));
      }, 2000);
    } catch (err) {
      console.error("Error resetting password:", err);
      showToast("Не удалось сбросить пароль. Возможно, ссылка устарела.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="password-reset-page">
      <div className="password-reset-container">
        <h1 className="password-reset-title">Создание нового пароля</h1>
        <p className="password-reset-subtitle">
          Введите новый пароль для вашего аккаунта
        </p>

        <form onSubmit={handleSubmit} className="password-reset-form">
          <div className="password-reset-form__field">
            <Input
              type="password"
              label="Новый пароль"
              placeholder="Введите новый пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={errors.newPassword}
              required
              disabled={isLoading}
            />
            <span className="form-hint">Минимум 8 символов</span>
          </div>

          <Input
            type="password"
            label="Подтвердите пароль"
            placeholder="Повторите новый пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            required
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            {isLoading ? "Сохранение..." : "Сохранить новый пароль"}
          </Button>
        </form>
      </div>
    </div>
  );
};
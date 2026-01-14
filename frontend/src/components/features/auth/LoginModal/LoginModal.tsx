import { useState } from "react";

import { authApi } from "../../../../api/authApi";
import { Button } from "../../../ui/Button/Button";
import { Input } from "../../../ui/Input/Input";
import { Modal } from "../../../ui/Modal/Modal";
import "./LoginModal.css";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToRegister: () => void;
  onSwitchToPasswordReset: () => void;
}

export const LoginModal = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToRegister,
  onSwitchToPasswordReset,
}: LoginModalProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Валидация
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email) {
      newErrors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Неверный формат email";
    }
    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      // Сохраняем токены
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      // Получаем данные пользователя
      const userResponse = await authApi.me();
      localStorage.setItem("userEmail", userResponse.data.email);

      // Успех
      setFormData({ email: "", password: "" });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        setErrors({ general: "Неверный email или пароль" });
      } else {
        setErrors({ general: "Ошибка при входе. Попробуйте позже" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ email: "", password: "" });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Вход в аккаунт">
      <form onSubmit={handleSubmit} className="login-form">
        {errors.general && (
          <div className="login-form__error-message">{errors.general}</div>
        )}

        <Input
          type="email"
          label="Email"
          placeholder="example@mail.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
        />

        <Input
          type="password"
          label="Пароль"
          placeholder="Введите пароль"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          required
        />

        <Button type="submit" variant="primary" disabled={isLoading} style={{ width: "100%" }}>
          {isLoading ? "Вход..." : "Войти"}
        </Button>

        <div className="login-form__footer">
          <p className="login-form__switch-text">
            <button
              type="button"
              className="login-form__switch-btn"
              onClick={() => {
                handleClose();
                onSwitchToPasswordReset();
              }}
            >
              Забыли пароль?
            </button>
          </p>
          <p className="login-form__switch-text">
            Нет аккаунта?{" "}
            <button
              type="button"
              className="login-form__switch-btn"
              onClick={() => {
                handleClose();
                onSwitchToRegister();
              }}
            >
              Зарегистрироваться
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

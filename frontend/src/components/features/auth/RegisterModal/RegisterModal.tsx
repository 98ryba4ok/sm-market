import { useState } from "react";
import { Modal } from "../../../ui/Modal/Modal";
import { Input } from "../../../ui/Input/Input";
import { Button } from "../../../ui/Button/Button";
import { authApi } from "../../../../api/authApi";
import "./RegisterModal.css";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToLogin,
}: RegisterModalProps) => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Валидация
    const newErrors: any = {};
    if (!formData.email) {
      newErrors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Неверный формат email";
    }
    if (!formData.phone) {
      newErrors.phone = "Телефон обязателен";
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
      newErrors.phone = "Неверный формат телефона";
    }
    if (!formData.password) {
      newErrors.password = "Пароль обязателен";
    } else if (formData.password.length < 8) {
      newErrors.password = "Пароль должен быть не менее 8 символов";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Регистрация
      await authApi.register({
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      // Автоматический вход после регистрации
      const loginResponse = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      // Сохраняем токены
      localStorage.setItem("accessToken", loginResponse.data.access);
      localStorage.setItem("refreshToken", loginResponse.data.refresh);

      // Получаем данные пользователя
      const userResponse = await authApi.me();
      localStorage.setItem("userEmail", userResponse.data.email);

      // Успех
      setFormData({ email: "", phone: "", password: "", confirmPassword: "" });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Register error:", error);
      if (error.response?.data?.email) {
        setErrors({ email: "Пользователь с таким email уже существует" });
      } else if (error.response?.data?.phone) {
        setErrors({ phone: "Пользователь с таким телефоном уже существует" });
      } else {
        setErrors({ general: "Ошибка при регистрации. Попробуйте позже" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ email: "", phone: "", password: "", confirmPassword: "" });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Регистрация">
      <form onSubmit={handleSubmit} className="register-form">
        {errors.general && (
          <div className="register-form__error-message">{errors.general}</div>
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
          type="tel"
          label="Телефон"
          placeholder="+7 (999) 123-45-67"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          error={errors.phone}
          required
        />

        <Input
          type="password"
          label="Пароль"
          placeholder="Минимум 8 символов"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          required
        />

        <Input
          type="password"
          label="Подтверждение пароля"
          placeholder="Повторите пароль"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          error={errors.confirmPassword}
          required
        />

        <Button type="submit" variant="primary" disabled={isLoading} style={{ width: "100%" }}>
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>

        <div className="register-form__footer">
          <p className="register-form__switch-text">
            Уже есть аккаунт?{" "}
            <button
              type="button"
              className="register-form__switch-btn"
              onClick={() => {
                handleClose();
                onSwitchToLogin();
              }}
            >
              Войти
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

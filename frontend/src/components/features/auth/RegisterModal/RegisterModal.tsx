import { useState } from "react";

import { authApi } from "../../../../api/authApi";
import { Button } from "../../../ui/Button/Button";
import { Input } from "../../../ui/Input/Input";
import { Modal } from "../../../ui/Modal/Modal";
import { PasswordInput } from "../../../ui/PasswordInput";
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
    first_name: "",
    last_name: "",
    middle_name: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Валидация
    const newErrors: any = {};
    if (!formData.last_name) {
      newErrors.last_name = "Фамилия обязательна";
    }
    if (!formData.first_name) {
      newErrors.first_name = "Имя обязательно";
    }
    if (!formData.middle_name) {
      newErrors.middle_name = "Отчество обязательно";
    }
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
      // Регистрация (теперь возвращает токены сразу)
      const registerResponse = await authApi.register({
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        middle_name: formData.middle_name,
      });

      // Сохраняем токены из response регистрации
      localStorage.setItem("accessToken", registerResponse.data.access);
      localStorage.setItem("refreshToken", registerResponse.data.refresh);
      localStorage.setItem("userEmail", registerResponse.data.email);

      // Успех
      setFormData({
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        middle_name: "",
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Register error:", error);
      if (error.response?.data?.email) {
        setErrors({ email: "Пользователь с таким email уже существует" });
      } else if (error.response?.data?.phone) {
        setErrors({ phone: "Пользователь с таким телефоном уже существует" });
      } else if (error.response?.data) {
        // Обрабатываем ошибки валидации полей ФИО
        const apiErrors: any = {};
        if (error.response.data.first_name) {
          apiErrors.first_name = error.response.data.first_name[0];
        }
        if (error.response.data.last_name) {
          apiErrors.last_name = error.response.data.last_name[0];
        }
        if (error.response.data.middle_name) {
          apiErrors.middle_name = error.response.data.middle_name[0];
        }
        setErrors(Object.keys(apiErrors).length > 0 ? apiErrors : { general: "Ошибка при регистрации. Попробуйте позже" });
      } else {
        setErrors({ general: "Ошибка при регистрации. Попробуйте позже" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
      middle_name: "",
    });
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
          type="text"
          label="Фамилия"
          placeholder="Иванов"
          value={formData.last_name}
          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          error={errors.last_name}
          required
        />

        <Input
          type="text"
          label="Имя"
          placeholder="Иван"
          value={formData.first_name}
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          error={errors.first_name}
          required
        />

        <Input
          type="text"
          label="Отчество"
          placeholder="Иванович"
          value={formData.middle_name}
          onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
          error={errors.middle_name}
          required
        />

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

        <PasswordInput
          label="Пароль"
          placeholder="Минимум 8 символов"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
          required
        />

        <PasswordInput
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

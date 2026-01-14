import { useState } from "react";

import { authApi } from "../../../../api/authApi";
import { useToast } from "../../../../contexts/ToastContext";
import { Button } from "../../../ui/Button/Button";
import { Input } from "../../../ui/Input/Input";
import { Modal } from "../../../ui/Modal/Modal";
import "./PasswordResetModal.css";

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordResetModal = ({ isOpen, onClose }: PasswordResetModalProps) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Валидация
    if (!email) {
      setError("Email обязателен");
      setIsLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Неверный формат email");
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.passwordResetRequest({ email });
      showToast(response.data.detail, "success");
      onClose();
      setEmail("");
    } catch (err) {
      console.error("Error requesting password reset:", err);
      setError("Не удалось отправить запрос на сброс пароля");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Восстановление пароля">
      <form onSubmit={handleSubmit} className="password-reset-form">
        <p className="password-reset-form__description">
          Введите email, на который зарегистрирован аккаунт. Мы отправим вам ссылку для сброса пароля.
        </p>

        {error && (
          <div className="password-reset-form__error-message">{error}</div>
        )}

        <Input
          type="email"
          label="Email"
          placeholder="example@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          required
        />

        <Button type="submit" variant="primary" disabled={isLoading} style={{ width: "100%" }}>
          {isLoading ? "Отправка..." : "Отправить ссылку"}
        </Button>
      </form>
    </Modal>
  );
};
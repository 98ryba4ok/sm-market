import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "../../components/ui/Button/Button";
import { useToast } from "../../contexts/ToastContext";
import "./PaymentReturnPage.css";

export const PaymentReturnPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

  useEffect(() => {
    checkPaymentStatus();
  }, []);

  const checkPaymentStatus = async () => {
    const paymentId = searchParams.get("payment_id");
    const orderId = searchParams.get("order_id");

    if (!paymentId || !orderId) {
      setStatus("failed");
      return;
    }

    try {
      setStatus("success");
      showToast("Оплата прошла успешно!", "success");
      
      setTimeout(() => {
        navigate(`/orders`);
      }, 2000);
    } catch (error) {
      console.error("Payment check failed:", error);
      setStatus("failed");
    }
  };

  if (status === "loading") {
    return (
      <div className="payment-return-page">
        <div className="payment-return-page__container">
          <div className="payment-return-card">
            <h1 className="payment-return-card__title">
              Проверка статуса оплаты...
            </h1>
            <p className="payment-return-card__text">
              Пожалуйста, подождите
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="payment-return-page">
        <div className="payment-return-page__container">
          <div className="payment-return-card payment-return-card--success">
            <div className="payment-return-card__icon">✓</div>
            <h1 className="payment-return-card__title">
              Оплата прошла успешно!
            </h1>
            <p className="payment-return-card__text">
              Вы будете перенаправлены на страницу заказов...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-return-page">
      <div className="payment-return-page__container">
        <div className="payment-return-card payment-return-card--error">
          <div className="payment-return-card__icon">✗</div>
          <h1 className="payment-return-card__title">
            Ошибка при проверке оплаты
          </h1>
          <p className="payment-return-card__text">
            Пожалуйста, проверьте статус заказа в личном кабинете
          </p>
          <div className="payment-return-card__actions">
            <Button onClick={() => navigate("/orders")}>
              Перейти к заказам
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

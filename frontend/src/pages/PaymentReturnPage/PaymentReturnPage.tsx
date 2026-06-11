import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "../../components/ui/Button/Button";
import { useToast } from "../../contexts/ToastContext";
import { paymentApi } from "../../api/paymentApi";
import "./PaymentReturnPage.css";

export const PaymentReturnPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    checkPaymentStatus();
    return () => {
      if (pollingRef.current) clearTimeout(pollingRef.current);
    };
  }, []);

  const checkPaymentStatus = async () => {
    const orderIdStr = searchParams.get("order_id");
    if (!orderIdStr) {
      setStatus("failed");
      return;
    }

    const orderId = parseInt(orderIdStr, 10);
    attemptsRef.current += 1;

    try {
      const { data } = await paymentApi.checkPaymentStatus(orderId);

      if (data.paid || data.status === "succeeded") {
        setStatus("success");
        showToast("Оплата прошла успешно!", "success");
        setTimeout(() => navigate("/orders"), 2500);
        return;
      }

      if (data.status === "canceled") {
        setStatus("failed");
        return;
      }

      // Ещё в статусе pending — повторяем не более 10 раз
      if (attemptsRef.current < 10) {
        pollingRef.current = setTimeout(checkPaymentStatus, 2000);
      } else {
        // Превысили лимит попыток — отправляем на страницу заказов
        setStatus("failed");
      }
    } catch (error) {
      console.error("Payment check failed:", error);
      if (attemptsRef.current < 3) {
        pollingRef.current = setTimeout(checkPaymentStatus, 2000);
      } else {
        setStatus("failed");
      }
    }
  };

  if (status === "loading") {
    return (
      <div className="payment-return-page">
        <div className="payment-return-page__container">
          <div className="payment-return-card">
            <div className="payment-return-card__spinner" />
            <h1 className="payment-return-card__title">Проверка статуса оплаты...</h1>
            <p className="payment-return-card__text">Пожалуйста, подождите</p>
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
            <h1 className="payment-return-card__title">Оплата прошла успешно!</h1>
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
          <h1 className="payment-return-card__title">Ошибка при проверке оплаты</h1>
          <p className="payment-return-card__text">
            Пожалуйста, проверьте статус заказа в личном кабинете
          </p>
          <div className="payment-return-card__actions">
            <Button onClick={() => navigate("/orders")}>Перейти к заказам</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

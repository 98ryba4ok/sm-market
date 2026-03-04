import { Check, Package, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "../../components/ui/Button/Button";
import { useToast } from "../../contexts/ToastContext";
import "./OrderSuccessPage.css";

export const OrderSuccessPage = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { showToast } = useToast();
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  useEffect(() => {
    window.dispatchEvent(new Event("cartUpdated"));
  }, []);

  const handlePayment = async () => {
    if (!orderNumber) return;

    setIsPaymentLoading(true);
    try {
      showToast("Интеграция с ЮКасса будет добавлена позже", "info");
      
    } catch (error: any) {
      console.error("Failed to create payment:", error);
      showToast("Ошибка при создании платежа", "error");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <div className="order-success-page">
      <div className="order-success-page__container">
        <div className="order-success-card">
          <div className="order-success-card__icon">
            <Check size={48} />
          </div>

          <h1 className="order-success-card__title">
            Заказ успешно оформлен!
          </h1>

          {orderNumber && (
            <p className="order-success-card__order-number">
              Номер заказа: <strong>{orderNumber}</strong>
            </p>
          )}

          <p className="order-success-card__text">
            Мы отправили подтверждение на вашу электронную почту.
            <br />
            Вы можете отслеживать статус заказа в личном кабинете.
          </p>

          <div className="order-success-card__actions">
            <Button onClick={handlePayment} disabled={isPaymentLoading}>
              <CreditCard size={20} />
              {isPaymentLoading ? "Создание платежа..." : "Оплатить заказ"}
            </Button>
            <Link to="/orders">
              <Button variant="outline">
                <Package size={20} />
                Перейти к заказам
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline">Продолжить покупки</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

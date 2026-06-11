import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Package, Truck, CheckCircle, XCircle, Calendar, DollarSign } from "lucide-react";

import { ordersApi } from "../../api/ordersApi";
import { paymentApi } from "../../api/paymentApi";
import { useToast } from "../../contexts/ToastContext";
import type { Order } from "../../types/order";
import "./OrdersPage.css";

export const OrdersPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<number | null>(null);
  const [payingOrder, setPayingOrder] = useState<number | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersApi.list();
      setOrders(response.data.results);
    } catch (err: any) {
      console.error("Error loading orders:", err);
      if (err.response?.status === 401) {
        showToast("Войдите в систему для просмотра заказов", "error");
        navigate("/");
      } else {
        showToast("Не удалось загрузить заказы", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm("Вы уверены, что хотите отменить этот заказ?")) {
      return;
    }

    setCancellingOrder(orderId);
    try {
      await ordersApi.cancel(orderId);
      showToast("Заказ успешно отменен", "success");
      loadOrders(); // Перезагружаем список заказов
    } catch (err: any) {
      console.error("Error cancelling order:", err);
      showToast(
        err.response?.data?.detail || "Не удалось отменить заказ",
        "error"
      );
    } finally {
      setCancellingOrder(null);
    }
  };

  const handlePayOrder = async (orderId: number) => {
    setPayingOrder(orderId);
    try {
      const { data } = await paymentApi.createPayment(orderId);
      if (data.confirmation_url) {
        // Переходим на страницу оплаты ЮKassa
        window.location.href = data.confirmation_url;
        return;
      }
      showToast(data.message || "Не удалось создать платёж", "error");
      setPayingOrder(null);
    } catch (err: any) {
      console.error("Error creating payment:", err);
      showToast(
        err.response?.data?.detail || "Не удалось создать платёж",
        "error"
      );
      setPayingOrder(null);
    }
  };

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Package size={20} />;
      case "confirmed":
        return <CheckCircle size={20} />;
      case "shipped":
        return <Truck size={20} />;
      case "delivered":
        return <CheckCircle size={20} />;
      case "cancelled":
        return <XCircle size={20} />;
      default:
        return <Package size={20} />;
    }
  };

  const getOrderStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "В обработке",
      confirmed: "Подтвержден",
      shipped: "Отправлен",
      delivered: "Доставлен",
      cancelled: "Отменен",
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Ожидает оплаты",
      paid: "Оплачен",
      failed: "Ошибка оплаты",
      refunded: "Возвращен",
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-page__container">
          <div className="orders-page__loading">Загрузка заказов...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-page__container">
        <div className="orders-page__header">
          <h1 className="orders-page__title">Мои заказы</h1>
          <p className="orders-page__subtitle">
            Всего заказов: {orders.length}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="orders-page__empty">
            <ShoppingBag size={64} className="orders-page__empty-icon" />
            <h2 className="orders-page__empty-title">У вас пока нет заказов</h2>
            <p className="orders-page__empty-text">
              Оформите первый заказ в нашем каталоге
            </p>
            <button
              className="orders-page__empty-btn"
              onClick={() => navigate("/catalog")}
            >
              Перейти в каталог
            </button>
          </div>
        ) : (
          <div className="orders-page__list">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const isCancelling = cancellingOrder === order.id;
              const isPaying = payingOrder === order.id;
              const canPay =
                order.payment_status === "pending" &&
                order.status !== "cancelled";

              return (
                <div
                  key={order.id}
                  className={`order ${isExpanded ? "order--expanded" : ""}`}
                >
                  {/* Заголовок заказа */}
                  <div
                    className="order__header"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <div className="order__header-left">
                      <div className="order__number">
                        Заказ #{order.order_number}
                      </div>
                      <div className="order__date">
                        <Calendar size={16} />
                        {formatDate(order.created_at)}
                      </div>
                    </div>

                    <div className="order__header-right">
                      <div
                        className={`order__status order__status--${order.status}`}
                      >
                        {getOrderStatusIcon(order.status)}
                        <span>{getOrderStatusText(order.status)}</span>
                      </div>
                      <div className="order__total">
                        <DollarSign size={16} />
                        {Number(order.total_amount).toLocaleString("ru-RU")} ₽
                      </div>
                    </div>
                  </div>

                  {/* Детали заказа */}
                  {isExpanded && (
                    <div className="order__details">
                      {/* Информация о доставке */}
                      <div className="order__section">
                        <h3 className="order__section-title">
                          Информация о доставке
                        </h3>
                        <div className="order__info-grid">
                          <div className="order__info-item">
                            <span className="order__info-label">Адрес:</span>
                            <span className="order__info-value">
                              {order.delivery_city}, {order.delivery_address},{" "}
                              {order.delivery_postal_code}
                            </span>
                          </div>
                          <div className="order__info-item">
                            <span className="order__info-label">Телефон:</span>
                            <span className="order__info-value">
                              {order.phone}
                            </span>
                          </div>
                          <div className="order__info-item">
                            <span className="order__info-label">Email:</span>
                            <span className="order__info-value">
                              {order.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Информация об оплате */}
                      <div className="order__section">
                        <h3 className="order__section-title">Оплата</h3>
                        <div className="order__info-grid">
                          <div className="order__info-item">
                            <span className="order__info-label">
                              Способ оплаты:
                            </span>
                            <span className="order__info-value">
                              {order.payment_method_display}
                            </span>
                          </div>
                          <div className="order__info-item">
                            <span className="order__info-label">
                              Статус оплаты:
                            </span>
                            <span
                              className={`order__payment-status order__payment-status--${order.payment_status}`}
                            >
                              {getPaymentStatusText(order.payment_status)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Товары в заказе */}
                      <div className="order__section">
                        <h3 className="order__section-title">
                          Товары ({order.items.length})
                        </h3>
                        <div className="order__items">
                          {order.items.map((item) => (
                            <div key={item.id} className="order-item">
                              <div className="order-item__info">
                                <div className="order-item__name">
                                  {item.product_name}
                                </div>
                                <div className="order-item__meta">
                                  {item.quantity} шт. ×{" "}
                                  {Number(item.price_at_purchase).toLocaleString(
                                    "ru-RU"
                                  )}{" "}
                                  ₽
                                </div>
                              </div>
                              <div className="order-item__total">
                                {Number(item.subtotal).toLocaleString("ru-RU")} ₽
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="order__total-section">
                          <div className="order__total-label">Итого:</div>
                          <div className="order__total-value">
                            {Number(order.total_amount).toLocaleString("ru-RU")}{" "}
                            ₽
                          </div>
                        </div>
                      </div>

                      {/* Действия по заказу */}
                      {(canPay || order.can_be_cancelled) && (
                        <div className="order__actions">
                          {canPay && (
                            <button
                              className="order__pay-btn"
                              onClick={() => handlePayOrder(order.id)}
                              disabled={isPaying}
                            >
                              {isPaying ? "Создание платежа..." : "Оплатить"}
                            </button>
                          )}
                          {order.can_be_cancelled && (
                            <button
                              className="order__cancel-btn"
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={isCancelling}
                            >
                              {isCancelling ? "Отмена..." : "Отменить заказ"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

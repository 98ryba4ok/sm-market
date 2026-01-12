import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Calendar, ShoppingBag, Heart, LogOut, Package } from "lucide-react";

import { authApi } from "../../api/authApi";
import { ordersApi } from "../../api/ordersApi";
import { useToast } from "../../contexts/ToastContext";
import type { Order } from "../../types/order";
import "./ProfilePage.css";

interface UserProfile {
  id: number;
  email: string;
  phone: string | null;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
}

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    loadProfile();
    loadOrders();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await authApi.me();
      setProfile(response.data);
    } catch (err: any) {
      console.error("Error loading profile:", err);
      if (err.response?.status === 401) {
        showToast("Войдите в систему", "error");
        navigate("/");
      } else {
        showToast("Не удалось загрузить профиль", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await ordersApi.list();
      setOrders(response.data.results);
    } catch (err: any) {
      console.error("Error loading orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    showToast("Вы вышли из системы", "success");
    navigate("/");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-page__container">
          <div className="profile-page__loading">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-page__container">
          <div className="profile-page__error">Не удалось загрузить профиль</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-page__container">
        <h1 className="profile-page__title">Мой профиль</h1>

        <div className="profile-page__grid">
          {/* Информация о пользователе */}
          <div className="profile-card">
            <div className="profile-card__header">
              <User size={24} className="profile-card__icon" />
              <h2 className="profile-card__title">Личные данные</h2>
            </div>

            <div className="profile-card__content">
              <div className="profile-info">
                <div className="profile-info__item">
                  <Mail size={20} className="profile-info__icon" />
                  <div className="profile-info__content">
                    <span className="profile-info__label">Email</span>
                    <span className="profile-info__value">{profile.email}</span>
                  </div>
                </div>

                <div className="profile-info__item">
                  <Phone size={20} className="profile-info__icon" />
                  <div className="profile-info__content">
                    <span className="profile-info__label">Телефон</span>
                    <span className="profile-info__value">
                      {profile.phone || "Не указан"}
                    </span>
                  </div>
                </div>

                <div className="profile-info__item">
                  <Calendar size={20} className="profile-info__icon" />
                  <div className="profile-info__content">
                    <span className="profile-info__label">Дата регистрации</span>
                    <span className="profile-info__value">
                      {formatDate(profile.date_joined)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Быстрые действия */}
          <div className="profile-card">
            <div className="profile-card__header">
              <h2 className="profile-card__title">Быстрые действия</h2>
            </div>

            <div className="profile-card__content">
              <div className="profile-actions">
                <button
                  className="profile-action-btn"
                  onClick={() => navigate("/orders")}
                >
                  <Package size={20} />
                  <span>Мои заказы</span>
                </button>

                <button
                  className="profile-action-btn"
                  onClick={() => navigate("/cart")}
                >
                  <ShoppingBag size={20} />
                  <span>Корзина</span>
                </button>

                <button
                  className="profile-action-btn"
                  onClick={() => navigate("/wishlist")}
                >
                  <Heart size={20} />
                  <span>Избранное</span>
                </button>

                <button
                  className="profile-action-btn profile-action-btn--danger"
                  onClick={handleLogout}
                >
                  <LogOut size={20} />
                  <span>Выйти</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* История заказов - краткий обзор */}
        <div className="profile-orders">
          <div className="profile-orders__header">
            <h2 className="profile-orders__title">Последние заказы</h2>
            <button
              className="profile-orders__view-all"
              onClick={() => navigate("/orders")}
            >
              Смотреть все
            </button>
          </div>

          {ordersLoading ? (
            <div className="profile-orders__loading">Загрузка заказов...</div>
          ) : orders.length === 0 ? (
            <div className="profile-orders__empty">
              <ShoppingBag size={48} className="profile-orders__empty-icon" />
              <p className="profile-orders__empty-text">У вас пока нет заказов</p>
              <button
                className="profile-orders__empty-btn"
                onClick={() => navigate("/catalog")}
              >
                Перейти в каталог
              </button>
            </div>
          ) : (
            <div className="profile-orders__list">
              {orders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="order-card"
                  onClick={() => navigate("/orders")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="order-card__header">
                    <div className="order-card__number">
                      Заказ #{order.order_number}
                    </div>
                    <div
                      className={`order-card__status order-card__status--${order.status}`}
                    >
                      {getOrderStatusText(order.status)}
                    </div>
                  </div>

                  <div className="order-card__info">
                    <div className="order-card__info-item">
                      <span className="order-card__info-label">Дата:</span>
                      <span className="order-card__info-value">
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                    <div className="order-card__info-item">
                      <span className="order-card__info-label">Сумма:</span>
                      <span className="order-card__info-value">
                        {Number(order.total_amount).toLocaleString("ru-RU")} ₽
                      </span>
                    </div>
                    <div className="order-card__info-item">
                      <span className="order-card__info-label">Товаров:</span>
                      <span className="order-card__info-value">
                        {order.items.length}
                      </span>
                    </div>
                  </div>

                  <div className="order-card__items">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="order-card__item">
                        {item.product_name} × {item.quantity}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="order-card__item-more">
                        и еще {order.items.length - 3} товар(ов)
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

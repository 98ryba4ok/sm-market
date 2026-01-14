import { Calendar, Heart, Lock, LogOut, Mail, Package, Phone, ShoppingBag, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { authApi } from "../../api/authApi";
import { ordersApi } from "../../api/ordersApi";
import { Input } from "../../components/ui/Input/Input";
import { useToast } from "../../contexts/ToastContext";
import type { User as UserType } from "../../types/auth";
import type { Order } from "../../types/order";
import "./ProfilePage.css";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<UserType | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  
  // Editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [phone, setPhone] = useState("");
  
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    loadProfile();
    loadOrders();
  }, []);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setMiddleName(profile.middle_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await authApi.me();
      setProfile(response.data);
    } catch (err) {
      console.error("Error loading profile:", err);
      const error = err as { response?: { status?: number } };
      if (error.response?.status === 401) {
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
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await authApi.updateProfile({
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName,
        phone: phone,
      });
      setProfile(response.data.user);
      setIsEditingProfile(false);
      showToast(response.data.detail, "success");
    } catch (err) {
      console.error("Error updating profile:", err);
      showToast("Не удалось обновить профиль", "error");
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authApi.changeEmail({
        new_email: newEmail,
        password: emailPassword,
      });
      if (profile) {
        setProfile({ ...profile, email: response.data.email });
      }
      setIsChangingEmail(false);
      setNewEmail("");
      setEmailPassword("");
      showToast(response.data.detail, "success");
    } catch (err) {
      console.error("Error changing email:", err);
      showToast("Не удалось изменить email", "error");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("Пароли не совпадают", "error");
      return;
    }
    try {
      const response = await authApi.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setIsChangingPassword(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast(response.data.detail, "success");
    } catch (err) {
      console.error("Error changing password:", err);
      showToast("Не удалось изменить пароль", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
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

          {/* Редактирование ФИО и телефона */}
          <div className="profile-card">
            <div className="profile-card__header">
              <User size={24} className="profile-card__icon" />
              <h2 className="profile-card__title">Редактировать профиль</h2>
            </div>

            <div className="profile-card__content">
              {!isEditingProfile ? (
                <div className="profile-edit-info">
                  <div className="profile-edit-info__row">
                    <span className="profile-edit-info__label">Имя:</span>
                    <span className="profile-edit-info__value">{profile.first_name || "Не указано"}</span>
                  </div>
                  <div className="profile-edit-info__row">
                    <span className="profile-edit-info__label">Фамилия:</span>
                    <span className="profile-edit-info__value">{profile.last_name || "Не указано"}</span>
                  </div>
                  <div className="profile-edit-info__row">
                    <span className="profile-edit-info__label">Отчество:</span>
                    <span className="profile-edit-info__value">{profile.middle_name || "Не указано"}</span>
                  </div>
                  <div className="profile-edit-info__row">
                    <span className="profile-edit-info__label">Телефон:</span>
                    <span className="profile-edit-info__value">{profile.phone || "Не указан"}</span>
                  </div>
                  <button
                    className="profile-edit-btn"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    Редактировать
                  </button>
                </div>
              ) : (
                <div className="profile-edit-form">
                  <Input
                    type="text"
                    label="Имя"
                    placeholder="Введите имя"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <Input
                    type="text"
                    label="Фамилия"
                    placeholder="Введите фамилию"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <Input
                    type="text"
                    label="Отчество"
                    placeholder="Введите отчество"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />
                  <Input
                    type="tel"
                    label="Телефон"
                    placeholder="+7 (999) 123-45-67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <div className="profile-edit-form__buttons">
                    <button
                      className="profile-edit-btn profile-edit-btn--primary"
                      onClick={handleUpdateProfile}
                    >
                      Сохранить
                    </button>
                    <button
                      className="profile-edit-btn profile-edit-btn--secondary"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setFirstName(profile.first_name || "");
                        setLastName(profile.last_name || "");
                        setMiddleName(profile.middle_name || "");
                        setPhone(profile.phone || "");
                      }}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Смена Email */}
          <div className="profile-card">
            <div className="profile-card__header">
              <Mail size={24} className="profile-card__icon" />
              <h2 className="profile-card__title">Изменить Email</h2>
            </div>

            <div className="profile-card__content">
              {!isChangingEmail ? (
                <div className="profile-edit-info">
                  <p className="profile-edit-info__description">
                    Текущий email: <strong>{profile.email}</strong>
                  </p>
                  <button
                    className="profile-edit-btn"
                    onClick={() => setIsChangingEmail(true)}
                  >
                    Изменить Email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleChangeEmail} className="profile-edit-form">
                  <Input
                    type="email"
                    label="Новый Email"
                    placeholder="new@email.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    label="Текущий пароль"
                    placeholder="Введите текущий пароль для подтверждения"
                    value={emailPassword}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    required
                  />
                  <div className="profile-edit-form__buttons">
                    <button
                      type="submit"
                      className="profile-edit-btn profile-edit-btn--primary"
                    >
                      Сохранить
                    </button>
                    <button
                      type="button"
                      className="profile-edit-btn profile-edit-btn--secondary"
                      onClick={() => {
                        setIsChangingEmail(false);
                        setNewEmail("");
                        setEmailPassword("");
                      }}
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Смена пароля */}
          <div className="profile-card">
            <div className="profile-card__header">
              <Lock size={24} className="profile-card__icon" />
              <h2 className="profile-card__title">Изменить пароль</h2>
            </div>

            <div className="profile-card__content">
              {!isChangingPassword ? (
                <div className="profile-edit-info">
                  <p className="profile-edit-info__description">
                    Измените пароль для повышения безопасности аккаунта
                  </p>
                  <button
                    className="profile-edit-btn"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    Изменить пароль
                  </button>
                </div>
              ) : (
                <form onSubmit={handleChangePassword} className="profile-edit-form">
                  <Input
                    type="password"
                    label="Текущий пароль"
                    placeholder="Введите текущий пароль"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    label="Новый пароль"
                    placeholder="Введите новый пароль"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    label="Подтвердите новый пароль"
                    placeholder="Повторите новый пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <div className="profile-edit-form__buttons">
                    <button
                      type="submit"
                      className="profile-edit-btn profile-edit-btn--primary"
                    >
                      Сохранить
                    </button>
                    <button
                      type="button"
                      className="profile-edit-btn profile-edit-btn--secondary"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setOldPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              )}
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

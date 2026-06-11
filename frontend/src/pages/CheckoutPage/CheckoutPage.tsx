import { ChevronLeft, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { cartApi } from "../../api/cartApi";
import { ordersApi } from "../../api/ordersApi";
import { Button } from "../../components/ui/Button/Button";
import { DatePicker } from "../../components/ui/DatePicker/DatePicker";
import { Input } from "../../components/ui/Input/Input";
import { Textarea } from "../../components/ui/Textarea/Textarea";
import { TimePicker } from "../../components/ui/TimePicker/TimePicker";
import { MobileCheckoutItem } from "../../components/checkout/MobileCheckoutItem";
import { MobileCheckoutSummary } from "../../components/checkout/MobileCheckoutSummary";
import {
  DeliveryMethodSelector,
  type DeliveryMethod,
} from "../../components/checkout/DeliveryMethodSelector/DeliveryMethodSelector";
import {
  PaymentMethodSelector,
  type PaymentMethod,
} from "../../components/checkout/PaymentMethodSelector/PaymentMethodSelector";
import { useToast } from "../../contexts/ToastContext";
import type { Cart } from "../../types/cart";
import type { OrderTotals } from "../../types/promo";
import { getImageUrl } from "../../utils/imageUrl";
import "./CheckoutPage.css";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("new_card");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("courier");

  const [formData, setFormData] = useState({
    city: "",
    address: "",
    postalCode: "",
    phone: "",
    name: "",
    email: "",
  });

  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  const [totals, setTotals] = useState<OrderTotals | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerAccepted, setOfferAccepted] = useState(false);

  const getMinDeliveryDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const minDeliveryDate = getMinDeliveryDate();

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    if (cart && selectedItems.size > 0) {
      calculateTotals();
    }
  }, [selectedItems]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartApi.get();
      setCart(response.data);

      const allItemIds = new Set(response.data.items.map((item) => item.id));
      setSelectedItems(allItemIds);
    } catch (error) {
      console.error("Failed to load cart:", error);
      showToast("Ошибка при загрузке корзины", "error");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = async () => {
    if (!cart || selectedItems.size === 0) return;

    try {
      const response = await cartApi.calculateTotals({
        promo_code: undefined,
        selected_items: Array.from(selectedItems),
      });
      setTotals(response.data);
    } catch (error) {
      console.error("Failed to calculate totals:", error);
    }
  };

  const handleSelectAll = () => {
    if (!cart) return;
    if (selectedItems.size === cart.items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.items.map((item) => item.id)));
    }
  };

  const handleSelectItem = (itemId: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const response = await cartApi.updateItem(itemId, { quantity: newQuantity });
      setCart(response.data);
      await calculateTotals();
      showToast("Количество обновлено", "success");
    } catch (error) {
      console.error("Failed to update quantity:", error);
      showToast("Ошибка при обновлении количества", "error");
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      const response = await cartApi.removeItem(itemId);
      setCart(response.data);
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      window.dispatchEvent(new Event("cartUpdated"));
      showToast("Товар удален из корзины", "success");
    } catch (error) {
      console.error("Failed to remove item:", error);
      showToast("Ошибка при удалении товара", "error");
    }
  };


  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (deliveryMethod === "courier") {
      if (!formData.city.trim()) newErrors.city = "Укажите город";
      if (!formData.address.trim()) newErrors.address = "Укажите адрес доставки";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Укажите телефон";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Укажите email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Некорректный email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast("Заполните все обязательные поля", "error");
      return;
    }

    if (selectedItems.size === 0) {
      showToast("Выберите товары для оформления", "error");
      return;
    }

    if (!offerAccepted) {
      showToast("Необходимо согласиться с условиями оферты", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        delivery_method: deliveryMethod,
        delivery_address: formData.address,
        delivery_city: formData.city,
        delivery_postal_code: formData.postalCode,
        delivery_date: deliveryDate || undefined,
        delivery_time: deliveryTime || undefined,
        phone: formData.phone,
        email: formData.email,
        payment_method: paymentMethod,
        promo_code: undefined,
        selected_items: Array.from(selectedItems),
      };

      const response = await ordersApi.create(orderData);
      showToast("Заказ успешно оформлен!", "success");
      navigate(`/order-success/${response.data.order_number}`);
    } catch (error) {
      console.error("Failed to create order:", error);
      const errorMessage =
        (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail || "Ошибка при создании заказа";
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-page__container">
          <div className="checkout-page__loading">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-page__container">
          <h1 className="checkout-page__title">Оформление заказа</h1>
          <div className="checkout-page__empty">
            <p>Ваша корзина пуста</p>
            <Link to="/">
              <Button>Перейти к покупкам</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isMobile = window.innerWidth < 768;

  return (
    <div className="checkout-page">
      <div className="checkout-page__container">
        <Link to="/cart" className="checkout-page__back">
          <ChevronLeft size={20} />
          Вернуться в корзину
        </Link>

        <h1 className="checkout-page__title">Оформление заказа</h1>

        <div className="checkout-page__content">
          <div className="checkout-page__form">
            <section className="checkout-section">
              <h2 className="checkout-section__title">Способ оплаты</h2>
              <PaymentMethodSelector
                value={paymentMethod}
                onChange={setPaymentMethod}
              />
            </section>

            <section className="checkout-section">
              <h2 className="checkout-section__title">Способ получения</h2>
              <DeliveryMethodSelector
                value={deliveryMethod}
                onChange={setDeliveryMethod}
              />
            </section>

            {deliveryMethod === "courier" ? (
              <section className="checkout-section">
                <h2 className="checkout-section__title">Адрес доставки</h2>
                <div className="checkout-section__grid">
                  <Input
                    label="Город"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    error={errors.city}
                    required
                  />
                  <Input
                    label="Индекс"
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    error={errors.postalCode}
                  />
                </div>
                <Textarea
                  label="Адрес"
                  placeholder="Улица, дом, квартира"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  error={errors.address}
                  rows={3}
                  required
                />
              </section>
            ) : (
              <section className="checkout-section">
                <h2 className="checkout-section__title">Адрес самовывоза</h2>
                <div className="checkout-pickup-address">
                  <p>г. Москва, ул. Дегунинская, д. 17</p>
                  <p className="checkout-pickup-address__hint">Пн–Пт, 10:00–18:00</p>
                </div>
              </section>
            )}

            <section className="checkout-section">
              <h2 className="checkout-section__title">Контактная информация</h2>
              <div className="checkout-section__grid">
                <Input
                  label="Телефон"
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  error={errors.phone}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  error={errors.email}
                  required
                />
              </div>
            </section>

            {deliveryMethod === "courier" && (
              <section className="checkout-section">
                <h2 className="checkout-section__title">Дата и время доставки</h2>
                <div className="checkout-section__grid">
                  <DatePicker
                    label="Дата доставки"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={minDeliveryDate}
                    error={errors.deliveryDate}
                  />
                  <TimePicker
                    label="Время доставки"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                  />
                </div>
              </section>
            )}

            <section className="checkout-section">
              <h2 className="checkout-section__title">
                Всего товаров<sup>{cart.items.length}</sup>
              </h2>
              <div className="checkout-items">
                <label className="checkout-items__select-all">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === cart.items.length}
                    onChange={handleSelectAll}
                  />
                  <span>Выбрать всё</span>
                </label>

                <div className="checkout-items__list">
                  {cart.items.map((item) => (
                    isMobile ? (
                      <MobileCheckoutItem
                        key={item.id}
                        item={item}
                        isSelected={selectedItems.has(item.id)}
                        onSelect={handleSelectItem}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                      />
                    ) : (
                      <div key={item.id} className="checkout-item">
                        <label className="checkout-item__checkbox">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                          />
                        </label>

                        <div className="checkout-item__image">
                          <img
                            src={
                              getImageUrl(item.product_detail.main_image) ||
                              "/placeholder.png"
                            }
                            alt={item.product_detail.name}
                          />
                        </div>

                        <div className="checkout-item__info">
                          <Link
                            to={`/products/${item.product_detail.slug}`}
                            className="checkout-item__name"
                          >
                            {item.product_detail.name}
                          </Link>
                          <p className="checkout-item__category">
                            {item.product_detail.category_name}
                          </p>
                        </div>

                        <div className="checkout-item__quantity">
                          <button
                            className="checkout-item__quantity-btn"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="checkout-item__quantity-value">
                            {item.quantity}
                          </span>
                          <button
                            className="checkout-item__quantity-btn"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>

                        <div className="checkout-item__price">
                          <span className="checkout-item__current-price">
                            {parseFloat(item.subtotal).toLocaleString("ru-RU")} ₽
                          </span>
                        </div>

                        <button
                          className="checkout-item__remove"
                          onClick={() => handleRemoveItem(item.id)}
                          title="Удалить"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Десктопная версия блока итогов */}
          {!isMobile && (
            <div className="checkout-page__summary">
              <div className="checkout-summary">
                {totals && (
                  <>
                    <div className="checkout-summary__details">
                      <div className="checkout-summary__row">
                        <span>{selectedItems.size} товара</span>
                        <span>
                          {parseFloat(totals.subtotal).toLocaleString("ru-RU")} ₽
                        </span>
                      </div>
                    </div>

                    <div className="checkout-summary__total">
                      <span>Итого</span>
                      <span className="checkout-summary__total-price">
                        {parseFloat(totals.total).toLocaleString("ru-RU")} ₽
                      </span>
                    </div>
                  </>
                )}

                <label className="checkout-offer-consent">
                  <input
                    type="checkbox"
                    checked={offerAccepted}
                    onChange={(e) => setOfferAccepted(e.target.checked)}
                    className="checkout-offer-consent__checkbox"
                  />
                  <span className="checkout-offer-consent__text">
                    Я ознакомился и согласен с{" "}
                    <Link to="/offer" target="_blank" className="checkout-offer-consent__link">
                      условиями публичной оферты
                    </Link>{" "}
                    и{" "}
                    <Link to="/privacy" target="_blank" className="checkout-offer-consent__link">
                      политикой конфиденциальности
                    </Link>
                  </span>
                </label>

                <Button
                  className="checkout-summary__submit-btn"
                  onClick={handleSubmit}
                  disabled={isSubmitting || selectedItems.size === 0 || !offerAccepted}
                >
                  {isSubmitting ? "Оформление..." : "Оформить заказ"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Мобильный фиксированный блок итогов */}
      {isMobile && (
        <MobileCheckoutSummary
          totals={totals}
          selectedCount={selectedItems.size}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          disabled={selectedItems.size === 0}
          offerAccepted={offerAccepted}
          onOfferAcceptedChange={setOfferAccepted}
        />
      )}
    </div>
  );
};

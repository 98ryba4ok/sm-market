import { Heart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { cartApi } from "../../api/cartApi";
import { wishlistApi } from "../../api/wishlistApi";
import { Button } from "../../components/ui/Button/Button";
import { Input } from "../../components/ui/Input/Input";
import { useToast } from "../../contexts/ToastContext";
import type { Cart } from "../../types/cart";
import { getImageUrl } from "../../utils/imageUrl";
import "./CartPage.css";

export const CartPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [promoCode, setPromoCode] = useState("");
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartApi.get();
      console.log("Cart response:", response.data);
      setCart(response.data);
      // По умолчанию выбираем все товары
      const allItemIds = new Set(response.data.items.map(item => item.id));
      setSelectedItems(allItemIds);
    } catch (error) {
      console.error("Failed to load cart:", error);
      console.error("Error details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (!cart) return;
    
    if (selectedItems.size === cart.items.length) {
      setSelectedItems(new Set());
    } else {
      const allItemIds = new Set(cart.items.map(item => item.id));
      setSelectedItems(allItemIds);
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
    
    console.log("Updating item:", itemId, "to quantity:", newQuantity);
    setUpdatingItems(prev => new Set(prev).add(itemId));
    try {
      const response = await cartApi.updateItem(itemId, { quantity: newQuantity });
      console.log("Update response:", response.data);
      setCart(response.data);
      showToast("Количество обновлено", "success");
      // Уведомляем Header об обновлении корзины
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error("Failed to update quantity:", error);
      showToast("Ошибка при обновлении количества", "error");
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      const response = await cartApi.removeItem(itemId);
      setCart(response.data);
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      showToast("Товар удален из корзины", "success");
      // Уведомляем Header об обновлении корзины
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error("Failed to remove item:", error);
      showToast("Ошибка при удалении товара", "error");
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    try {
      await wishlistApi.add({ product_id: productId });
      showToast("Товар добавлен в избранное", "success");
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      showToast("Ошибка при добавлении в избранное", "error");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) return;
    
    try {
      // Удаляем все выбранные товары
      await Promise.all(
        Array.from(selectedItems).map(itemId => cartApi.removeItem(itemId))
      );
      await loadCart();
      setSelectedItems(new Set());
      // Уведомляем Header об обновлении корзины
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error("Failed to delete selected items:", error);
    }
  };

  const calculateSelectedTotal = () => {
    if (!cart) return "0";
    
    const total = cart.items
      .filter(item => selectedItems.has(item.id))
      .reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    
    return total.toFixed(2);
  };

  const calculateDiscount = () => {
    // Здесь можно добавить логику расчета скидки
    return "0";
  };

  const calculateBonusPoints = () => {
    const total = parseFloat(calculateSelectedTotal());
    // Предположим, что 1% от суммы возвращается бонусами
    return Math.floor(total * 0.01);
  };

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      showToast("Выберите товары для оформления заказа", "info");
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-page__container">
          <div className="cart-page__loading">Загрузка корзины...</div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page__container">
          <h1 className="cart-page__title">Корзина</h1>
          <div className="cart-page__empty">
            <p>Ваша корзина пуста</p>
            <Link to="/">
              <Button>Перейти к покупкам</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const selectedCount = selectedItems.size;
  const bonusPoints = calculateBonusPoints();

  return (
    <div className="cart-page">
      <div className="cart-page__container">
        <div className="cart-page__header">
          <h1 className="cart-page__title">
            Корзина<sup>{cart.items.length}</sup>
          </h1>
        </div>

        <div className="cart-page__content">
          {/* Левая колонка - список товаров */}
          <div className="cart-page__items">
            <div className="cart-page__controls">
              <label className="cart-page__checkbox">
                <input
                  type="checkbox"
                  checked={selectedItems.size === cart.items.length}
                  onChange={handleSelectAll}
                />
                <span>Выбрать всё</span>
              </label>
              <button
                className="cart-page__delete-btn"
                onClick={handleDeleteSelected}
                disabled={selectedItems.size === 0}
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="cart-page__list">
              {cart.items.map((item) => (
                <div key={item.id} className="cart-item">
                  <label className="cart-item__checkbox">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                    />
                  </label>

                  <div className="cart-item__image">
                    <img
                      src={getImageUrl(item.product_detail.main_image) || "/placeholder.png"}
                      alt={item.product_detail.name}
                    />
                  </div>

                  <div className="cart-item__info">
                    <Link
                      to={`/products/${item.product_detail.slug}`}
                      className="cart-item__name"
                    >
                      {item.product_detail.name}
                    </Link>
                    <p className="cart-item__description">
                      {item.product_detail.category_name}
                    </p>
                  </div>

                  <div className="cart-item__quantity">
                    <button
                      className="cart-item__quantity-btn"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                    >
                      -
                    </button>
                    <span className="cart-item__quantity-value">{item.quantity}</span>
                    <button
                      className="cart-item__quantity-btn"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={updatingItems.has(item.id)}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item__price">
                    {item.product_detail.discount_price && (
                      <span className="cart-item__old-price">
                        {parseFloat(item.product_detail.price).toLocaleString("ru-RU")} ₽
                      </span>
                    )}
                    <span className="cart-item__current-price">
                      {parseFloat(item.subtotal).toLocaleString("ru-RU")} ₽
                    </span>
                  </div>

                  <div className="cart-item__actions">
                    <button
                      className="cart-item__action-btn"
                      onClick={() => handleAddToWishlist(item.product)}
                      title="Добавить в избранное"
                    >
                      <Heart size={20} />
                    </button>
                    <button
                      className="cart-item__action-btn"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Удалить"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Правая колонка - итоги */}
          <div className="cart-page__summary">
            <div className="cart-summary">
              <div className="cart-summary__promo">
                <Input
                  type="text"
                  placeholder="Промокод"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button variant="outline" size="md">
                  Применить
                </Button>
              </div>

              <div className="cart-summary__bonus">
                <span>У вас {bonusPoints} бонуса</span>
                <button className="cart-summary__bonus-link">Списать?</button>
              </div>

              <div className="cart-summary__details">
                <div className="cart-summary__row">
                  <span>{selectedCount} товара</span>
                  <span>{parseFloat(calculateSelectedTotal()).toLocaleString("ru-RU")} ₽</span>
                </div>
                <div className="cart-summary__row">
                  <span>Скидка</span>
                  <span>{parseFloat(calculateDiscount()).toLocaleString("ru-RU")} ₽</span>
                </div>
                <div className="cart-summary__row cart-summary__row--bonus">
                  <span>Вернется бонусами</span>
                  <span>+{bonusPoints}</span>
                </div>
              </div>

              <div className="cart-summary__total">
                <span>Итого</span>
                <span className="cart-summary__total-price">
                  {parseFloat(calculateSelectedTotal()).toLocaleString("ru-RU")} ₽
                </span>
              </div>

              <Button
                className="cart-summary__checkout-btn"
                onClick={handleCheckout}
                disabled={selectedItems.size === 0}
              >
                Перейти к оформлению
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
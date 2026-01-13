import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

import { wishlistApi } from "../../api/wishlistApi";
import { cartApi } from "../../api/cartApi";
import { useToast } from "../../contexts/ToastContext";
import type { ProductListItem } from "../../types/product";
import type { Wishlist } from "../../types/wishlist";
import { getImageUrl } from "../../utils/imageUrl";
import "./WishlistPage.css";

export const WishlistPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await wishlistApi.list();
      setWishlist(response.data);
    } catch (err: any) {
      console.error("Error loading wishlist:", err);
      if (err.response?.status === 401) {
        showToast("Войдите в систему для просмотра избранного", "error");
        window.dispatchEvent(new CustomEvent("openLoginModal"));
      } else {
        setError("Не удалось загрузить избранное");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      await wishlistApi.remove({ product_id: productId });
      showToast("Товар удален из избранного", "success");
      // Перезагружаем список
      loadWishlist();
    } catch (err: any) {
      console.error("Error removing from wishlist:", err);
      showToast("Не удалось удалить товар из избранного", "error");
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await cartApi.addItem({ product_id: productId, quantity: 1 });
      showToast("Товар добавлен в корзину!", "success");
      // Уведомляем Header об обновлении корзины
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      if (err.response?.status === 401) {
        showToast("Войдите в систему", "error");
        window.dispatchEvent(new CustomEvent("openLoginModal"));
      } else {
        showToast("Не удалось добавить товар в корзину", "error");
      }
    }
  };

  const handleClearWishlist = async () => {
    if (!window.confirm("Вы уверены, что хотите очистить все избранное?")) return;

    try {
      await wishlistApi.clear();
      showToast("Избранное очищено", "success");
      loadWishlist();
    } catch (err: any) {
      console.error("Error clearing wishlist:", err);
      showToast("Не удалось очистить избранное", "error");
    }
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-page__container">
          <div className="wishlist-page__loading">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-page__container">
          <div className="wishlist-page__error">{error}</div>
        </div>
      </div>
    );
  }

  const products = wishlist?.products || [];

  return (
    <div className="wishlist-page">
      <div className="wishlist-page__container">
        <div className="wishlist-page__header">
          <div className="wishlist-page__title-wrapper">
            <Heart size={32} className="wishlist-page__icon" />
            <h1 className="wishlist-page__title">Избранное</h1>
            {products.length > 0 && (
              <span className="wishlist-page__count">({products.length})</span>
            )}
          </div>
          {products.length > 0 && (
            <button
              className="wishlist-page__clear-btn"
              onClick={handleClearWishlist}
            >
              Очистить все
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="wishlist-page__empty">
            <Heart size={64} className="wishlist-page__empty-icon" />
            <h2 className="wishlist-page__empty-title">Избранное пусто</h2>
            <p className="wishlist-page__empty-text">
              Добавьте товары в избранное, чтобы не потерять их
            </p>
            <button
              className="wishlist-page__empty-btn"
              onClick={() => navigate("/catalog")}
            >
              Перейти в каталог
            </button>
          </div>
        ) : (
          <div className="wishlist-page__grid">
            {products.map((product: ProductListItem) => (
              <div key={product.id} className="wishlist-item">
                <button
                  className="wishlist-item__remove"
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  aria-label="Удалить из избранного"
                >
                  <Trash2 size={20} />
                </button>

                <div
                  className="wishlist-item__image-wrapper"
                  onClick={() => navigate(`/products/${product.slug}`)}
                >
                  {product.main_image ? (
                    <img
                      src={getImageUrl(product.main_image)}
                      alt={product.name}
                      className="wishlist-item__image"
                    />
                  ) : (
                    <div className="wishlist-item__image-placeholder">
                      Нет изображения
                    </div>
                  )}
                </div>

                <div className="wishlist-item__content">
                  <h3
                    className="wishlist-item__title"
                    onClick={() => navigate(`/products/${product.slug}`)}
                  >
                    {product.name}
                  </h3>

                  {product.sku && (
                    <p className="wishlist-item__sku">Код: {product.sku}</p>
                  )}

                  <div className="wishlist-item__price-wrapper">
                    <span className="wishlist-item__price">
                      {Number(product.final_price).toLocaleString("ru-RU")} ₽
                    </span>
                    {product.discount_price && (
                      <>
                        <span className="wishlist-item__old-price">
                          {Number(product.price).toLocaleString("ru-RU")} ₽
                        </span>
                        <span className="wishlist-item__discount-badge">
                          -{product.discount_percentage}%
                        </span>
                      </>
                    )}
                  </div>

                  <div className="wishlist-item__stock">
                    {product.in_stock ? (
                      <span className="wishlist-item__in-stock">В наличии</span>
                    ) : (
                      <span className="wishlist-item__out-of-stock">
                        Нет в наличии
                      </span>
                    )}
                  </div>

                  <button
                    className="wishlist-item__cart-btn"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={!product.in_stock}
                  >
                    <ShoppingCart size={20} />
                    Добавить в корзину
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

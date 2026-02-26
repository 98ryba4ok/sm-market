import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { cartApi, productsApi, wishlistApi } from "../../../api";
import { useToast } from "../../../contexts/ToastContext";
import type { ProductListItem } from "../../../types";
import { ProductCard } from "../../ui/ProductCard/ProductCard";
import "./NewProductsSection.css";

export const NewProductsSection = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    productsApi
      .list({ ordering: "-created_at", page_size: 8 })
      .then((response) => {
        setProducts(response.data.results);
        setTotalCount(response.data.count);
      })
      .catch((error) => console.error("Failed to load products:", error))
      .finally(() => setLoading(false));
  }, []);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      checkScrollButtons();
      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
      };
    }
  }, [products]);

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await cartApi.addItem({ product_id: productId, quantity: 1 });
      showToast("Товар добавлен в корзину!", "success");
      // Уведомляем Header об обновлении корзины
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err: unknown) {
      console.error("Error adding to cart:", err);
      const error = err as { response?: { status?: number; data?: unknown } };
      if (error.response?.status === 401) {
        showToast("Войдите в систему для добавления товара в корзину", "error");
      } else {
        showToast("Ошибка при добавлении в корзину", "error");
      }
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    try {
      await wishlistApi.add({ product_id: productId });
      showToast("Товар добавлен в избранное!", "success");
    } catch (err: unknown) {
      console.error("Error adding to wishlist:", err);
      const error = err as { response?: { status?: number } };
      if (error.response?.status === 401) {
        showToast("Войдите в систему для добавления товара в избранное", "error");
      } else {
        showToast("Ошибка при добавлении в избранное", "error");
      }
    }
  };

  if (loading) {
    return null; // or a loading spinner
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="new-products-section">
      <div className="new-products-section__container">
        {/* Header */}
        <div className="new-products-section__header">
          <div className="new-products-section__title-wrapper">
            <h2 className="new-products-section__title">
              Все новинки
            </h2>
            <div className="new-products-section__count-badge">
              {totalCount}
            </div>
          </div>

          <Link to="/catalog/new" className="new-products-section__view-all">
            Смотреть все
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Products Slider */}
        <div className="new-products-section__slider-wrapper">
          <button
            className={`new-products-section__nav-button new-products-section__nav-button--left ${
              !canScrollLeft ? "new-products-section__nav-button--disabled" : ""
            }`}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Прокрутить влево"
          >
            <ChevronLeft size={24} />
          </button>

          <div
            className="new-products-section__slider"
            ref={scrollContainerRef}
          >
            <div className="new-products-section__slider-track">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="new-products-section__slider-item"
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            className={`new-products-section__nav-button new-products-section__nav-button--right ${
              !canScrollRight ? "new-products-section__nav-button--disabled" : ""
            }`}
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Прокрутить вправо"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

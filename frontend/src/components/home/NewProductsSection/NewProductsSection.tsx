import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    productsApi
      .list({ ordering: "-created_at", page_size: 4 })
      .then((response) => {
        setProducts(response.data.results);
        setTotalCount(response.data.count);
      })
      .catch((error) => console.error("Failed to load products:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async (productId: number) => {
    try {
      await cartApi.addItem({ product_id: productId, quantity: 1 });
      showToast("Товар добавлен в корзину!", "success");
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

        {/* Products Grid */}
        <div className="new-products-section__grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

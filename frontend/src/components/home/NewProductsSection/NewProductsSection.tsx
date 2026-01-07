import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { productsApi } from "../../../api";
import type { ProductListItem } from "../../../types";
import { ProductCard } from "../../ui/ProductCard/ProductCard";
import "./NewProductsSection.css";

export const NewProductsSection = () => {
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

  const handleAddToCart = (productId: number) => {
    console.log("Add to cart:", productId);
    // Здесь будет вызов API
  };

  const handleAddToWishlist = (productId: number) => {
    console.log("Add to wishlist:", productId);
    // Здесь будет вызов API
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

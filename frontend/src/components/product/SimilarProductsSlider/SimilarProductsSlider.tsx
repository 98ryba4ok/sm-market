import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";

import { ProductCard } from "../../ui/ProductCard/ProductCard";
import type { ProductListItem } from "../../../types";
import "./SimilarProductsSlider.css";

interface SimilarProductsSliderProps {
  products: ProductListItem[];
  onAddToCart: (id: number) => Promise<void>;
  onAddToWishlist: (id: number) => Promise<void>;
}

export const SimilarProductsSlider = ({
  products,
  onAddToCart,
  onAddToWishlist,
}: SimilarProductsSliderProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

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

  return (
    <div className="similar-products-slider">
      <h2 className="similar-products-slider__title">Похожие товары</h2>
      
      <div className="similar-products-slider__container">
        <button
          className={`similar-products-slider__nav-button similar-products-slider__nav-button--left ${
            !canScrollLeft ? "similar-products-slider__nav-button--disabled" : ""
          }`}
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          aria-label="Предыдущие товары"
        >
          <ChevronLeft size={24} />
        </button>

        <div
          ref={scrollContainerRef}
          className="similar-products-slider__scroll-container"
          onScroll={checkScrollButtons}
        >
          <div className="similar-products-slider__products">
            {products.map((product) => (
              <div key={product.id} className="similar-products-slider__product">
                <ProductCard
                  product={product}
                  onAddToCart={() => onAddToCart(product.id)}
                  onAddToWishlist={() => onAddToWishlist(product.id)}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          className={`similar-products-slider__nav-button similar-products-slider__nav-button--right ${
            !canScrollRight ? "similar-products-slider__nav-button--disabled" : ""
          }`}
          onClick={scrollRight}
          disabled={!canScrollRight}
          aria-label="Следующие товары"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};
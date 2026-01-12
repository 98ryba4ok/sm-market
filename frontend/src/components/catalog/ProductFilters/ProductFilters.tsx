import { Star, X } from "lucide-react";
import { useState, useEffect } from "react";
import type { Brand } from "../../../types";
import "./ProductFilters.css";

interface ProductFiltersProps {
  brands: Brand[];
  minPrice: number | undefined;
  maxPrice: number | undefined;
  inStock: boolean;
  onSale: boolean;
  minRating: number | undefined;
  onMinPriceChange: (value: number | undefined) => void;
  onMaxPriceChange: (value: number | undefined) => void;
  onInStockChange: (value: boolean) => void;
  onSaleChange: (value: boolean) => void;
  onMinRatingChange: (value: number | undefined) => void;
  onBrandsChange: (brandIds: number[]) => void;
  selectedBrands: number[];
}

export const ProductFilters = ({
  brands,
  minPrice,
  maxPrice,
  inStock,
  onSale,
  minRating,
  onMinPriceChange,
  onMaxPriceChange,
  onInStockChange,
  onSaleChange,
  onMinRatingChange,
  onBrandsChange,
  selectedBrands,
}: ProductFiltersProps) => {
  const [minPriceInput, setMinPriceInput] = useState<string>(minPrice?.toString() || "");
  const [maxPriceInput, setMaxPriceInput] = useState<string>(maxPrice?.toString() || "");

  useEffect(() => {
    setMinPriceInput(minPrice?.toString() || "");
  }, [minPrice]);

  useEffect(() => {
    setMaxPriceInput(maxPrice?.toString() || "");
  }, [maxPrice]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPriceInput(value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPriceInput(value);
  };

  const handleMinPriceBlur = () => {
    const value = minPriceInput ? parseInt(minPriceInput) : undefined;
    if (value !== undefined && !isNaN(value) && value >= 0) {
      onMinPriceChange(value);
    } else if (!minPriceInput) {
      onMinPriceChange(undefined);
    }
  };

  const handleMaxPriceBlur = () => {
    const value = maxPriceInput ? parseInt(maxPriceInput) : undefined;
    if (value !== undefined && !isNaN(value) && value >= 0) {
      onMaxPriceChange(value);
    } else if (!maxPriceInput) {
      onMaxPriceChange(undefined);
    }
  };

  const handleBrandToggle = (brandId: number) => {
    if (selectedBrands.includes(brandId)) {
      onBrandsChange(selectedBrands.filter((id) => id !== brandId));
    } else {
      onBrandsChange([...selectedBrands, brandId]);
    }
  };

  const handleRatingClick = (rating: number) => {
    if (minRating === rating) {
      onMinRatingChange(undefined);
    } else {
      onMinRatingChange(rating);
    }
  };

  const hasActiveFilters =
    minPrice !== undefined ||
    maxPrice !== undefined ||
    inStock ||
    onSale ||
    minRating !== undefined ||
    selectedBrands.length > 0;

  const handleResetFilters = () => {
    onMinPriceChange(undefined);
    onMaxPriceChange(undefined);
    onInStockChange(false);
    onSaleChange(false);
    onMinRatingChange(undefined);
    onBrandsChange([]);
    setMinPriceInput("");
    setMaxPriceInput("");
  };

  return (
    <div className="product-filters">
      <div className="product-filters__header">
        <h3 className="product-filters__title">Фильтры</h3>
        {hasActiveFilters && (
          <button className="product-filters__reset" onClick={handleResetFilters}>
            <X size={16} />
            Сбросить
          </button>
        )}
      </div>
      <div className="product-filters__divider"></div>

      <div className="product-filters__section">
        <h4 className="product-filters__section-title">Цена, ₽</h4>
        <div className="product-filters__price-inputs">
          <input
            type="number"
            placeholder="От"
            value={minPriceInput}
            onChange={handleMinPriceChange}
            onBlur={handleMinPriceBlur}
            className="product-filters__price-input"
            min="0"
          />
          <span className="product-filters__price-separator">—</span>
          <input
            type="number"
            placeholder="До"
            value={maxPriceInput}
            onChange={handleMaxPriceChange}
            onBlur={handleMaxPriceBlur}
            className="product-filters__price-input"
            min="0"
          />
        </div>
      </div>

      {brands.length > 0 && (
        <div className="product-filters__section">
          <h4 className="product-filters__section-title">Бренд</h4>
          <div className="product-filters__brand-list">
            {brands.map((brand) => (
              <label key={brand.id} className="product-filters__checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => handleBrandToggle(brand.id)}
                  className="product-filters__checkbox-input"
                />
                <span className="product-filters__checkbox-custom"></span>
                <span className="product-filters__checkbox-text">{brand.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="product-filters__section">
        <h4 className="product-filters__section-title">Рейтинг</h4>
        <div className="product-filters__rating-list">
          {[5, 4, 3].map((rating) => (
            <button
              key={rating}
              className={`product-filters__rating-btn ${
                minRating === rating ? "product-filters__rating-btn--active" : ""
              }`}
              onClick={() => handleRatingClick(rating)}
            >
              <div className="product-filters__rating-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < rating ? "currentColor" : "none"}
                    className="product-filters__rating-star"
                  />
                ))}
              </div>
              <span className="product-filters__rating-text">от {rating}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="product-filters__section">
        <h4 className="product-filters__section-title">Дополнительно</h4>
        <div className="product-filters__options">
          <label className="product-filters__checkbox-label">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => onInStockChange(e.target.checked)}
              className="product-filters__checkbox-input"
            />
            <span className="product-filters__checkbox-custom"></span>
            <span className="product-filters__checkbox-text">В наличии</span>
          </label>
          <label className="product-filters__checkbox-label">
            <input
              type="checkbox"
              checked={onSale}
              onChange={(e) => onSaleChange(e.target.checked)}
              className="product-filters__checkbox-input"
            />
            <span className="product-filters__checkbox-custom"></span>
            <span className="product-filters__checkbox-text">Со скидкой</span>
          </label>
        </div>
      </div>
    </div>
  );
};

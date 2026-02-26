import { Check, ChevronDown, ChevronRight, Heart, ShoppingCart, Star, Truck } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";

import { Button } from "../../ui/Button/Button";
import "./MobileProductInfo.css";

interface Product {
  id: number;
  name: string;
  sku?: string;
  average_rating: number | null;
  final_price: string | number;
  price: string | number;
  discount_price: string | number | null;
  discount_percentage: number;
  in_stock: boolean;
  warranty_months: number;
  brand?: {
    name: string;
  } | null;
  specifications?: Record<string, string>;
  country_of_origin?: string;
  images: Array<{
    id: number;
    image: string;
    alt_text?: string;
  }>;
}

interface MobileProductInfoProps {
  product: Product;
  onAddToCart: () => void;
  onAddToWishlist: () => void;
  onSpecsClick: () => void;
}

export const MobileProductInfo = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onSpecsClick,
}: MobileProductInfoProps) => {
  const hasDiscount = product.discount_price !== null;
  const discountPercentage = hasDiscount ? product.discount_percentage : 0;
  const finalPrice = typeof product.final_price === 'string' ? parseFloat(product.final_price) : product.final_price;
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

  return (
    <div className="mobile-product-info">
      {/* Title */}
      <h1 className="mobile-product-info__title">{product.name}</h1>

      {/* SKU */}
      {product.sku && (
        <div className="mobile-product-info__sku">Код товара: {product.sku}</div>
      )}

      {/* Rating */}
      {product.average_rating !== null && (
        <div className="mobile-product-info__rating">
          <Star size={16} fill="#fbbf24" color="#fbbf24" />
          <span>{product.average_rating.toFixed(1)}</span>
        </div>
      )}

      {/* Price */}
      <div className="mobile-product-info__price-row">
        <span className="mobile-product-info__price">
          {finalPrice.toLocaleString("ru-RU")} ₽
        </span>
        {hasDiscount && (
          <>
            <span className="mobile-product-info__old-price">
              {price.toLocaleString("ru-RU")} ₽
            </span>
            <span className="mobile-product-info__discount-badge">
              -{discountPercentage}%
            </span>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mobile-product-info__actions">
        <Button
          variant="primary"
          onClick={onAddToCart}
          disabled={!product.in_stock}
          className="mobile-product-info__cart-button"
        >
          <ShoppingCart size={20} />
          Добавить в корзину
        </Button>

        <button
          className="mobile-product-info__wishlist-button"
          onClick={onAddToWishlist}
        >
          <Heart size={20} />
          В избранное
        </button>
      </div>

      {/* Status Items */}
      <div className="mobile-product-info__status-list">
        {product.in_stock && (
          <div className="mobile-product-info__status-item">
            <Check size={20} className="mobile-product-info__status-icon" />
            <span>В наличии</span>
          </div>
        )}

        <div className="mobile-product-info__status-item">
          <Truck size={20} className="mobile-product-info__status-icon-green" />
          <span>Доставка за 1 - 2 дня</span>
        </div>

        <div className="mobile-product-info__status-item">
          <Check size={20} className="mobile-product-info__status-icon-green" />
          <span>
            Гарантия{" "}
            {product.warranty_months >= 12
              ? `${product.warranty_months / 12} ${product.warranty_months === 12 ? "год" : "лет"}`
              : `${product.warranty_months} мес.`}
          </span>
        </div>
      </div>

      {/* Accordion for Additional Info */}
      <Accordion.Root type="single" collapsible className="mobile-product-info__accordion">
        {/* About Product */}
        <Accordion.Item value="about" className="mobile-product-info__accordion-item">
          <Accordion.Header className="mobile-product-info__accordion-header">
            <Accordion.Trigger className="mobile-product-info__accordion-trigger">
              <span>О товаре</span>
              <ChevronDown className="mobile-product-info__accordion-icon" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="mobile-product-info__accordion-content">
            <div className="mobile-product-info__specs-compact">
              {product.brand && (
                <div className="mobile-product-info__spec-row">
                  <span className="mobile-product-info__spec-label">Бренд</span>
                  <span className="mobile-product-info__spec-value">{product.brand.name}</span>
                </div>
              )}
              {Object.entries(product.specifications || {}).slice(0, 5).map(([key, value]) => (
                <div key={key} className="mobile-product-info__spec-row">
                  <span className="mobile-product-info__spec-label">{key}</span>
                  <span className="mobile-product-info__spec-value">{value}</span>
                </div>
              ))}
            </div>
            <button className="mobile-product-info__specs-link" onClick={onSpecsClick}>
              Все характеристики
              <ChevronRight size={16} />
            </button>
          </Accordion.Content>
        </Accordion.Item>

        {/* Delivery Info */}
        <Accordion.Item value="delivery" className="mobile-product-info__accordion-item">
          <Accordion.Header className="mobile-product-info__accordion-header">
            <Accordion.Trigger className="mobile-product-info__accordion-trigger">
              <span>Доставка и оплата</span>
              <ChevronDown className="mobile-product-info__accordion-icon" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="mobile-product-info__accordion-content">
            <div className="mobile-product-info__delivery-info">
              <p>Доставка по Москве и Московской области</p>
              <ul>
                <li>Курьерская доставка: 1-2 дня</li>
                <li>Самовывоз: сегодня</li>
                <li>Бесплатная доставка от 10 000 ₽</li>
              </ul>
              <p>Оплата</p>
              <ul>
                <li>Наличными при получении</li>
                <li>Банковской картой онлайн</li>
                <li>Банковской картой при получении</li>
              </ul>
            </div>
          </Accordion.Content>
        </Accordion.Item>

        {/* Warranty */}
        <Accordion.Item value="warranty" className="mobile-product-info__accordion-item">
          <Accordion.Header className="mobile-product-info__accordion-header">
            <Accordion.Trigger className="mobile-product-info__accordion-trigger">
              <span>Гарантия и возврат</span>
              <ChevronDown className="mobile-product-info__accordion-icon" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="mobile-product-info__accordion-content">
            <div className="mobile-product-info__warranty-info">
              <p>
                Гарантия{" "}
                {product.warranty_months >= 12
                  ? `${product.warranty_months / 12} ${product.warranty_months === 12 ? "год" : "лет"}`
                  : `${product.warranty_months} месяцев`}{" "}
                от производителя
              </p>
              <p>Возврат товара в течение 14 дней</p>
              <p>Полная информация в разделе "Гарантия и возврат"</p>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  );
};
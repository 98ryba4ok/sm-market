import "./ProductCardSkeleton.css";

export const ProductCardSkeleton = () => {
  return (
    <div className="product-card-skeleton">
      <div className="product-card-skeleton__image"></div>
      <div className="product-card-skeleton__content">
        <div className="product-card-skeleton__title"></div>
        <div className="product-card-skeleton__title product-card-skeleton__title--short"></div>
        <div className="product-card-skeleton__price"></div>
        <div className="product-card-skeleton__button"></div>
      </div>
    </div>
  );
};
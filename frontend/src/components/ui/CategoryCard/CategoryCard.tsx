import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { CategoryListItem } from "../../../types";
import "./CategoryCard.css";

interface CategoryCardProps {
  category: CategoryListItem;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link to={`/catalog/${category.slug}`} className="category-card">
      {/* Background Image */}
      <div className="category-card__background">
        {category.image && (
          <img
            src={category.image}
            alt={category.name}
            className="category-card__image"
          />
        )}
        <div className="category-card__overlay" />
      </div>

      {/* Content */}
      <div className="category-card__content">
        <div className="category-card__inner">
          <h3 className="category-card__title">{category.name}</h3>
          <div className="category-card__icon">
            <ChevronRight size={20} className="category-card__icon-svg" />
          </div>
        </div>
      </div>
    </Link>
  );
};

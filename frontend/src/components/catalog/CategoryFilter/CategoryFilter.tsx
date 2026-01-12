import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { CategoryListItem } from "../../../types/category";
import "./CategoryFilter.css";

interface CategoryFilterProps {
  categories: CategoryListItem[];
  selectedCategories: number[];
  onToggleCategory: (categoryId: number) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategories,
  onToggleCategory,
}: CategoryFilterProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  const toggleExpandCategory = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  return (
    <div className="category-filter">
      <h3 className="category-filter__title">Категории</h3>
      <ul className="category-filter__list">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          const hasSubcategories = category.subcategories && category.subcategories.length > 0;
          const isExpanded = expandedCategories.has(category.id);
          const subcategoriesToShow = isExpanded
            ? category.subcategories
            : category.subcategories?.slice(0, 1) || [];
          const remainingCount = (category.subcategories?.length || 0) - 1;

          return (
            <li key={category.id} className="category-filter__item">
              <button
                className={`category-filter__button ${
                  isSelected ? "category-filter__button--active" : ""
                }`}
                onClick={() => onToggleCategory(category.id)}
              >
                <span className="category-filter__name">{category.name}</span>
                <span
                  className={`category-filter__checkbox ${
                    isSelected ? "category-filter__checkbox--checked" : ""
                  }`}
                >
                  {isSelected && <Check size={16} strokeWidth={3} />}
                </span>
              </button>

              {/* Подкатегории */}
              {hasSubcategories && (
                <>
                  <ul className="category-filter__sublist">
                    {subcategoriesToShow.map((subcategory) => {
                      const isSubSelected = selectedCategories.includes(subcategory.id);

                      return (
                        <li key={subcategory.id} className="category-filter__subitem">
                          <button
                            className={`category-filter__button category-filter__button--sub ${
                              isSubSelected ? "category-filter__button--active" : ""
                            }`}
                            onClick={() => onToggleCategory(subcategory.id)}
                          >
                            <span className="category-filter__name category-filter__name--sub">
                              {subcategory.name}
                            </span>
                            <span
                              className={`category-filter__checkbox category-filter__checkbox--small ${
                                isSubSelected ? "category-filter__checkbox--checked" : ""
                              }`}
                            >
                              {isSubSelected && <Check size={14} strokeWidth={3} />}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Кнопка "Показать еще" */}
                  {remainingCount > 0 && (
                    <button
                      className="category-filter__expand-btn"
                      onClick={() => toggleExpandCategory(category.id)}
                    >
                      <span className="category-filter__expand-text">
                        {isExpanded
                          ? "Скрыть"
                          : `Показать еще ${remainingCount}`}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`category-filter__expand-icon ${
                          isExpanded ? "category-filter__expand-icon--rotated" : ""
                        }`}
                      />
                    </button>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

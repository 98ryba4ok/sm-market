import { Check, ChevronDown, ChevronRight } from "lucide-react";
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
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set(categories.map(c => c.id))
  );

  const toggleExpandCategory = (categoryId: number, e: React.MouseEvent) => {
    e.stopPropagation();
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
      <div className="category-filter__divider"></div>
      <ul className="category-filter__list">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          const hasSubcategories = category.subcategories && category.subcategories.length > 0;
          const isExpanded = expandedCategories.has(category.id);

          return (
            <li key={category.id} className="category-filter__item">
              <div className="category-filter__parent-wrapper">
                {hasSubcategories && (
                  <button
                    className="category-filter__accordion-btn"
                    onClick={(e) => toggleExpandCategory(category.id, e)}
                    aria-label={isExpanded ? "Свернуть" : "Развернуть"}
                  >
                    {isExpanded ? (
                      <ChevronDown size={18} strokeWidth={2.5} />
                    ) : (
                      <ChevronRight size={18} strokeWidth={2.5} />
                    )}
                  </button>
                )}
                
                <button
                  className={`category-filter__button ${
                    isSelected ? "category-filter__button--active" : ""
                  } ${!hasSubcategories ? "category-filter__button--no-subs" : ""}`}
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
              </div>

              {hasSubcategories && isExpanded && (
                <ul className="category-filter__sublist">
                  {category.subcategories?.map((subcategory) => {
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
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

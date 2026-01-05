import { useState, useEffect } from "react";
import { CategoryCard } from "../../ui/CategoryCard/CategoryCard";
import { categoriesApi } from "../../../api";
import type { CategoryListItem } from "../../../types";
import "./CategoriesSection.css";

export const CategoriesSection = () => {
  const [categories, setCategories] = useState<CategoryListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesApi
      .list()
      .then((response) => {
        // Показываем только родительские категории (без parent)
        const parentCategories = response.data.results.filter((cat) => !cat.parent);
        setCategories(parentCategories);
      })
      .catch((error) => console.error("Failed to load categories:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return null; // or a loading spinner
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="categories-section">
      <div className="categories-section__container">
        <div className="categories-section__grid">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

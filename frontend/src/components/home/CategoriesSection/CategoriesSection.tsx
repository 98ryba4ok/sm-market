import { Link } from "react-router-dom";

import arrowIcon from "../../../assets/arrow_right.svg";
import category1 from "../../../assets/categories/Rectangle 12.png";
import category2 from "../../../assets/categories/Rectangle 13.png";
import category3 from "../../../assets/categories/Rectangle 14.png";
import category4 from "../../../assets/categories/Rectangle 15.png";
import category5 from "../../../assets/categories/Rectangle 16.png";
import category6 from "../../../assets/categories/Rectangle 17.png";
import "./CategoriesSection.css";

export const CategoriesSection = () => {
  const categories = [
    { id: 1, name: "Сантехника", image: category1, slug: "santekhnika", size: "large" as const },
    { id: 2, name: "Кухни", image: category2, slug: "kukhni", size: "medium" as const },
    { id: 3, name: "Унитазы", image: category3, slug: "unitazy", size: "small" as const },
    { id: 4, name: "Плитка", image: category4, slug: "plitka", size: "small" as const },
    { id: 5, name: "Ванны", image: category5, slug: "vanny", size: "medium" as const },
    { id: 6, name: "Мебель для ванны", image: category6, slug: "mebel-dlya-vanny", size: "large" as const },
  ];

  return (
    <section className="categories-section">
      <div className="categories-section__container">
        <div className="categories-section__grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/catalog?category=${category.slug}`}
              className={`category-card category-card--${category.size}`}
            >
              <img
                src={category.image}
                alt={category.name}
                className="category-card__image"
              />
              <div className="category-card__content">
                <h3 className="category-card__title">{category.name}</h3>
              </div>
              <div className="category-card__arrow">
                <img src={arrowIcon} alt="" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

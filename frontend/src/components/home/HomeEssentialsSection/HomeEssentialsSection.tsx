import { Link } from "react-router-dom";
import "./HomeEssentialsSection.css";

export const HomeEssentialsSection = () => {
  const categories = [
    { id: 1, name: "Сантехника", link: "?search=Сантехника" },
    { id: 2, name: "Хозтовары", link: "?search=хозтовары"  },
    { id: 3, name: "Электрика", link: "?search=электрика"  },
    { id: 4, name: "Стройматериалы", link: "?search=стройматериалы"  },
  ];

  return (
    <section className="home-essentials-section">
      <div className="home-essentials-section__container">
        <h2 className="home-essentials-section__title">Все для дома</h2>
        <div className="home-essentials-section__grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/catalog${category.link}`}
              className="home-essentials-section__button"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
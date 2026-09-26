import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./HomeProductsSection.css";

// Заглушки для картинок категорий
import image1 from "../../../assets/categories/345 2_01.png";
import image2 from "../../../assets/categories/345 2_02.png";
import image3 from "../../../assets/categories/345 2_03.png";
import image4 from "../../../assets/categories/345 2_04.png";
import image5 from "../../../assets/categories/345 2_05.png";
import image6 from "../../../assets/categories/345 2_06.png";
import image7 from "../../../assets/categories/345 2_07.png";
import image8 from "../../../assets/categories/345 2_08.png";
import image9 from "../../../assets/categories/345 2_09.png";
import image10 from "../../../assets/categories/345 2_10.png";
import image11 from "../../../assets/categories/345 2_11.png";

export const HomeProductsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const categories = [
    { id: 1, name: "Сантехника", link: "сантехника", image: image1 },
    { id: 2, name: "Товары для дома", link: "товары", image: image2 },
    { id: 3, name: "Крепеж", link: "крепеж", image: image3 },
    { id: 4, name: "Краски", link: "краски", image: image4 },
    { id: 5, name: "Карнизы", link: "карнизы", image: image5 },
    { id: 6, name: "Стройматериалы", link: "стройматериалы", image: image6 },
    { id: 7, name: "Инструменты", link: "инструменты", image: image7 },
    { id: 8, name: "Электротехника", link: "электротехника", image: image8 },
    { id: 9, name: "Электрика", link: "электрика", image: image9 },
    { id: 10, name: "Обои", link: "обои", image: image10 },
    { id: 11, name: "Замки и ручки", link: "замки", image: image11 },
  ];

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      const observer = new ResizeObserver(checkScrollButtons);
      observer.observe(container);
      checkScrollButtons();
      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
        observer.disconnect();
      };
    }
  }, []);

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
    <section className="home-products-section">
      <div className="home-products-section__container">
        <h2 className="home-products-section__title">Товары для вашего дома</h2>

        <div className="home-products-section__slider-wrapper">
          <button
            className={`home-products-section__nav-button home-products-section__nav-button--left ${!canScrollLeft ? "home-products-section__nav-button--disabled" : ""
              }`}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Прокрутить влево"
          >
            <ChevronLeft size={24} />
          </button>

          <div
            className="home-products-section__slider"
            ref={scrollContainerRef}
          >
            <div className="home-products-section__slider-track">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/catalog?search=${category.link}`}
                  className="home-products-section__slider-item"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="home-products-section__image"
                  />
                  <div className="home-products-section__overlay" />
                  <span className="home-products-section__label">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <button
            className={`home-products-section__nav-button home-products-section__nav-button--right ${!canScrollRight ? "home-products-section__nav-button--disabled" : ""
              }`}
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Прокрутить вправо"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};
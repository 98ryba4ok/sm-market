import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import collectionImage from "../../../assets/collection.png";
import "./HeroSlider.css";

export const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Статические баннеры с изображением collection.png
  const banners = [
    {
      id: 1,
      title: "Новая коллекция",
      description: "Откройте для себя нашу новую коллекцию товаров",
      image: collectionImage,
      link: "/products",
      button_text: "Смотреть каталог"
    },
    {
      id: 2,
      title: "Специальные предложения",
      description: "Лучшие цены на популярные товары",
      image: collectionImage,
      link: "/products",
      button_text: "Узнать больше"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="hero-slider">
      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`hero-slider__slide ${
            index === currentSlide ? "hero-slider__slide--active" : ""
          }`}
        >
          {/* Background Image Overlay */}
          <div className="hero-slider__overlay" />

          {/* Background Image */}
          {banner.image && (
            <img
              src={banner.image}
              alt={banner.title}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}

          {/* Content */}
          <div className="hero-slider__container">
            <div className="hero-slider__content">
              <h1 className="hero-slider__title">{banner.title}</h1>
              <p className="hero-slider__description">{banner.description}</p>
              {banner.link && (
                <a
                  href={banner.link}
                  className="hero-slider__button"
                  style={{
                    display: "inline-block",
                    marginTop: "1rem",
                    padding: "0.625rem 1.25rem",
                    backgroundColor: "rgb(37, 99, 235)",
                    color: "white",
                    borderRadius: "0.25rem",
                    textDecoration: "none",
                    fontWeight: 500,
                    transition: "background-color 0.2s",
                    fontSize: "0.875rem",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgb(29, 78, 216)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgb(37, 99, 235)")
                  }
                >
                  {banner.button_text || "Подробнее"}
                </a>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Navigation */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="hero-slider__nav-btn hero-slider__nav-btn--prev"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="hero-slider__nav-btn hero-slider__nav-btn--next"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="hero-slider__dots">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`hero-slider__dot ${
                  index === currentSlide ? "hero-slider__dot--active" : ""
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

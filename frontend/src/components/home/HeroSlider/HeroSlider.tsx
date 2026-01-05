import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { bannersApi } from "../../../api";
import type { Banner } from "../../../types";
import "./HeroSlider.css";

export const HeroSlider = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const { data } = await bannersApi.list();
        setBanners(data);
      } catch (err) {
        console.error("Failed to fetch banners:", err);
        // Fallback to empty array if loading fails
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (loading) {
    return (
      <div className="hero-slider">
        <div className="hero-slider__container">
          <div className="hero-slider__content">
            <p className="hero-slider__description">Загрузка баннеров...</p>
          </div>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

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
                    marginTop: "1.5rem",
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "rgb(37, 99, 235)",
                    color: "white",
                    borderRadius: "0.25rem",
                    textDecoration: "none",
                    fontWeight: 500,
                    transition: "background-color 0.2s",
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

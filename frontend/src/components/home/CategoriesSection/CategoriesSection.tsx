import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getRooms } from "../../../api/roomsApi";
import arrowIcon from "../../../assets/arrow_right.svg";
import type { Room } from "../../../types/room";
import "./CategoriesSection.css";

export const CategoriesSection = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getRooms();
        setRooms(response.results);
      } catch (err) {
        console.error("Ошибка загрузки помещений:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (isLoading) {
    return (
      <section className="categories-section">
        <div className="categories-section__container">
          <div className="categories-section__loading">Загрузка...</div>
        </div>
      </section>
    );
  }

  if (rooms.length === 0) {
    return null;
  }

  return (
    <section className="categories-section">
      <div className="categories-section__container">
        <h2 className="categories-section__title">Выберите помещение</h2>
        <div className="categories-section__grid">
          {rooms.map((room, index) => {
            // Определяем размер карточки по индексу (для красивой сетки)
            const size = index % 3 === 0 ? 'large' : index % 3 === 1 ? 'medium' : 'small';
            
            return (
              <Link
                key={room.id}
                to={`/catalog?room=${room.slug}`}
                className={`category-card category-card--${size}`}
              >
                {room.image && (
                  <img
                    src={room.image}
                    alt={room.name}
                    className="category-card__image"
                  />
                )}
                <div className="category-card__content">
                  <h3 className="category-card__title">{room.name}</h3>
                  {room.description && (
                    <p className="category-card__description">
                      {room.description}
                    </p>
                  )}
                </div>
                <div className="category-card__arrow">
                  <img src={arrowIcon} alt="" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

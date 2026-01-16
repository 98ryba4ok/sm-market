import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getRooms } from "../../../api/roomsApi";
import arrowIcon from "../../../assets/arrow_right.svg";
import type { Room } from "../../../types/room";
import "./CategoriesSection.css";

// Import local category images as fallback
import bathroomImage from "../../../assets/categories/ванная комната.png";
import livingRoomImage from "../../../assets/categories/гостиная.png";
import officeImage from "../../../assets/categories/кабинет.png";
import kitchenImage from "../../../assets/categories/кухня.png";
import hallwayImage from "../../../assets/categories/прихожая.png";
import bedroomImage from "../../../assets/categories/спальня.png";

// Fallback images array
const fallbackImages = [
  bathroomImage,
  livingRoomImage,
  officeImage,
  kitchenImage,
  hallwayImage,
  bedroomImage,
];

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
    return null;
  }

  if (rooms.length === 0) {
    return null;
  }

  return (
    <section className="categories-section">
      <div className="categories-section__container">
        <div className="categories-section__grid">
          {rooms.map((room, index) => {
            // Определяем размер карточки по индексу и ряду
            // Первый ряд (0,1,2): large(480), medium(380), small(280)
            // Второй ряд (3,4,5): small(280), medium(380), large(480)
            const rowIndex = Math.floor(index / 3); // 0 для первого ряда, 1 для второго
            const positionInRow = index % 3; // 0, 1, 2
            
            let size;
            if (rowIndex % 2 === 0) {
              // Четные ряды (0, 2, 4...): large, medium, small
              size = positionInRow === 0 ? 'large' : positionInRow === 1 ? 'medium' : 'small';
            } else {
              // Нечетные ряды (1, 3, 5...): small, medium, large
              size = positionInRow === 0 ? 'small' : positionInRow === 1 ? 'medium' : 'large';
            }
            
            // Используем изображение из API или fallback из локальных файлов
            const imageUrl = room.image || fallbackImages[index % fallbackImages.length];
            
            return (
              <Link
                key={room.id}
                to={`/catalog?room=${room.slug}`}
                className={`category-card category-card--${size}`}
              >
                <img
                  src={imageUrl}
                  alt={room.name}
                  className="category-card__image"
                />
                <div className="category-card__content">
                  <h3 className="category-card__title">{room.name}</h3>
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

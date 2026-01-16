import { Check, ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { CategoryListItem } from "../../../types/category";
import type { Room } from "../../../types/room";
import "./CategoryFilter.css";

interface CategoryFilterProps {
  rooms: Room[];
  selectedRoom: string | null;
  categories: CategoryListItem[];
  selectedCategories: number[];
  onSelectRoom: (roomSlug: string | null) => void;
  onToggleCategory: (categoryId: number) => void;
}

interface RoomCategoriesCache {
  [roomSlug: string]: CategoryListItem[];
}

export const CategoryFilter = ({
  rooms,
  selectedRoom,
  categories,
  selectedCategories,
  onSelectRoom,
  onToggleCategory,
}: CategoryFilterProps) => {
  const [manuallyCollapsed, setManuallyCollapsed] = useState<Set<string>>(new Set());
  const [categoriesCache, setCategoriesCache] = useState<RoomCategoriesCache>({});
  const prevSelectedRoomRef = useRef<string | null>(null);

  // Кэшируем категории для текущего помещения
  useEffect(() => {
    if (selectedRoom && categories.length > 0) {
       
      setCategoriesCache(prev => ({
        ...prev,
        [selectedRoom]: categories
      }));
    }
     
  }, [selectedRoom, categories]);

  // Очищаем кэш предыдущего помещения после анимации
  useEffect(() => {
    if (prevSelectedRoomRef.current && prevSelectedRoomRef.current !== selectedRoom) {
      const prevRoom = prevSelectedRoomRef.current;
      const timer = setTimeout(() => {
        setCategoriesCache(prev => {
          const newCache = { ...prev };
          delete newCache[prevRoom];
          return newCache;
        });
      }, 450); // Чуть больше времени анимации

      return () => clearTimeout(timer);
    }
    prevSelectedRoomRef.current = selectedRoom;
  }, [selectedRoom]);

  const toggleExpandRoom = (roomSlug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setManuallyCollapsed((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(roomSlug)) {
        newSet.delete(roomSlug);
      } else {
        newSet.add(roomSlug);
      }
      return newSet;
    });
  };

  const handleRoomClick = (roomSlug: string) => {
    // Если помещение уже выбрано, снимаем выбор
    if (selectedRoom === roomSlug) {
      onSelectRoom(null);
      setManuallyCollapsed(new Set());
    } else {
      // Выбираем помещение
      onSelectRoom(roomSlug);
      // Убираем из списка свернутых, чтобы оно развернулось
      setManuallyCollapsed((prev) => {
        const newSet = new Set(prev);
        newSet.delete(roomSlug);
        return newSet;
      });
    }
  };

  return (
    <div className="category-filter">
      <h3 className="category-filter__title">Помещения и категории</h3>
      <div className="category-filter__divider"></div>
      <ul className="category-filter__list">
        {rooms.map((room) => {
          const isRoomSelected = selectedRoom === room.slug;
          const roomCategories = categoriesCache[room.slug] || [];
          const hasCategories = roomCategories.length > 0;
          // Автоматически разворачиваем выбранное помещение, если оно не свернуто вручную
          const isExpanded = isRoomSelected && !manuallyCollapsed.has(room.slug);
          const showAccordionBtn = isRoomSelected && hasCategories;

          return (
            <li key={room.id} className="category-filter__item">
              <div className="category-filter__parent-wrapper">
                <button
                  className={`category-filter__accordion-btn ${!showAccordionBtn ? "category-filter__accordion-btn--hidden" : ""}`}
                  onClick={(e) => toggleExpandRoom(room.slug, e)}
                  aria-label={isExpanded ? "Свернуть" : "Развернуть"}
                  disabled={!showAccordionBtn}
                >
                  {isExpanded ? (
                    <ChevronDown size={18} strokeWidth={2.5} />
                  ) : (
                    <ChevronRight size={18} strokeWidth={2.5} />
                  )}
                </button>
                
                <button
                  className={`category-filter__button ${
                    isRoomSelected ? "category-filter__button--active" : ""
                  }`}
                  onClick={() => handleRoomClick(room.slug)}
                >
                  <span className="category-filter__name">{room.name}</span>
                  <span
                    className={`category-filter__checkbox ${
                      isRoomSelected ? "category-filter__checkbox--checked" : ""
                    }`}
                  >
                    {isRoomSelected && <Check size={16} strokeWidth={3} />}
                  </span>
                </button>
              </div>

              {/* Контейнер рендерится если есть кэшированные категории */}
              {hasCategories && (
                <div className={`category-filter__sublist-container ${isRoomSelected && isExpanded ? 'category-filter__sublist-container--expanded' : ''}`}>
                  <div className="category-filter__sublist-inner">
                    <ul className="category-filter__sublist">
                      {roomCategories.map((category) => {
                        const isCategorySelected = selectedCategories.includes(category.id);

                        return (
                          <li key={category.id} className="category-filter__subitem">
                            <button
                              className={`category-filter__button category-filter__button--sub ${
                                isCategorySelected ? "category-filter__button--active" : ""
                              }`}
                              onClick={() => onToggleCategory(category.id)}
                            >
                              <span className="category-filter__name category-filter__name--sub">
                                {category.name}
                              </span>
                              <span
                                className={`category-filter__checkbox category-filter__checkbox--small ${
                                  isCategorySelected ? "category-filter__checkbox--checked" : ""
                                }`}
                              >
                                {isCategorySelected && <Check size={14} strokeWidth={3} />}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}

            </li>
          );
        })}
      </ul>
    </div>
  );
};

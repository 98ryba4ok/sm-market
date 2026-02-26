import { Star, X } from "lucide-react";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { Button } from "../../ui/Button/Button";
import "./ReviewFormDrawer.css";

interface ReviewFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  initialRating?: number;
  initialComment?: string;
  isEditing?: boolean;
}

export const ReviewFormDrawer = ({
  isOpen,
  onClose,
  onSubmit,
  initialRating = 5,
  initialComment = "",
  isEditing = false,
}: ReviewFormDrawerProps) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, comment);
    setRating(5);
    setComment("");
  };

  const handleClose = () => {
    setRating(5);
    setComment("");
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="review-form-drawer__overlay" />
        <Dialog.Content className="review-form-drawer__content">
          <Dialog.Close className="review-form-drawer__close-button">
            <X size={24} />
          </Dialog.Close>

          <div className="review-form-drawer__header">
            <h2 className="review-form-drawer__title">
              {isEditing ? "Редактировать отзыв" : "Написать отзыв"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="review-form-drawer__form">
            <div className="review-form-drawer__form-group">
              <label className="review-form-drawer__label">Рейтинг:</label>
              <div className="review-form-drawer__rating-input">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className="review-form-drawer__rating-star"
                    onClick={() => setRating(i + 1)}
                    aria-label={`Оценить ${i + 1} звезд`}
                  >
                    <Star
                      size={28}
                      fill={i < rating ? "currentColor" : "none"}
                      className={i < rating ? "review-form-drawer__rating-star--filled" : ""}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="review-form-drawer__form-group">
              <label className="review-form-drawer__label" htmlFor="comment">
                Комментарий:
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
                required
                placeholder="Расскажите о вашем опыте использования товара..."
                className="review-form-drawer__textarea"
              />
            </div>

            <div className="review-form-drawer__actions">
              <Button type="submit" variant="primary" className="review-form-drawer__submit-button">
                {isEditing ? "Обновить отзыв" : "Отправить отзыв"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                className="review-form-drawer__cancel-button"
              >
                Отмена
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
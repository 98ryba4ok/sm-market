import { Star } from "lucide-react";
import { useState } from "react";
import "../../styles/info-page.css";
import "./CompanyReviewsPage.css";

const REVIEWS = [
  {
    id: 1,
    name: "Александр К.",
    city: "Москва",
    rating: 5,
    date: "15 февраля 2025",
    text: "Заказывал ванну и смесители. Всё пришло в отличном состоянии, упаковано надёжно. Доставка точно в срок. Менеджер помог с выбором — подобрал то, что идеально подходит под мой ремонт. Рекомендую!",
    product: "Ванна акриловая 170×70",
  },
  {
    id: 2,
    name: "Елена М.",
    city: "Санкт-Петербург",
    rating: 5,
    date: "3 марта 2025",
    text: "Прекрасный магазин! Огромный выбор плитки, удобный фильтр по размерам и стилям. Заказала две коллекции — полностью совпали с фото на сайте. Доставка курьером на следующий день.",
    product: "Плитка керамическая 60×60",
  },
  {
    id: 3,
    name: "Дмитрий П.",
    city: "Екатеринбург",
    rating: 4,
    date: "20 января 2025",
    text: "Хороший магазин с широким ассортиментом. Единственный минус — немного долго обрабатывали заказ (3 дня вместо 1), но в итоге всё пришло в порядке. Товар качественный, цены приятные.",
    product: "Унитаз с инсталляцией",
  },
  {
    id: 4,
    name: "Ольга Н.",
    city: "Новосибирск",
    rating: 5,
    date: "7 марта 2025",
    text: "Покупаю здесь уже третий раз. Всегда стабильно: хорошее качество, быстрая доставка, вежливые менеджеры. В этот раз взяла мебель для ванной — очень довольна. Советую всем!",
    product: "Тумба под раковину",
  },
  {
    id: 5,
    name: "Сергей В.",
    city: "Краснодар",
    rating: 5,
    date: "25 февраля 2025",
    text: "Отличный опыт покупки. Консультант по телефону прекрасно разбирается в товаре, помог подобрать смеситель под конкретную модель раковины. Установили — всё подошло идеально.",
    product: "Смеситель для раковины",
  },
  {
    id: 6,
    name: "Наталья Г.",
    city: "Казань",
    rating: 4,
    date: "10 марта 2025",
    text: "Заказывала душевую кабину. Привезли чуть позже обещанного, но сразу позвонили и предупредили. Сборка несложная, инструкция понятная. Качество хорошее за эти деньги.",
    product: "Душевая кабина 90×90",
  },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={16}
        className={s <= rating ? "star-rating__star--filled" : "star-rating__star--empty"}
      />
    ))}
  </div>
);

export const CompanyReviewsPage = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", city: "", rating: "5", text: "" });

  const avgRating = (REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length).toFixed(1);
  const counts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: REVIEWS.filter((r) => r.rating === s).length,
  }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="info-page">
      <div className="info-page__hero">
        <div className="info-page__hero-inner">
          <h1 className="info-page__title">Отзывы о компании</h1>
          <p className="info-page__subtitle">
            Мнения наших покупателей — лучший показатель качества нашей работы.
          </p>
        </div>
      </div>

      <div className="info-page__container info-page__content">
        {/* Общий рейтинг */}
        <div className="reviews-summary">
          <div className="reviews-summary__score">
            <div className="reviews-summary__number">{avgRating}</div>
            <StarRating rating={Math.round(Number(avgRating))} />
            <p className="reviews-summary__count">{REVIEWS.length} отзывов</p>
          </div>
          <div className="reviews-summary__bars">
            {counts.map(({ star, count }) => (
              <div key={star} className="reviews-bar">
                <span className="reviews-bar__label">{star} ★</span>
                <div className="reviews-bar__track">
                  <div
                    className="reviews-bar__fill"
                    style={{ width: `${(count / REVIEWS.length) * 100}%` }}
                  />
                </div>
                <span className="reviews-bar__count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Карточки отзывов */}
        <div className="info-page__section">
          <h2 className="info-page__section-title">Последние отзывы</h2>
          <div className="reviews-grid">
            {REVIEWS.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-card__header">
                  <div className="review-card__avatar">
                    {review.name.charAt(0)}
                  </div>
                  <div className="review-card__meta">
                    <span className="review-card__name">{review.name}</span>
                    <span className="review-card__city">{review.city}</span>
                  </div>
                  <div className="review-card__rating">
                    <StarRating rating={review.rating} />
                    <span className="review-card__date">{review.date}</span>
                  </div>
                </div>
                <p className="review-card__text">{review.text}</p>
                <div className="review-card__product">
                  <span className="info-badge">Товар: {review.product}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Форма */}
        <div className="info-page__section">
          <h2 className="info-page__section-title">Оставить отзыв</h2>
          <div className="info-card" style={{ maxWidth: 640 }}>
            {sent ? (
              <div className="info-form__success">
                <div className="info-form__success-icon">
                  <Star size={28} />
                </div>
                <h3 className="info-form__success-title">Спасибо за отзыв!</h3>
                <p className="info-form__success-text">
                  Ваш отзыв будет опубликован после проверки модератором.
                </p>
              </div>
            ) : (
              <form className="info-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <div className="info-form__row">
                  <div className="info-form__field">
                    <label className="info-form__label">Ваше имя *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Иван И."
                      className="info-form__input"
                      required
                    />
                  </div>
                  <div className="info-form__field">
                    <label className="info-form__label">Город</label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Москва"
                      className="info-form__input"
                    />
                  </div>
                </div>
                <div className="info-form__field">
                  <label className="info-form__label">Оценка *</label>
                  <select
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    className="info-form__select"
                  >
                    <option value="5">★★★★★ — Отлично</option>
                    <option value="4">★★★★☆ — Хорошо</option>
                    <option value="3">★★★☆☆ — Нормально</option>
                    <option value="2">★★☆☆☆ — Плохо</option>
                    <option value="1">★☆☆☆☆ — Ужасно</option>
                  </select>
                </div>
                <div className="info-form__field">
                  <label className="info-form__label">Ваш отзыв *</label>
                  <textarea
                    name="text"
                    value={form.text}
                    onChange={handleChange}
                    placeholder="Расскажите о вашем опыте покупки..."
                    className="info-form__textarea"
                    required
                  />
                </div>
                <button type="submit" className="info-form__btn">
                  Отправить отзыв
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

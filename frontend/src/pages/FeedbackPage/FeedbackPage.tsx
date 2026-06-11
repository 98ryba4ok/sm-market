import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import "../../styles/info-page.css";
import "./FeedbackPage.css";

export const FeedbackPage = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="info-page">
      <div className="info-page__hero">
        <div className="info-page__hero-inner">
          <h1 className="info-page__title">Обратная связь</h1>
          <p className="info-page__subtitle">
            Есть вопросы, предложения или замечания? Напишите нам — мы ответим в течение
            одного рабочего дня.
          </p>
        </div>
      </div>

      <div className="info-page__container info-page__content">
        <div className="info-page__two-col">
          {/* Контактная информация */}
          <div>
            <h2 className="info-page__section-title">Свяжитесь с нами</h2>
            <div className="contact-block">
              <div className="contact-item">
                <div className="contact-item__icon">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="contact-item__label">Телефон</p>
                  <a href="tel:+79685783251" className="contact-item__value">
                    +7 (968) 578-32-51
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item__icon">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="contact-item__label">Email</p>
                  <a href="mailto:santexnika17@bk.ru" className="contact-item__value">
                    santexnika17@bk.ru
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item__icon">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="contact-item__label">Адрес</p>
                  <span className="contact-item__value">
                    г. Москва, ул. Дегунинская, д. 17
                  </span>
                </div>
              </div>
            </div>

            <div className="feedback-hours">
              <h3 className="feedback-hours__title">Режим работы</h3>
              <div className="feedback-hours__row">
                <span>Пн–Пт:</span>
                <span>9:00 – 20:00</span>
              </div>
              <div className="feedback-hours__row">
                <span>Сб–Вс:</span>
                <span>10:00 – 18:00</span>
              </div>
            </div>
          </div>

          {/* Форма */}
          <div className="info-card">
            {sent ? (
              <div className="info-form__success">
                <div className="info-form__success-icon">
                  <Mail size={28} />
                </div>
                <h3 className="info-form__success-title">Сообщение отправлено!</h3>
                <p className="info-form__success-text">
                  Спасибо за обращение. Мы ответим вам в течение одного рабочего дня.
                </p>
                <button className="info-form__btn" onClick={() => setSent(false)}>
                  Написать ещё раз
                </button>
              </div>
            ) : (
              <form className="info-form" onSubmit={handleSubmit}>
                <div className="info-form__row">
                  <div className="info-form__field">
                    <label className="info-form__label">Ваше имя *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Иван Иванов"
                      className="info-form__input"
                      required
                    />
                  </div>
                  <div className="info-form__field">
                    <label className="info-form__label">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="ivan@mail.ru"
                      className="info-form__input"
                      required
                    />
                  </div>
                </div>
                <div className="info-form__row">
                  <div className="info-form__field">
                    <label className="info-form__label">Телефон</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+7 (999) 123-45-67"
                      className="info-form__input"
                    />
                  </div>
                  <div className="info-form__field">
                    <label className="info-form__label">Тема обращения</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="info-form__select"
                    >
                      <option value="">Выберите тему</option>
                      <option value="order">Вопрос по заказу</option>
                      <option value="product">Вопрос по товару</option>
                      <option value="delivery">Доставка</option>
                      <option value="return">Возврат / обмен</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>
                </div>
                <div className="info-form__field">
                  <label className="info-form__label">Сообщение *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Опишите ваш вопрос или предложение..."
                    className="info-form__textarea"
                    required
                  />
                </div>
                <button type="submit" className="info-form__btn">
                  Отправить сообщение
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

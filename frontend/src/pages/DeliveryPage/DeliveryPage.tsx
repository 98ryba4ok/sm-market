import { CheckCircle, Clock, MapPin, Package, Truck } from "lucide-react";
import "../../styles/info-page.css";
import "./DeliveryPage.css";

export const DeliveryPage = () => {
  return (
    <div className="info-page">
      <div className="info-page__hero">
        <div className="info-page__hero-inner">
          <h1 className="info-page__title">Доставка</h1>
          <p className="info-page__subtitle">
            Доставляем заказы по всей России. Выберите удобный способ доставки
            и получите товар в комфортное для вас время.
          </p>
        </div>
      </div>

      <div className="info-page__container info-page__content">
        {/* Способы доставки */}
        <div className="info-page__section">
          <h2 className="info-page__section-title">Способы доставки</h2>
          <div className="info-page__grid-3">
            <div className="delivery-method-card delivery-method-card--featured">
              <div className="delivery-method-card__icon">
                <Truck size={28} />
              </div>
              <h3 className="delivery-method-card__title">Курьерская доставка</h3>
              <p className="delivery-method-card__text">
                Доставка по Москве и Московской области через сервис <strong>Достависта</strong>. Быстро и надёжно.
              </p>
              <div className="delivery-method-card__details">
                <div className="delivery-detail">
                  <Clock size={15} />
                  <span>1–2 рабочих дня</span>
                </div>
                <div className="delivery-detail">
                  <span className="delivery-method-card__price">от 390 ₽</span>
                </div>
              </div>
            </div>

            <div className="delivery-method-card">
              <div className="delivery-method-card__icon">
                <Package size={28} />
              </div>
              <h3 className="delivery-method-card__title">Транспортная компания</h3>
              <p className="delivery-method-card__text">
                Доставка в любой город России через ТК СДЭК, Деловые Линии, Boxberry
              </p>
              <div className="delivery-method-card__details">
                <div className="delivery-detail">
                  <Clock size={15} />
                  <span>3–14 рабочих дней</span>
                </div>
                <div className="delivery-detail">
                  <span className="delivery-method-card__price">от 290 ₽</span>
                </div>
              </div>
            </div>

            <div className="delivery-method-card">
              <div className="delivery-method-card__icon">
                <MapPin size={28} />
              </div>
              <h3 className="delivery-method-card__title">Самовывоз</h3>
              <p className="delivery-method-card__text">
                Заберите заказ из нашего магазина в Москве. Готовность заказа — 1 рабочий день
              </p>
              <div className="delivery-method-card__details">
                <div className="delivery-detail">
                  <MapPin size={15} />
                  <span>ул. Дегунинская, д. 17</span>
                </div>
                <div className="delivery-detail">
                  <span className="delivery-method-card__price">Бесплатно</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Зоны и стоимость */}
        <div className="info-page__section">
          <h2 className="info-page__section-title">Стоимость доставки по Москве</h2>
          <div className="delivery-zones">
            <div className="delivery-zone-table">
              <div className="delivery-zone-row delivery-zone-row--header">
                <span>Зона доставки</span>
                <span>Сроки</span>
                <span>Стоимость</span>
                <span>Бесплатно от</span>
              </div>
              {[
                { zone: "Москва (в пределах МКАД)", time: "1 день", price: "390 ₽", free: "5 000 ₽" },
                { zone: "Московская область (до 30 км)", time: "1–2 дня", price: "590 ₽", free: "8 000 ₽" },
                { zone: "Московская область (30–100 км)", time: "2–3 дня", price: "790 ₽", free: "12 000 ₽" },
                { zone: "Регионы России", time: "3–14 дней", price: "от 290 ₽", free: "15 000 ₽" },
              ].map((row, i) => (
                <div key={i} className="delivery-zone-row">
                  <span>{row.zone}</span>
                  <span>{row.time}</span>
                  <span>{row.price}</span>
                  <span className="delivery-zone-row__free">{row.free}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Как работает доставка */}
        <div className="info-page__section">
          <div className="info-page__two-col">
            <div>
              <h2 className="info-page__section-title">Как проходит доставка</h2>
              <div className="step-list">
                {[
                  { title: "Оформите заказ", text: "Добавьте товары в корзину и оформите заказ на сайте" },
                  { title: "Подтверждение", text: "Менеджер свяжется с вами для подтверждения деталей заказа" },
                  { title: "Сборка и упаковка", text: "Товар тщательно упаковываем для безопасной транспортировки" },
                  { title: "Передача в доставку", text: "Заказ передаётся курьеру или в транспортную компанию" },
                  { title: "Получение", text: "Вы получаете SMS с трекингом и принимаете заказ" },
                ].map((s, i) => (
                  <div key={i} className="step-item">
                    <div className="step-item__number">{i + 1}</div>
                    <div className="step-item__content">
                      <p className="step-item__title">{s.title}</p>
                      <p className="step-item__text">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="info-page__section-title">Важно знать</h2>
              <div className="delivery-notes">
                {[
                  "Крупногабаритные товары (ванны, душевые кабины) доставляются до подъезда",
                  "Подъём на этаж оплачивается отдельно: 100 ₽ за этаж, минимум 200 ₽",
                  "При получении обязательно проверяйте товар на наличие повреждений",
                  "Доставка осуществляется в рабочие дни с 9:00 до 21:00",
                  "Время доставки согласовывается с менеджером после оформления заказа",
                  "При отсутствии получателя курьер делает повторный выезд на следующий день",
                ].map((note, i) => (
                  <div key={i} className="delivery-note">
                    <CheckCircle size={16} className="delivery-note__icon" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

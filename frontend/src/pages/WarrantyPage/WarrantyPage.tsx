import { AlertCircle, CheckCircle, HelpCircle, RefreshCw, Shield, XCircle } from "lucide-react";
import "../../styles/info-page.css";
import "./WarrantyPage.css";

const FAQ = [
  {
    q: "В течение какого срока можно вернуть товар?",
    a: "Товар надлежащего качества можно вернуть в течение 14 дней с момента получения. Товар ненадлежащего качества — в течение гарантийного срока.",
  },
  {
    q: "Нужен ли чек для возврата?",
    a: "Наличие чека желательно, но не обязательно. Мы можем найти ваш заказ по номеру телефона или email.",
  },
  {
    q: "Как получить деньги обратно?",
    a: "Возврат осуществляется тем же способом, которым был произведён платёж, в течение 5–10 рабочих дней.",
  },
  {
    q: "Что делать, если товар пришёл повреждённым?",
    a: "Сразу при получении сфотографируйте повреждения, не подписывайте акт приёма и свяжитесь с нами. Мы организуем замену или возврат.",
  },
  {
    q: "Распространяется ли гарантия на потребительское использование?",
    a: "Да, гарантия распространяется на все дефекты производственного характера при условии соблюдения правил эксплуатации.",
  },
];

export const WarrantyPage = () => {
  return (
    <div className="info-page">
      <div className="info-page__hero">
        <div className="info-page__hero-inner">
          <h1 className="info-page__title">Гарантия и возврат</h1>
          <p className="info-page__subtitle">
            Мы несём ответственность за качество каждого товара. Подробная
            информация о гарантии, обмене и возврате покупок.
          </p>
        </div>
      </div>

      <div className="info-page__container info-page__content">
        {/* Гарантийные сроки */}
        <div className="info-page__section">
          <h2 className="info-page__section-title">Гарантийные сроки</h2>
          <div className="info-page__grid-3">
            {[
              { category: "Сантехника (ванны, душевые)", period: "12 месяцев", text: "На все акриловые ванны и душевые кабины" },
              { category: "Смесители и краны", period: "24 месяца", text: "На механизмы смесителей всех производителей" },
              { category: "Унитазы и биде", period: "12 месяцев", text: "На керамические изделия и механизмы бачков" },
              { category: "Мебель для ванны", period: "18 месяцев", text: "На тумбы, зеркала и шкафчики" },
              { category: "Плитка и керамика", period: "24 месяца", text: "На соответствие заявленным характеристикам" },
              { category: "Инсталляции и системы", period: "24 месяца", text: "На инсталляционные системы и скрытые части" },
            ].map((item, i) => (
              <div key={i} className="warranty-card">
                <div className="warranty-card__header">
                  <Shield size={20} />
                  <span className="warranty-card__period">{item.period}</span>
                </div>
                <h3 className="warranty-card__title">{item.category}</h3>
                <p className="warranty-card__text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Возврат товара */}
        <div className="info-page__section">
          <div className="info-page__two-col">
            <div>
              <h2 className="info-page__section-title">Возврат товара</h2>
              <div className="step-list">
                {[
                  { title: "Свяжитесь с нами", text: "Позвоните или напишите на email, сообщите номер заказа и причину возврата" },
                  { title: "Согласование", text: "Менеджер уточнит детали и согласует условия возврата в течение 1 рабочего дня" },
                  { title: "Передача товара", text: "Привезите товар в пункт выдачи или передайте курьеру в оригинальной упаковке" },
                  { title: "Проверка", text: "Специалист проверит товар на соответствие условиям возврата" },
                  { title: "Возврат средств", text: "Деньги вернутся на ваш счёт в течение 5–10 рабочих дней" },
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
              <h2 className="info-page__section-title">Условия возврата</h2>

              <div className="warranty-conditions">
                <div className="warranty-conditions__block">
                  <div className="warranty-conditions__header warranty-conditions__header--yes">
                    <CheckCircle size={18} />
                    <span>Принимаем возврат</span>
                  </div>
                  <ul className="warranty-conditions__list">
                    {[
                      "Товар не был в употреблении",
                      "Сохранена оригинальная упаковка",
                      "Наличие всей комплектации",
                      "Сохранены ярлыки и бирки",
                      "Не прошло 14 дней с момента получения",
                    ].map((item, i) => (
                      <li key={i} className="warranty-conditions__item">
                        <CheckCircle size={14} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="warranty-conditions__block">
                  <div className="warranty-conditions__header warranty-conditions__header--no">
                    <XCircle size={18} />
                    <span>Возврат не принимается</span>
                  </div>
                  <ul className="warranty-conditions__list">
                    {[
                      "Товар был установлен или использован",
                      "Нарушена или отсутствует упаковка",
                      "Самостоятельный ремонт или модификация",
                      "Механические повреждения по вине покупателя",
                    ].map((item, i) => (
                      <li key={i} className="warranty-conditions__item warranty-conditions__item--no">
                        <XCircle size={14} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="warranty-note">
                  <AlertCircle size={16} className="warranty-note__icon" />
                  <p>Товар ненадлежащего качества (заводской брак) принимается к возврату независимо от срока использования в пределах гарантийного срока.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Обмен */}
        <div className="info-page__section">
          <h2 className="info-page__section-title">Обмен товара</h2>
          <div className="info-card">
            <div className="exchange-info">
              <div className="exchange-info__icon">
                <RefreshCw size={28} />
              </div>
              <div>
                <h3 className="exchange-info__title">Обменяем без проблем</h3>
                <p className="info-page__text">
                  Если полученный товар вам не подошёл по размеру, цвету или иным характеристикам,
                  мы готовы обменять его на другой товар из нашего каталога. Обмен осуществляется
                  в течение 14 дней при соблюдении условий сохранности товара.
                </p>
                <p className="info-page__text">
                  Разницу в стоимости при обмене доплачиваете вы (если новый товар дороже)
                  или мы возвращаем вам (если дешевле). Доставку при обмене берём на себя.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="info-page__section">
          <h2 className="info-page__section-title">Частые вопросы</h2>
          <div className="payment-faq">
            {FAQ.map((item, i) => (
              <div key={i} className="faq-item">
                <div className="faq-item__question">
                  <HelpCircle size={18} className="faq-item__icon" />
                  <span>{item.q}</span>
                </div>
                <p className="faq-item__answer">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

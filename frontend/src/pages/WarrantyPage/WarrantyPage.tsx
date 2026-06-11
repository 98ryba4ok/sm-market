import { AlertCircle, CheckCircle, HelpCircle, Shield, XCircle } from "lucide-react";
import "../../styles/info-page.css";
import "./WarrantyPage.css";

const FAQ = [
  {
    q: "В течение какого срока можно вернуть товар?",
    a: "Товар надлежащего качества можно вернуть в течение 14 дней с момента получения. Обращайтесь напрямую в наш магазин.",
  },
  {
    q: "Что делать, если прошло более 14 дней?",
    a: "По истечении 14 дней гарантийные вопросы решаются через сервисный центр. Контакты сервисного центра указаны в гарантийном талоне на товар.",
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
    q: "Каков гарантийный срок на товар?",
    a: "Гарантийный срок индивидуален для каждого товара и указан в гарантийном талоне, который прилагается к покупке.",
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
          <div className="info-card">
            <div className="exchange-info">
              <div className="exchange-info__icon">
                <Shield size={28} />
              </div>
              <div>
                <h3 className="exchange-info__title">Индивидуальный гарантийный срок</h3>
                <p className="info-page__text">
                  Гарантийный срок устанавливается индивидуально для каждого товара производителем.
                  Срок гарантии указан в <strong>гарантийном талоне</strong>, который прилагается к товару при покупке.
                </p>
                <p className="info-page__text">
                  Сохраняйте гарантийный талон — он потребуется при обращении в сервисный центр по истечении 14 дней с момента покупки.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Возврат товара */}
        <div className="info-page__section">
          <div className="info-page__two-col">
            <div>
              <h2 className="info-page__section-title">Порядок возврата</h2>

              <div className="info-card" style={{ marginBottom: "1rem", borderLeft: "4px solid #2563eb", padding: "1.25rem 1.5rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <CheckCircle size={22} color="#2563eb" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>До 14 дней — обращайтесь в магазин</p>
                    <p className="info-page__text" style={{ margin: 0 }}>
                      Если с момента получения товара прошло не более 14 дней, свяжитесь с нами напрямую. Мы поможем оформить возврат или обмен.
                    </p>
                    <p className="info-page__text" style={{ marginTop: "0.5rem", marginBottom: 0 }}>
                      <strong>Телефон:</strong>{" "}
                      <a href="tel:+79685783251" style={{ color: "#2563eb" }}>+7 (968) 578-32-51</a>
                      {" · "}
                      <strong>Email:</strong>{" "}
                      <a href="mailto:santexnika17@bk.ru" style={{ color: "#2563eb" }}>santexnika17@bk.ru</a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="info-card" style={{ marginBottom: "1rem", borderLeft: "4px solid #f59e0b", padding: "1.25rem 1.5rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                  <AlertCircle size={22} color="#f59e0b" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>После 14 дней — сервисный центр</p>
                    <p className="info-page__text" style={{ margin: 0 }}>
                      По истечении 14 дней гарантийные претензии рассматриваются через сервисный центр производителя.
                      Адрес и контакты сервисного центра указаны в гарантийном талоне на ваш товар.
                    </p>
                  </div>
                </div>
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

        {/* Контакты для возврата */}
        <div className="info-page__section">
          <div className="info-card" style={{ padding: "1.5rem 2rem" }}>
            <h2 className="info-page__section-title" style={{ marginBottom: "1rem" }}>Контакты для возврата</h2>
            <p className="info-page__text">
              <strong>E-mail:</strong>{" "}
              <a href="mailto:santexnika17@bk.ru" style={{ color: "#2563eb" }}>santexnika17@bk.ru</a>
            </p>
            <p className="info-page__text">
              <strong>Телефон:</strong>{" "}
              <a href="tel:+79685783251" style={{ color: "#2563eb" }}>+7 (968) 578-32-51</a>
            </p>
            <p className="info-page__text">
              <strong>Адрес:</strong> г. Москва, ул. Дегунинская, д. 17
            </p>
            <p className="info-page__text">
              <strong>Режим работы:</strong> пн–пт, 10:00–18:00 (МСК)
            </p>
            <p className="info-page__text" style={{ marginTop: "1rem", color: "#6b7280", fontSize: "0.875rem" }}>
              Настоящие условия разработаны в соответствии с Законом РФ от 07.02.1992 № 2300-I
              «О защите прав потребителей» и действуют с 15 мая 2026 г.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

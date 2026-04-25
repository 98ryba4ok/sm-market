import { CheckCircle, CreditCard, HelpCircle, Shield } from "lucide-react";
import "../../styles/info-page.css";
import "./PaymentInfoPage.css";

const FAQ = [
  {
    q: "Когда происходит списание средств?",
    a: "Средства списываются сразу после подтверждения заказа. При оплате наличными — в момент получения товара.",
  },
  {
    q: "Могу ли я оплатить частями?",
    a: "Да, мы предлагаем оплату в рассрочку на 3, 6 или 12 месяцев без процентов через банки-партнёры.",
  },
  {
    q: "Безопасна ли оплата картой на сайте?",
    a: "Все платежи обрабатываются через защищённый шлюз с шифрованием SSL. Мы не храним данные карт.",
  },
  {
    q: "Могу ли я получить чек?",
    a: "Электронный чек отправляется на email после оплаты. Бумажный чек выдаётся при получении заказа.",
  },
  {
    q: "Что делать, если платёж не прошёл?",
    a: "Проверьте данные карты и лимиты. Если проблема сохраняется — свяжитесь с нами или попробуйте другую карту.",
  },
];

export const PaymentInfoPage = () => {
  return (
    <div className="info-page">
      <div className="info-page__hero">
        <div className="info-page__hero-inner">
          <h1 className="info-page__title">Оплата</h1>
          <p className="info-page__subtitle">
            Выберите удобный способ оплаты. Все платежи защищены современными
            технологиями шифрования данных.
          </p>
        </div>
      </div>

      <div className="info-page__container info-page__content">
        {/* Способы оплаты */}
        <div className="info-page__section">
          <h2 className="info-page__section-title">Способы оплаты</h2>
          <div className="info-page__grid-3">
            {[
              {
                icon: <CreditCard size={28} />,
                title: "Банковская карта",
                text: "Оплата картами Visa, Mastercard, МИР онлайн на сайте. Безопасное соединение SSL",
                badge: "Онлайн",
              },
              {
                icon: <Shield size={28} />,
                title: "Наличными",
                text: "Оплата наличными курьеру при получении или в нашем пункте выдачи",
                badge: "При получении",
              },
              {
                icon: <CheckCircle size={28} />,
                title: "Рассрочка",
                text: "Оплата в рассрочку на 3, 6 или 12 месяцев без процентов и переплат",
                badge: "0%",
              },
            ].map((method, i) => (
              <div key={i} className="payment-method-card">
                <div className="payment-method-card__top">
                  <div className="payment-method-card__icon">{method.icon}</div>
                  <span className="info-badge info-badge--green">{method.badge}</span>
                </div>
                <h3 className="payment-method-card__title">{method.title}</h3>
                <p className="payment-method-card__text">{method.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Как оплатить */}
        <div className="info-page__section">
          <div className="info-page__two-col">
            <div>
              <h2 className="info-page__section-title">Как оплатить заказ</h2>
              <div className="step-list">
                {[
                  { title: "Выберите товары", text: "Добавьте нужные товары в корзину" },
                  { title: "Оформите заказ", text: "Укажите адрес доставки и контактные данные" },
                  { title: "Выберите способ оплаты", text: "Выберите банковскую карту, наличные или рассрочку" },
                  { title: "Подтвердите платёж", text: "Введите данные карты и подтвердите операцию" },
                  { title: "Получите чек", text: "Электронный чек придёт на ваш email после оплаты" },
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

            {/* Безопасность */}
            <div>
              <h2 className="info-page__section-title">Безопасность платежей</h2>
              <div className="payment-security">
                <div className="payment-security__badge">
                  <Shield size={40} />
                  <div>
                    <p className="payment-security__title">Защищено SSL</p>
                    <p className="payment-security__text">
                      Все транзакции шифруются по протоколу SSL 256-bit
                    </p>
                  </div>
                </div>
                <div className="payment-security__items">
                  {[
                    "Данные карт не сохраняются на наших серверах",
                    "Оплата через сертифицированный платёжный шлюз ЮКасса",
                    "Поддержка технологии 3D Secure",
                    "Возврат средств в случае отмены заказа в течение 5 рабочих дней",
                  ].map((item, i) => (
                    <div key={i} className="delivery-note">
                      <CheckCircle size={16} className="delivery-note__icon" />
                      <span>{item}</span>
                    </div>
                  ))}
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
      </div>
    </div>
  );
};

import { Award, CheckCircle, Star, TrendingUp, Users } from "lucide-react";
import "../../styles/info-page.css";
import "./AboutPage.css";

export const AboutPage = () => {
  return (
    <div className="info-page">
      <div className="info-page__hero">
        <div className="info-page__hero-inner">
          <h1 className="info-page__title">О компании SM Market</h1>
          <p className="info-page__subtitle">
            Мы — один из ведущих интернет-магазинов сантехники и товаров для ремонта в России.
            Более 10 лет помогаем создавать уютные и функциональные пространства.
          </p>
        </div>
      </div>

      <div className="info-page__container info-page__content">
        {/* Статистика */}
        <div className="info-page__stats">
          <div className="stat-card">
            <div className="stat-card__number">10+</div>
            <div className="stat-card__label">лет на рынке</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__number">50 000+</div>
            <div className="stat-card__label">довольных клиентов</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__number">15 000+</div>
            <div className="stat-card__label">товаров в каталоге</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__number">120+</div>
            <div className="stat-card__label">городов доставки</div>
          </div>
        </div>

        {/* О нас */}
        <div className="info-page__section">
          <div className="info-page__two-col">
            <div>
              <h2 className="info-page__section-title">Наша история</h2>
              <p className="info-page__text">
                SM Market был основан в 2014 году с одной простой идеей: сделать
                качественную сантехнику и товары для ванной комнаты доступными для каждого
                жителя России.
              </p>
              <p className="info-page__text">
                Начав с небольшого ассортимента, мы постепенно расширились до более чем
                15 000 позиций от ведущих российских и европейских производителей.
                Сегодня мы работаем по всей стране и доставляем заказы в 120+ городов.
              </p>
              <p className="info-page__text">
                Нашим клиентам мы предлагаем не только широкий выбор, но и
                профессиональные консультации, помощь в подборе товаров и надёжный
                сервис на всех этапах покупки.
              </p>
            </div>
            <div>
              <h2 className="info-page__section-title">Наша миссия</h2>
              <p className="info-page__text">
                Помогать людям создавать красивые, функциональные и комфортные
                пространства у себя дома, предлагая лучшие товары по честным ценам
                и с превосходным сервисом.
              </p>
              <div className="about-values">
                {[
                  { icon: <CheckCircle size={18} />, text: "Качество проверенных брендов" },
                  { icon: <TrendingUp size={18} />, text: "Честные цены без переплат" },
                  { icon: <Users size={18} />, text: "Экспертная поддержка клиентов" },
                  { icon: <Star size={18} />, text: "Гарантия на все товары" },
                  { icon: <Award size={18} />, text: "Быстрая и надёжная доставка" },
                ].map((item, i) => (
                  <div key={i} className="about-value">
                    <span className="about-value__icon">{item.icon}</span>
                    <span className="about-value__text">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Почему мы */}
        <div className="info-page__section">
          <h2 className="info-page__section-title">Почему выбирают нас</h2>
          <div className="info-page__grid-3">
            {[
              {
                icon: <Award size={24} />,
                title: "Только оригиналы",
                text: "Все товары сертифицированы и поставляются напрямую от официальных дистрибьюторов",
              },
              {
                icon: <Users size={24} />,
                title: "Персональный подход",
                text: "Наши консультанты помогут подобрать товары под ваш проект и бюджет",
              },
              {
                icon: <TrendingUp size={24} />,
                title: "Лучшие цены",
                text: "Работаем напрямую с поставщиками, чтобы предложить максимально выгодные условия",
              },
              {
                icon: <CheckCircle size={24} />,
                title: "Гарантия качества",
                text: "Предоставляем гарантию на все товары и осуществляем возврат без лишних вопросов",
              },
              {
                icon: <Star size={24} />,
                title: "Быстрая доставка",
                text: "Доставляем заказы по всей России. Экспресс-доставка в день заказа по Москве",
              },
              {
                icon: <Users size={24} />,
                title: "50 000 клиентов",
                text: "Нам доверяют десятки тысяч покупателей по всей стране уже более 10 лет",
              },
            ].map((card, i) => (
              <div key={i} className="icon-card">
                <div className="icon-card__icon">{card.icon}</div>
                <h3 className="icon-card__title">{card.title}</h3>
                <p className="icon-card__text">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

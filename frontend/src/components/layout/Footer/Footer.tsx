import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import "./Footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          <div>
            <h3 className="footer__section-title">О нас</h3>
            <ul className="footer__list">
              <li>
                <Link to="/about" className="footer__link">
                  О компании
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="footer__link">
                  Обратная связь
                </Link>
              </li>
              <li>
                <Link to="/suppliers" className="footer__link">
                  Поставщикам
                </Link>
              </li>
              <li>
                <Link to="/company" className="footer__link">
                  Отзывы о компании
                </Link>
              </li>
              <li>
                <Link to="/vacancies" className="footer__link">
                  Вакансии
                </Link>
              </li>
            </ul>
          </div>

          {/* Каталог */}
          <div>
            <h3 className="footer__section-title">Каталог</h3>
            <ul className="footer__list">
              <li>
                <Link to="/catalog/bathrooms" className="footer__link">
                  Сантехника
                </Link>
              </li>
              <li>
                <Link to="/catalog/kitchens" className="footer__link">
                  Кухни
                </Link>
              </li>
              <li>
                <Link to="/catalog/toilets" className="footer__link">
                  Унитазы
                </Link>
              </li>
              <li>
                <Link to="/catalog/tiles" className="footer__link">
                  Плитка
                </Link>
              </li>
              <li>
                <Link to="/catalog/furniture" className="footer__link">
                  Мебель для ванны
                </Link>
              </li>
            </ul>
          </div>

          {/* Покупателям */}
          <div>
            <h3 className="footer__section-title">Покупателям</h3>
            <ul className="footer__list">
              <li>
                <Link to="/orders" className="footer__link">
                  Мои заказы
                </Link>
              </li>
              <li>
                <Link to="/delivery" className="footer__link">
                  Доставка
                </Link>
              </li>
              <li>
                <Link to="/payment" className="footer__link">
                  Оплата
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="footer__link">
                  Гарантия и возврат
                </Link>
              </li>
            </ul>
          </div>

          {/* Сервис */}
          <div>
            <h3 className="footer__section-title">Сервис</h3>
            <ul className="footer__list">
              <li>
                <Link to="/installation" className="footer__link">
                  Монтаж и установка
                </Link>
              </li>
              <li>
                <Link to="/express-delivery" className="footer__link">
                  Ускоренная доставка
                </Link>
              </li>
              <li>
                <Link to="/projects" className="footer__link">
                  Проекты
                </Link>
              </li>
              <li>
                <Link to="/design" className="footer__link">
                  Дизайн-проекты
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="footer__section-title">Контакты</h3>
            <ul className="footer__list footer__list--spaced">
              <li>
                <a href="tel:84951234567" className="footer__contact-link">
                  <Phone size={16} />
                  8 495 123 45 67
                </a>
              </li>
              <li>
                <a href="tel:88001234567" className="footer__contact-link">
                  <Phone size={16} />
                  8 800 123 45 67
                </a>
              </li>
              <li>
                <a href="mailto:info@smmarket.ru" className="footer__contact-link">
                  <Mail size={16} />
                  info@smmarket.ru
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__copyright">
          <p>© SM Market, 2025</p>
          <p>Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

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
                <Link to="/company" className="footer__link">
                  Отзывы о компании
                </Link>
              </li>
            </ul>
          </div>

          {/* Каталог */}
          <div>
            <h3 className="footer__section-title">Каталог</h3>
            <ul className="footer__list">
              <li>
                <Link to="/catalog?search=сантехника" className="footer__link">
                  Сантехника
                </Link>
              </li>
              <li>
                <Link to="/catalog?search=кухня" className="footer__link">
                  Кухни
                </Link>
              </li>
              <li>
                <Link to="/catalog?search=унитаз" className="footer__link">
                  Унитазы
                </Link>
              </li>
              <li>
                <Link to="/catalog?search=плитка" className="footer__link">
                  Плитка
                </Link>
              </li>
              <li>
                <Link to="/catalog?search=мебель+для+ванны" className="footer__link">
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

          {/* Контакты */}
          <div>
            <h3 className="footer__section-title">Контакты</h3>
            <ul className="footer__list footer__list--spaced">
              <li>
                <a href="tel:+79685783251" className="footer__contact-link">
                  <Phone size={16} />
                  +7 (968) 578-32-51
                </a>
              </li>
              <li>
                <a href="mailto:santexnika17@bk.ru" className="footer__contact-link">
                  <Mail size={16} />
                  santexnika17@bk.ru
                </a>
              </li>
              <li className="footer__contact-link" style={{ cursor: "default" }}>
                г. Москва, ул. Дегунинская, д. 17
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__copyright">
          <p>© SM Market, 2025. Все права защищены.</p>
          <div className="footer__legal-links">
            <Link to="/offer" className="footer__link">
              Публичная оферта
            </Link>
            <Link to="/privacy" className="footer__link">
              Политика конфиденциальности
            </Link>
            <Link to="/warranty" className="footer__link">
              Условия возврата
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

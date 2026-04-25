import { Mail, Phone, Shield } from "lucide-react";
import "../../styles/info-page.css";
import "./PrivacyPage.css";

export const PrivacyPage = () => {
  return (
    <div className="info-page">
      <div className="info-page__hero">
        <div className="info-page__hero-inner">
          <div className="privacy-hero__icon">
            <Shield size={36} />
          </div>
          <h1 className="info-page__title">Политика конфиденциальности</h1>
          <p className="info-page__subtitle">
            Дата вступления в силу: 1 января 2025 г.
          </p>
        </div>
      </div>

      <div className="info-page__container info-page__content">
        <div className="privacy-layout">
          {/* Навигация */}
          <nav className="privacy-nav">
            <p className="privacy-nav__title">Содержание</p>
            <ol className="privacy-nav__list">
              {[
                "Общие положения",
                "Какие данные мы собираем",
                "Цели обработки данных",
                "Основания обработки",
                "Хранение и защита данных",
                "Передача третьим лицам",
                "Права пользователей",
                "Файлы cookie",
                "Дети",
                "Изменения политики",
                "Контакты",
              ].map((item, i) => (
                <li key={i}>
                  <a href={`#section-${i + 1}`} className="privacy-nav__link">
                    {i + 1}. {item}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Контент */}
          <div className="privacy-content">
            <div className="privacy-intro info-card">
              <Shield size={20} className="privacy-intro__icon" />
              <p>
                ООО «СМ Маркет» (далее — «Компания», «мы») уважает конфиденциальность
                своих пользователей и обязуется защищать их персональные данные.
                Настоящая Политика конфиденциальности описывает, какие данные мы
                собираем, как используем и как защищаем в соответствии с Федеральным
                законом № 152-ФЗ «О персональных данных».
              </p>
            </div>

            <section id="section-1" className="privacy-section">
              <h2 className="privacy-section__title">1. Общие положения</h2>
              <p className="info-page__text">
                Настоящая Политика применяется к сайту <strong>smmarket.ru</strong> и
                всем связанным с ним сервисам, мобильным приложениям и точкам сбора
                данных (далее — «Сервис»).
              </p>
              <p className="info-page__text">
                Используя Сервис, вы соглашаетесь с условиями настоящей Политики.
                Если вы не согласны с какими-либо её положениями, пожалуйста,
                прекратите использование Сервиса.
              </p>
              <p className="info-page__text">
                Оператором персональных данных является:<br />
                <strong>ООО «СМ Маркет»</strong>, ИНН 7701234567, ОГРН 1147701234567,
                адрес: 123456, г. Москва, ул. Строительная, д. 42.
              </p>
            </section>

            <section id="section-2" className="privacy-section">
              <h2 className="privacy-section__title">2. Какие данные мы собираем</h2>
              <p className="info-page__text">
                В зависимости от того, как вы используете Сервис, мы можем собирать
                следующие категории данных:
              </p>

              <h3 className="privacy-section__subtitle">Данные, которые вы предоставляете</h3>
              <ul className="privacy-list">
                <li>Имя, фамилия, отчество</li>
                <li>Адрес электронной почты (email)</li>
                <li>Номер телефона</li>
                <li>Адрес доставки (город, улица, дом, квартира)</li>
                <li>Данные платёжных операций (без хранения реквизитов карты)</li>
                <li>Содержимое обращений в службу поддержки</li>
                <li>Отзывы и оценки товаров</li>
              </ul>

              <h3 className="privacy-section__subtitle">Данные, собираемые автоматически</h3>
              <ul className="privacy-list">
                <li>IP-адрес и данные о местоположении</li>
                <li>Тип браузера, операционная система, тип устройства</li>
                <li>Дата и время посещения, просмотренные страницы</li>
                <li>Источник перехода (реферальная ссылка)</li>
                <li>Данные файлов cookie и аналогичных технологий</li>
              </ul>
            </section>

            <section id="section-3" className="privacy-section">
              <h2 className="privacy-section__title">3. Цели обработки данных</h2>
              <div className="privacy-purposes">
                {[
                  {
                    purpose: "Исполнение заказов",
                    desc: "Обработка, подтверждение и доставка оформленных заказов, оформление возвратов и обменов",
                  },
                  {
                    purpose: "Обслуживание аккаунта",
                    desc: "Создание и управление личным кабинетом, авторизация, восстановление доступа",
                  },
                  {
                    purpose: "Коммуникация",
                    desc: "Отправка уведомлений о заказах, ответы на обращения в службу поддержки",
                  },
                  {
                    purpose: "Маркетинг",
                    desc: "Рассылка акций, новостей и персональных предложений — только с вашего согласия",
                  },
                  {
                    purpose: "Улучшение Сервиса",
                    desc: "Анализ поведения пользователей для улучшения работы сайта и ассортимента",
                  },
                  {
                    purpose: "Безопасность",
                    desc: "Предотвращение мошенничества, защита от несанкционированного доступа",
                  },
                ].map((item, i) => (
                  <div key={i} className="privacy-purpose-item">
                    <span className="privacy-purpose-item__name">{item.purpose}</span>
                    <span className="privacy-purpose-item__desc">{item.desc}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="section-4" className="privacy-section">
              <h2 className="privacy-section__title">4. Основания обработки</h2>
              <p className="info-page__text">Мы обрабатываем ваши данные на следующих законных основаниях:</p>
              <ul className="privacy-list">
                <li><strong>Исполнение договора</strong> — обработка необходима для оформления и выполнения заказа</li>
                <li><strong>Согласие</strong> — для маркетинговых рассылок и cookie-аналитики (вы можете отозвать согласие в любое время)</li>
                <li><strong>Законные интересы</strong> — для обеспечения безопасности, предотвращения мошенничества и улучшения качества сервиса</li>
                <li><strong>Юридическое обязательство</strong> — при необходимости исполнения требований законодательства РФ</li>
              </ul>
            </section>

            <section id="section-5" className="privacy-section">
              <h2 className="privacy-section__title">5. Хранение и защита данных</h2>
              <p className="info-page__text">
                Мы храним ваши данные не дольше, чем это необходимо для достижения
                целей, указанных в настоящей Политике, или в течение срока, установленного
                применимым законодательством.
              </p>
              <div className="privacy-table">
                <div className="privacy-table__row privacy-table__row--header">
                  <span>Категория данных</span>
                  <span>Срок хранения</span>
                </div>
                {[
                  { cat: "Данные аккаунта", period: "До удаления аккаунта + 3 года" },
                  { cat: "История заказов", period: "5 лет (требование налогового законодательства)" },
                  { cat: "Данные платежей", period: "5 лет" },
                  { cat: "Обращения в поддержку", period: "3 года" },
                  { cat: "Данные cookie / аналитика", period: "До 2 лет" },
                ].map((row, i) => (
                  <div key={i} className="privacy-table__row">
                    <span>{row.cat}</span>
                    <span>{row.period}</span>
                  </div>
                ))}
              </div>
              <p className="info-page__text" style={{ marginTop: "1.25rem" }}>
                Для защиты данных мы применяем шифрование SSL/TLS, ограничиваем
                доступ к данным только уполномоченными сотрудниками, регулярно
                проводим аудит безопасности и используем защищённые серверы на
                территории Российской Федерации.
              </p>
            </section>

            <section id="section-6" className="privacy-section">
              <h2 className="privacy-section__title">6. Передача третьим лицам</h2>
              <p className="info-page__text">
                Мы не продаём и не передаём ваши персональные данные третьим лицам
                в коммерческих целях. Передача возможна только в следующих случаях:
              </p>
              <ul className="privacy-list">
                <li><strong>Транспортные и логистические компании</strong> — для организации доставки заказов (СДЭК, Boxberry, Деловые Линии и др.)</li>
                <li><strong>Платёжные системы</strong> — для обработки платежей (ЮКасса). Реквизиты карт нам не передаются</li>
                <li><strong>Сервисы аналитики</strong> — Яндекс.Метрика, Google Analytics (в обезличенном виде)</li>
                <li><strong>Государственные органы</strong> — по законному запросу в соответствии с законодательством РФ</li>
              </ul>
              <p className="info-page__text">
                Все партнёры обязаны соблюдать конфиденциальность данных и
                использовать их исключительно в целях оказания услуг.
              </p>
            </section>

            <section id="section-7" className="privacy-section">
              <h2 className="privacy-section__title">7. Права пользователей</h2>
              <p className="info-page__text">
                В соответствии с Федеральным законом № 152-ФЗ вы имеете следующие права:
              </p>
              <div className="privacy-rights">
                {[
                  { right: "Доступ", desc: "Получить информацию о том, какие ваши данные мы обрабатываем" },
                  { right: "Исправление", desc: "Потребовать уточнения неточных или неполных данных" },
                  { right: "Удаление", desc: "Потребовать удаления данных («право на забвение»)" },
                  { right: "Ограничение", desc: "Ограничить обработку ваших данных в определённых случаях" },
                  { right: "Переносимость", desc: "Получить ваши данные в машиночитаемом формате" },
                  { right: "Отзыв согласия", desc: "Отозвать согласие на маркетинговые рассылки в любое время" },
                ].map((item, i) => (
                  <div key={i} className="privacy-right-item">
                    <span className="privacy-right-item__name">{item.right}</span>
                    <span className="privacy-right-item__desc">{item.desc}</span>
                  </div>
                ))}
              </div>
              <p className="info-page__text" style={{ marginTop: "1.25rem" }}>
                Для реализации прав направьте запрос на почту{" "}
                <a href="mailto:privacy@smmarket.ru" className="privacy-link">
                  privacy@smmarket.ru
                </a>
                . Мы ответим в течение 30 дней.
              </p>
            </section>

            <section id="section-8" className="privacy-section">
              <h2 className="privacy-section__title">8. Файлы cookie</h2>
              <p className="info-page__text">
                Наш сайт использует файлы cookie — небольшие текстовые файлы,
                сохраняемые в вашем браузере. Мы используем следующие типы cookie:
              </p>
              <div className="privacy-table">
                <div className="privacy-table__row privacy-table__row--header">
                  <span>Тип</span>
                  <span>Назначение</span>
                </div>
                {[
                  { type: "Необходимые", desc: "Обеспечивают базовую работу сайта (авторизация, корзина)" },
                  { type: "Аналитические", desc: "Помогают понять, как пользователи взаимодействуют с сайтом" },
                  { type: "Функциональные", desc: "Запоминают ваши настройки и предпочтения" },
                  { type: "Маркетинговые", desc: "Используются для показа персонализированной рекламы (с согласия)" },
                ].map((row, i) => (
                  <div key={i} className="privacy-table__row">
                    <span>{row.type}</span>
                    <span>{row.desc}</span>
                  </div>
                ))}
              </div>
              <p className="info-page__text" style={{ marginTop: "1.25rem" }}>
                Вы можете управлять cookie через настройки браузера или отказаться
                от необязательных cookie в настройках сайта. Отключение части cookie
                может повлиять на функциональность сайта.
              </p>
            </section>

            <section id="section-9" className="privacy-section">
              <h2 className="privacy-section__title">9. Дети</h2>
              <p className="info-page__text">
                Наш Сервис не предназначен для лиц младше 18 лет. Мы не собираем
                намеренно персональные данные детей. Если вам стало известно, что
                ребёнок предоставил нам свои данные без согласия родителей или
                законных представителей, пожалуйста, свяжитесь с нами для их удаления.
              </p>
            </section>

            <section id="section-10" className="privacy-section">
              <h2 className="privacy-section__title">10. Изменения политики</h2>
              <p className="info-page__text">
                Мы оставляем за собой право вносить изменения в настоящую Политику.
                Актуальная версия всегда доступна на данной странице с указанием
                даты последнего обновления.
              </p>
              <p className="info-page__text">
                При внесении существенных изменений мы уведомим вас по email или
                разместим соответствующее уведомление на сайте. Продолжение использования
                Сервиса после публикации изменений означает ваше согласие с новой редакцией.
              </p>
            </section>

            <section id="section-11" className="privacy-section">
              <h2 className="privacy-section__title">11. Контакты</h2>
              <p className="info-page__text">
                По всем вопросам, связанным с обработкой персональных данных,
                обращайтесь к нам:
              </p>
              <div className="privacy-contacts">
                <div className="contact-item">
                  <div className="contact-item__icon">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="contact-item__label">Email по вопросам приватности</p>
                    <a href="mailto:privacy@smmarket.ru" className="contact-item__value">
                      privacy@smmarket.ru
                    </a>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-item__icon">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="contact-item__label">Телефон</p>
                    <a href="tel:84951234567" className="contact-item__value">
                      8 495 123 45 67
                    </a>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-item__icon">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="contact-item__label">Юридический адрес</p>
                    <span className="contact-item__value">
                      123456, г. Москва, ул. Строительная, д. 42
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <div className="privacy-footer-note">
              <p>
                Последнее обновление: <strong>1 января 2025 г.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";
import { Input } from "../../ui/Input/Input";
import { Button } from "../../ui/Button/Button";
import "./ContactFormSection.css";

export const ContactFormSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    comment: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Здесь будет вызов API
  };

  return (
    <section className="contact-form-section">
      <div className="contact-form-section__container">
        <div className="contact-form-section__grid">
          {/* Image */}
          <div className="contact-form-section__image">
            <div className="contact-form-section__image-background">
              {/* Placeholder for service person image */}
              <div className="contact-form-section__image-placeholder">
                ?
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="contact-form-section__title">
              Не нашли подходящий товар или нужна помощь?
            </h2>
            <p className="contact-form-section__description">
              Оставьте заявку и мы подберем все, что нужно для вашего помещения
            </p>

            <form onSubmit={handleSubmit} className="contact-form-section__form">
              <div className="contact-form-section__inputs-row">
                <Input
                  placeholder="Имя *"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <Input
                  type="tel"
                  placeholder="Телефон *"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <textarea
                  placeholder="Комментарий"
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  className="contact-form-section__textarea"
                />
              </div>

              <div className="contact-form-section__submit-wrapper">
                <Button type="submit" size="lg" style={{ flexShrink: 0 }}>
                  Отправить
                </Button>
                <p className="contact-form-section__disclaimer">
                  Нажимая кнопку Отправить, Вы соглашаетесь с политикой
                  обработки персональных данных
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

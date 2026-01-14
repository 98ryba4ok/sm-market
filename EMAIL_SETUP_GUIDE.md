# 📧 Инструкция по настройке Email для восстановления пароля

## Обзор

Для работы функции восстановления пароля необходимо настроить отправку email. В разработке используется console backend (письма выводятся в консоль), для продакшена нужно настроить SMTP.

---

## 🔧 Настройка для разработки (Console Backend)

**Уже настроено!** В файле `backend/.env` используется:

```env
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

При запросе сброса пароля письмо будет выводиться в консоль Django (терминал где запущен backend).

**Как проверить:**
1. Запустите backend: `docker-compose up` или `python manage.py runserver`
2. Откройте frontend и запросите сброс пароля
3. Смотрите в консоль backend - там будет текст письма со ссылкой

---

## 📮 Настройка для продакшена (SMTP)

### Вариант 1: Gmail SMTP

1. **Создайте App Password в Gmail:**
   - Перейдите: https://myaccount.google.com/apppasswords
   - Войдите в аккаунт Gmail
   - Создайте новый App Password для "Mail"
   - Скопируйте сгенерированный пароль (16 символов)

2. **Обновите `backend/.env`:**

```env
# Email settings для продакшена
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password-here
DEFAULT_FROM_EMAIL=noreply@sm-market.com

# Frontend URL (для ссылок в письмах)
FRONTEND_URL=https://your-domain.com
```

3. **Замените:**
   - `your-email@gmail.com` → ваш Gmail
   - `your-app-password-here` → App Password из шага 1
   - `https://your-domain.com` → URL вашего фронтенда

### Вариант 2: Yandex SMTP

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.yandex.ru
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@yandex.ru
EMAIL_HOST_PASSWORD=your-password
DEFAULT_FROM_EMAIL=noreply@sm-market.com
FRONTEND_URL=https://your-domain.com
```

### Вариант 3: Mail.ru SMTP

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.mail.ru
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@mail.ru
EMAIL_HOST_PASSWORD=your-password
DEFAULT_FROM_EMAIL=noreply@sm-market.com
FRONTEND_URL=https://your-domain.com
```

### Вариант 4: SendGrid (рекомендуется для продакшена)

1. Зарегистрируйтесь на https://sendgrid.com/
2. Создайте API Key
3. Установите: `pip install sendgrid`

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=your-sendgrid-api-key
DEFAULT_FROM_EMAIL=noreply@sm-market.com
FRONTEND_URL=https://your-domain.com
```

---

## 🧪 Тестирование

### 1. Запустите миграции (если еще не запущены):

```bash
# Через Docker
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate

# Или локально
cd backend
python manage.py makemigrations
python manage.py migrate
```

### 2. Запустите проект:

```bash
docker-compose up
```

### 3. Проверьте восстановление пароля:

1. Откройте http://localhost:5173
2. Нажмите "Забыли пароль?" в форме входа
3. Введите email зарегистрированного пользователя
4. **Для console backend:** Проверьте консоль backend - там будет ссылка
5. **Для SMTP:** Проверьте почтовый ящик
6. Перейдите по ссылке и создайте новый пароль

---

## 🔍 Проверка настроек

### Проверка через Django shell:

```bash
docker-compose exec backend python manage.py shell
```

```python
from django.core.mail import send_mail

send_mail(
    'Test Subject',
    'Test message',
    'from@example.com',
    ['to@example.com'],
    fail_silently=False,
)
```

**Для console backend:** Письмо появится в консоли
**Для SMTP:** Письмо придет на указанный email

---

## ⚠️ Важные замечания

### Безопасность:

1. **Никогда не коммитьте `.env` файл в git!**
   - Он уже в `.gitignore`
   - Храните пароли в секрете

2. **Для продакшена используйте переменные окружения:**
   ```bash
   export EMAIL_HOST_PASSWORD="your-password"
   ```

3. **Используйте App Passwords, а не основной пароль Gmail**

### Лимиты отправки:

- **Gmail:** ~500 писем/день для бесплатного аккаунта
- **Yandex:** ~500 писем/день
- **SendGrid:** 100 писем/день на бесплатном плане
- **Mailgun:** 5000 писем/месяц на бесплатном плане

### Если письма не приходят:

1. Проверьте папку "Спам"
2. Проверьте правильность EMAIL_HOST_USER и EMAIL_HOST_PASSWORD
3. Убедитесь что EMAIL_USE_TLS=True
4. Проверьте логи Django на ошибки
5. Для Gmail: убедитесь что "Less secure app access" включен или используете App Password

---

## 📝 Шаблон письма

Текущий шаблон письма находится в `backend/apps/users/views.py` в методе `PasswordResetRequestView.post()`.

Для кастомизации можно создать HTML шаблон:

1. Создайте `backend/apps/users/templates/email/password_reset.html`
2. Используйте Django template engine
3. Обновите код в views.py для использования шаблона

---

## ✅ Чеклист настройки

- [ ] Выбран email провайдер (Gmail/Yandex/SendGrid/etc)
- [ ] Созданы учетные данные (App Password для Gmail)
- [ ] Обновлен `backend/.env` с правильными настройками
- [ ] Запущены миграции базы данных
- [ ] Протестирована отправка email
- [ ] Проверена ссылка восстановления пароля
- [ ] Проверено создание нового пароля

---

## 🆘 Troubleshooting

### Ошибка: "SMTPAuthenticationError"
**Решение:** Проверьте EMAIL_HOST_USER и EMAIL_HOST_PASSWORD

### Ошибка: "Connection refused"
**Решение:** Проверьте EMAIL_HOST и EMAIL_PORT

### Письма не приходят, но ошибок нет
**Решение:** 
1. Проверьте спам
2. Проверьте DEFAULT_FROM_EMAIL - некоторые провайдеры требуют совпадения с EMAIL_HOST_USER

### Ошибка: "Token is invalid or expired"
**Решение:** Токены действительны 24 часа. Запросите новый сброс пароля.

---

## 📚 Дополнительные ресурсы

- [Django Email Documentation](https://docs.djangoproject.com/en/4.2/topics/email/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [Mailgun Documentation](https://documentation.mailgun.com/)

---

**Готово!** Теперь функция восстановления пароля полностью настроена и готова к использованию. 🎉
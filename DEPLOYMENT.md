# 🚀 Руководство по деплою SM Market

## Содержание
- [Подготовка к деплою](#подготовка-к-деплою)
- [Backend деплой](#backend-деплой)
- [Frontend деплой](#frontend-деплой)
- [Docker деплой](#docker-деплой)
- [Переменные окружения](#переменные-окружения)
- [Безопасность](#безопасность)
- [Мониторинг](#мониторинг)

## Подготовка к деплою

### Чеклист перед деплоем
- [ ] Все тесты проходят успешно
- [ ] Нет критических ошибок в логах
- [ ] Настроены переменные окружения
- [ ] Настроен HTTPS
- [ ] Настроен CORS
- [ ] Настроены статические файлы
- [ ] Настроена база данных
- [ ] Создан backup базы данных

## Backend деплой

### 1. Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка зависимостей
sudo apt install python3-pip python3-venv postgresql nginx -y
```

### 2. Настройка PostgreSQL

```bash
# Создание базы данных
sudo -u postgres psql
CREATE DATABASE sm_market_prod;
CREATE USER sm_market_user WITH PASSWORD 'your_secure_password';
ALTER ROLE sm_market_user SET client_encoding TO 'utf8';
ALTER ROLE sm_market_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE sm_market_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE sm_market_prod TO sm_market_user;
\q
```

### 3. Настройка Django

```bash
# Клонирование репозитория
git clone <your-repo-url>
cd sm-market/backend

# Создание виртуального окружения
python3 -m venv venv
source venv/bin/activate

# Установка зависимостей
pip install -r requirements.txt
pip install gunicorn psycopg2-binary

# Настройка переменных окружения
cp .env.example .env
nano .env  # Отредактируйте переменные
```

### 4. Production настройки Django

```python
# backend/config/settings.py

# Production settings
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com', 'www.your-domain.com']

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# Security
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# CORS
CORS_ALLOWED_ORIGINS = [
    'https://your-domain.com',
    'https://www.your-domain.com',
]
```

### 5. Применение миграций и сбор статики

```bash
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

### 6. Настройка Gunicorn

```bash
# Создание systemd service
sudo nano /etc/systemd/system/sm-market.service
```

```ini
[Unit]
Description=SM Market Django Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/sm-market/backend
Environment="PATH=/path/to/sm-market/backend/venv/bin"
ExecStart=/path/to/sm-market/backend/venv/bin/gunicorn \
    --workers 3 \
    --bind unix:/path/to/sm-market/backend/sm-market.sock \
    config.wsgi:application

[Install]
WantedBy=multi-user.target
```

```bash
# Запуск сервиса
sudo systemctl start sm-market
sudo systemctl enable sm-market
sudo systemctl status sm-market
```

### 7. Настройка Nginx

```bash
sudo nano /etc/nginx/sites-available/sm-market
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    client_max_body_size 10M;

    location /static/ {
        alias /path/to/sm-market/backend/staticfiles/;
    }

    location /media/ {
        alias /path/to/sm-market/backend/media/;
    }

    location / {
        proxy_pass http://unix:/path/to/sm-market/backend/sm-market.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Активация конфигурации
sudo ln -s /etc/nginx/sites-available/sm-market /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Настройка SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Frontend деплой

### 1. Build для production

```bash
cd frontend

# Установка зависимостей
npm ci

# Build
npm run build
```

### 2. Деплой на Vercel (рекомендуется)

```bash
# Установка Vercel CLI
npm i -g vercel

# Деплой
vercel --prod
```

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "env": {
    "VITE_API_URL": "https://api.your-domain.com"
  }
}
```

### 3. Деплой на Netlify

```bash
# Установка Netlify CLI
npm i -g netlify-cli

# Деплой
netlify deploy --prod
```

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_API_URL = "https://api.your-domain.com"
```

### 4. Деплой на собственном сервере

```nginx
# Nginx конфигурация для frontend
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    root /path/to/sm-market/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кеширование статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Docker деплой

### 1. Docker Compose для production

**docker-compose.prod.yml:**
```yaml
version: '3.8'

services:
  db:
    image: postgres:14-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    restart: always

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    environment:
      - DEBUG=False
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
    depends_on:
      - db
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - static_volume:/app/staticfiles
      - media_volume:/app/media
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - backend
    restart: always

volumes:
  postgres_data:
  static_volume:
  media_volume:
```

### 2. Запуск

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Переменные окружения

### Backend (.env)

```env
# Django
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com

# Database
DB_NAME=sm_market_prod
DB_USER=sm_market_user
DB_PASSWORD=your-secure-password
DB_HOST=localhost
DB_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# JWT
JWT_SECRET_KEY=your-jwt-secret-key

# Email (опционально)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### Frontend (.env.production)

```env
VITE_API_URL=https://api.your-domain.com
VITE_APP_NAME=SM Market
```

## Безопасность

### 1. Обязательные меры

- ✅ Использовать HTTPS
- ✅ Настроить CORS правильно
- ✅ Использовать сильные пароли
- ✅ Регулярно обновлять зависимости
- ✅ Настроить rate limiting
- ✅ Использовать environment variables
- ✅ Настроить firewall

### 2. Django Security Checklist

```bash
python manage.py check --deploy
```

### 3. Дополнительные меры

```python
# settings.py

# Security headers
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Rate limiting (django-ratelimit)
RATELIMIT_ENABLE = True
RATELIMIT_USE_CACHE = 'default'
```

## Мониторинг

### 1. Логирование

```python
# settings.py

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/sm-market/django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
```

### 2. Мониторинг производительности

- **Sentry** - для отслеживания ошибок
- **New Relic** - для мониторинга производительности
- **Prometheus + Grafana** - для метрик

### 3. Backup базы данных

```bash
# Создание backup
pg_dump -U sm_market_user sm_market_prod > backup_$(date +%Y%m%d).sql

# Восстановление
psql -U sm_market_user sm_market_prod < backup_20241229.sql

# Автоматический backup (cron)
0 2 * * * /path/to/backup-script.sh
```

## Обновление приложения

### Backend

```bash
cd /path/to/sm-market/backend
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart sm-market
```

### Frontend

```bash
cd /path/to/sm-market/frontend
git pull origin main
npm ci
npm run build
# Деплой на хостинг
```

## Troubleshooting

### Проблема: 502 Bad Gateway

```bash
# Проверка статуса Gunicorn
sudo systemctl status sm-market

# Проверка логов
sudo journalctl -u sm-market -n 50

# Проверка Nginx
sudo nginx -t
sudo systemctl status nginx
```

### Проблема: Static files не загружаются

```bash
# Пересобрать статику
python manage.py collectstatic --noinput

# Проверить права доступа
sudo chown -R www-data:www-data /path/to/staticfiles
```

### Проблема: CORS ошибки

```python
# Проверить настройки CORS в settings.py
CORS_ALLOWED_ORIGINS = [
    'https://your-domain.com',
]
CORS_ALLOW_CREDENTIALS = True
```

## Полезные команды

```bash
# Проверка статуса всех сервисов
sudo systemctl status sm-market nginx postgresql

# Просмотр логов
sudo journalctl -u sm-market -f
sudo tail -f /var/log/nginx/error.log

# Перезапуск сервисов
sudo systemctl restart sm-market
sudo systemctl restart nginx

# Проверка использования ресурсов
htop
df -h
free -m
```

---

**Важно**: Всегда тестируйте деплой на staging окружении перед production!
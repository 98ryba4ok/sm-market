import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY")
# в проде заменить os get env
DEBUG = os.getenv("DEBUG") == "1"

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "*").split(",")

CSRF_TRUSTED_ORIGINS = os.getenv(
    "CSRF_TRUSTED_ORIGINS",
    "https://sm-santex.ru,https://www.sm-santex.ru"
).split(",")

AUTHENTICATION_BACKENDS = [
    "apps.users.backends.EmailBackend",
]


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'django_filters',  
    'apps.catalog',
    'apps.users',
    'apps.orders',
    'rest_framework_simplejwt.token_blacklist',
]

from datetime import timedelta

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "AUTH_HEADER_TYPES": ("Bearer",),
}
CORS_ALLOW_ALL_ORIGINS = DEBUG  # В dev режиме разрешаем все

if not CORS_ALLOW_ALL_ORIGINS:
    CORS_ALLOWED_ORIGINS = os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "https://sm-santex.ru,https://www.sm-santex.ru",
    ).split(",")

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    "authorization",
    "content-type",
    "x-csrftoken",
    "x-requested-with",
]

# Session settings for guest cart
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SECURE = not DEBUG  # True в продакшене (HTTPS)
SESSION_SAVE_EVERY_REQUEST = True

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # CSRF disabled for API - use JWT for auth endpoints
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("POSTGRES_DB"),
        "USER": os.getenv("POSTGRES_USER"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD"),
        "HOST": os.getenv("POSTGRES_HOST"),
        "PORT": os.getenv("POSTGRES_PORT"),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]
AUTH_USER_MODEL = "users.User"

# Email settings
EMAIL_BACKEND = os.getenv('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER or 'noreply@sm-market.com')

# Frontend URL for password reset links
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')

# Internationalization
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# ЮКасса (Yookassa) payment integration
# Для активации:
# 1. Установить: pip install yookassa
# 2. Получить Shop ID и Secret Key на yookassa.ru
# 3. Заполнить переменные окружения
# 4. Включить YOOKASSA_ENABLED=true
YOOKASSA_SHOP_ID = os.getenv('YOOKASSA_SHOP_ID', None)
YOOKASSA_SECRET_KEY = os.getenv('YOOKASSA_SECRET_KEY', None)
YOOKASSA_ENABLED = os.getenv('YOOKASSA_ENABLED', 'false').lower() == 'true'
YOOKASSA_RETURN_URL = os.getenv('YOOKASSA_RETURN_URL', 'http://localhost:5173/payment/return')
# Код ставки НДС для чеков 54-ФЗ. 11 = НДС 22% (с 2026), 12 = НДС 22/122, 1 = без НДС.
YOOKASSA_VAT_CODE = int(os.getenv('YOOKASSA_VAT_CODE', '11'))

# Telegram-уведомления о заказах (новый заказ / оплата).
# TELEGRAM_BOT_TOKEN — токен бота от @BotFather; TELEGRAM_CHAT_ID — id чата/группы.
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', '')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID', '')
# Опциональный прокси, если до api.telegram.org нет прямого доступа (напр. socks5://user:pass@host:port)
TELEGRAM_PROXY = os.getenv('TELEGRAM_PROXY', '')

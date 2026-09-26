"""Изолированная локальная база. Запускать только на 127.0.0.1."""
from .settings import *  # noqa: F403

SECRET_KEY = 'local-development-only-not-for-production'
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'testserver']
DATABASES = {'default': {'ENGINE': 'django.db.backends.sqlite3', 'NAME': BASE_DIR / 'local.sqlite3', 'OPTIONS': {'timeout': 30}}}
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
SESSION_COOKIE_SECURE = False
CSRF_TRUSTED_ORIGINS = ['http://127.0.0.1:5173', 'http://localhost:5173']
TIME_ZONE = 'Europe/Moscow'
YOOKASSA_ENABLED = False
TELEGRAM_BOT_TOKEN = ''
TELEGRAM_CHAT_ID = ''
TELEGRAM_PROXY = ''

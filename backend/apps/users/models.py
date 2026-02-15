from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.conf import settings
import secrets
from datetime import timedelta

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, verbose_name="Email")
    phone = models.CharField(max_length=20, unique=True, verbose_name="Телефон")
    
    # ФИО пользователя
    first_name = models.CharField(max_length=150, blank=True, verbose_name="Имя")
    last_name = models.CharField(max_length=150, blank=True, verbose_name="Фамилия")
    middle_name = models.CharField(max_length=150, blank=True, verbose_name="Отчество")

    is_active = models.BooleanField(default=True, verbose_name="Активен")
    is_staff = models.BooleanField(default=False, verbose_name="Сотрудник")

    date_joined = models.DateTimeField(default=timezone.now, verbose_name="Дата регистрации")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["phone"]

    objects = UserManager()

    def __str__(self):
        return self.email
    
    def get_full_name(self):
        """Возвращает полное имя пользователя"""
        parts = [self.last_name, self.first_name, self.middle_name]
        return ' '.join(filter(None, parts)) or self.email


class PasswordResetToken(models.Model):
    """Токен для сброса пароля"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='password_reset_tokens',
        verbose_name="Пользователь"
    )
    token = models.CharField(max_length=100, unique=True, verbose_name="Токен")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создан")
    expires_at = models.DateTimeField(verbose_name="Истекает")
    is_used = models.BooleanField(default=False, verbose_name="Использован")
    
    class Meta:
        verbose_name = "Токен сброса пароля"
        verbose_name_plural = "Токены сброса пароля"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['token']),
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"Token for {self.user.email} - {'used' if self.is_used else 'active'}"
    
    @classmethod
    def generate_token(cls, user, expiry_hours=24):
        """Генерирует новый токен для пользователя"""
        token = secrets.token_urlsafe(32)
        expires_at = timezone.now() + timedelta(hours=expiry_hours)
        return cls.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )
    
    def is_valid(self):
        """Проверяет валидность токена"""
        return not self.is_used and timezone.now() < self.expires_at


class AccountCompromisedToken(models.Model):
    """Токен для восстановления доступа при взломе аккаунта"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='compromised_tokens',
        verbose_name="Пользователь"
    )
    token = models.CharField(max_length=100, unique=True, verbose_name="Токен")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создан")
    expires_at = models.DateTimeField(verbose_name="Истекает")
    is_used = models.BooleanField(default=False, verbose_name="Использован")
    
    # Дополнительная информация для логирования
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name="IP-адрес")
    
    class Meta:
        verbose_name = "Токен восстановления при взломе"
        verbose_name_plural = "Токены восстановления при взломе"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['token']),
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"Compromised token for {self.user.email} - {'used' if self.is_used else 'active'}"
    
    @classmethod
    def generate_token(cls, user, ip_address=None, expiry_hours=24):
        """Генерирует новый токен для восстановления доступа"""
        token = secrets.token_urlsafe(32)
        expires_at = timezone.now() + timedelta(hours=expiry_hours)
        return cls.objects.create(
            user=user,
            token=token,
            expires_at=expires_at,
            ip_address=ip_address
        )
    
    def is_valid(self):
        """Проверяет валидность токена"""
        return not self.is_used and timezone.now() < self.expires_at



class EmailChangeRequest(models.Model):
    """Запрос на смену email с двойным подтверждением и периодом отката"""
    
    STATUS_CHOICES = [
        ('pending_old', 'Ожидает подтверждения старого email'),
        ('pending_new', 'Ожидает подтверждения нового email'),
        ('completed', 'Завершено'),
        ('cancelled', 'Отменено'),
        ('expired', 'Истекло'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='email_change_requests',
        verbose_name="Пользователь"
    )
    old_email = models.EmailField(verbose_name="Старый email")
    new_email = models.EmailField(verbose_name="Новый email")
    
    # Статусы подтверждения
    old_email_confirmed = models.BooleanField(default=False, verbose_name="Старый email подтвержден")
    old_email_confirmed_at = models.DateTimeField(null=True, blank=True, verbose_name="Время подтверждения старого")
    new_email_confirmed = models.BooleanField(default=False, verbose_name="Новый email подтвержден")
    new_email_confirmed_at = models.DateTimeField(null=True, blank=True, verbose_name="Время подтверждения нового")
    
    # Временные метки
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создан")
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name="Завершен")
    can_cancel_until = models.DateTimeField(verbose_name="Можно отменить до")
    
    # Статус запроса
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending_old',
        verbose_name="Статус"
    )
    
    # Метаданные безопасности
    ip_address = models.GenericIPAddressField(verbose_name="IP-адрес")
    user_agent = models.TextField(blank=True, verbose_name="User Agent")
    
    # Токен для отмены
    cancel_token = models.CharField(max_length=100, unique=True, verbose_name="Токен отмены")
    
    class Meta:
        verbose_name = "Запрос на смену email"
        verbose_name_plural = "Запросы на смену email"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['status']),
            models.Index(fields=['cancel_token']),
        ]
    
    def __str__(self):
        return f"{self.user.email}: {self.old_email} -> {self.new_email} ({self.status})"
    
    @classmethod
    def create_request(cls, user, new_email, ip_address, user_agent=''):
        """Создает новый запрос на смену email"""
        cancel_token = secrets.token_urlsafe(32)
        can_cancel_until = timezone.now() + timedelta(hours=48)
        
        return cls.objects.create(
            user=user,
            old_email=user.email,
            new_email=new_email,
            ip_address=ip_address,
            user_agent=user_agent,
            cancel_token=cancel_token,
            can_cancel_until=can_cancel_until
        )
    
    def can_be_cancelled(self):
        """Проверяет, можно ли отменить смену"""
        return (
            self.status == 'completed' and
            timezone.now() < self.can_cancel_until
        )
    
    def confirm_old_email(self):
        """Подтверждает старый email"""
        self.old_email_confirmed = True
        self.old_email_confirmed_at = timezone.now()
        self.status = 'pending_new'
        self.save()
    
    def confirm_new_email(self):
        """Подтверждает новый email и завершает смену"""
        self.new_email_confirmed = True
        self.new_email_confirmed_at = timezone.now()
        self.status = 'completed'
        self.completed_at = timezone.now()
        self.save()
        
        # Меняем email пользователя
        self.user.email = self.new_email
        self.user.save()
    
    def cancel(self):
        """Отменяет смену email"""
        if not self.can_be_cancelled():
            raise ValueError("Невозможно отменить смену email")
        
        # Откатываем email
        self.user.email = self.old_email
        self.user.save()
        
        # Обновляем статус
        self.status = 'cancelled'
        self.save()


class EmailConfirmationToken(models.Model):
    """Токен для подтверждения email (старого или нового)"""
    
    EMAIL_TYPE_CHOICES = [
        ('old', 'Старый email'),
        ('new', 'Новый email'),
    ]
    
    email_change_request = models.ForeignKey(
        EmailChangeRequest,
        on_delete=models.CASCADE,
        related_name='confirmation_tokens',
        verbose_name="Запрос на смену"
    )
    token = models.CharField(max_length=100, unique=True, verbose_name="Токен")
    email_type = models.CharField(
        max_length=10,
        choices=EMAIL_TYPE_CHOICES,
        verbose_name="Тип email"
    )
    email = models.EmailField(verbose_name="Email")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создан")
    expires_at = models.DateTimeField(verbose_name="Истекает")
    is_used = models.BooleanField(default=False, verbose_name="Использован")
    used_at = models.DateTimeField(null=True, blank=True, verbose_name="Использован в")
    
    class Meta:
        verbose_name = "Токен подтверждения email"
        verbose_name_plural = "Токены подтверждения email"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['token']),
            models.Index(fields=['email_change_request', 'email_type']),
        ]
    
    def __str__(self):
        return f"Token for {self.email} ({self.email_type}) - {'used' if self.is_used else 'active'}"
    
    @classmethod
    def generate_token(cls, email_change_request, email_type, email, expiry_hours=24):
        """Генерирует новый токен подтверждения"""
        token = secrets.token_urlsafe(32)
        expires_at = timezone.now() + timedelta(hours=expiry_hours)
        
        return cls.objects.create(
            email_change_request=email_change_request,
            token=token,
            email_type=email_type,
            email=email,
            expires_at=expires_at
        )
    
    def is_valid(self):
        """Проверяет валидность токена"""
        return not self.is_used and timezone.now() < self.expires_at
    
    def mark_as_used(self):
        """Помечает токен как использованный"""
        self.is_used = True
        self.used_at = timezone.now()
        self.save()



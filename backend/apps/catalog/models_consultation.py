"""Модель для заявок на консультацию"""
from django.db import models
from django.core.validators import RegexValidator


class ConsultationRequest(models.Model):
    """Заявка на консультацию от клиента"""

    STATUS_CHOICES = [
        ('new', 'Новая'),
        ('in_progress', 'В обработке'),
        ('contacted', 'Связались'),
        ('completed', 'Завершена'),
        ('cancelled', 'Отменена'),
    ]

    name = models.CharField(
        max_length=200,
        verbose_name="Имя"
    )
    phone = models.CharField(
        max_length=20,
        validators=[
            RegexValidator(
                regex=r'^\+?[0-9]{10,15}$',
                message='Введите корректный номер телефона'
            )
        ],
        verbose_name="Телефон"
    )
    email = models.EmailField(
        blank=True,
        null=True,
        verbose_name="Email"
    )
    message = models.TextField(
        blank=True,
        verbose_name="Сообщение",
        help_text="Дополнительная информация от клиента"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='new',
        verbose_name="Статус"
    )

    # Техническая информация
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name="IP адрес"
    )
    user_agent = models.TextField(
        blank=True,
        verbose_name="User Agent"
    )

    # Заметки менеджера
    admin_notes = models.TextField(
        blank=True,
        verbose_name="Заметки менеджера",
        help_text="Служебные заметки для внутреннего использования"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата создания"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Дата обновления"
    )

    class Meta:
        verbose_name = "Заявка на консультацию"
        verbose_name_plural = "Заявки на консультацию"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['status']),
            models.Index(fields=['phone']),
        ]

    def __str__(self):
        return f"Заявка от {self.name} ({self.phone}) - {self.get_status_display()}"

from django.conf import settings
from django.db import models
from django.db.models import Q
from django.utils import timezone


class StockMovement(models.Model):
    class Kind(models.TextChoices):
        OPENING = 'opening', 'Начальный остаток'
        RECEIPT = 'receipt', 'Приход'
        EXPENSE = 'expense', 'Ручной расход'
        SALE = 'sale', 'Заказ сайта'
        RETURN = 'return', 'Отмена заказа'
        REVERSAL = 'reversal', 'Исправление'

    product = models.ForeignKey('catalog.Product', on_delete=models.PROTECT, related_name='stock_movements')
    kind = models.CharField(max_length=16, choices=Kind.choices)
    quantity = models.IntegerField(help_text='Изменение остатка в штуках со знаком')
    units_per_box = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    occurred_at = models.DateTimeField(default=timezone.now, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL)
    order = models.ForeignKey('orders.Order', null=True, blank=True, on_delete=models.PROTECT, related_name='stock_movements')
    reverses = models.OneToOneField('self', null=True, blank=True, on_delete=models.PROTECT, related_name='reversal')
    request_id = models.UUIDField(null=True, blank=True, unique=True)
    note = models.CharField(max_length=500, blank=True)

    class Meta:
        ordering = ['-occurred_at', '-id']
        constraints = [
            models.CheckConstraint(condition=~Q(quantity=0), name='stock_movement_nonzero'),
            models.CheckConstraint(condition=Q(units_per_box__gte=1), name='stock_box_positive'),
            models.CheckConstraint(condition=Q(unit_price__gte=0), name='stock_price_nonnegative'),
            models.UniqueConstraint(fields=['order', 'product', 'kind'], condition=Q(kind__in=['sale', 'return']), name='stock_order_once'),
        ]
        indexes = [models.Index(fields=['product', 'occurred_at'])]
        verbose_name = 'Движение товара'
        verbose_name_plural = 'Движения товаров'

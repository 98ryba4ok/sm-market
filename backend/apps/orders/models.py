from django.db import models
from django.core.validators import MinValueValidator
from django.conf import settings
from decimal import Decimal
import uuid


class Cart(models.Model):
    """Корзина покупок (для авторизованных и гостей)"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='carts',
        verbose_name="Пользователь"
    )
    session_key = models.CharField(
        max_length=40,
        null=True,
        blank=True,
        verbose_name="Ключ сессии"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Корзина"
        verbose_name_plural = "Корзины"
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['session_key']),
        ]

    def __str__(self):
        if self.user:
            return f"Корзина {self.user.email}"
        return f"Гостевая корзина {self.session_key}"

    @property
    def total_amount(self):
        """Общая сумма корзины"""
        return sum(item.subtotal for item in self.items.all())

    @property
    def total_items(self):
        """Общее количество товаров"""
        return sum(item.quantity for item in self.items.all())

    def clear(self):
        """Очистить корзину"""
        self.items.all().delete()


class CartItem(models.Model):
    """Элемент корзины"""
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name="Корзина"
    )
    product = models.ForeignKey(
        'catalog.Product',
        on_delete=models.CASCADE,
        verbose_name="Товар"
    )
    quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)],
        verbose_name="Количество"
    )
    added_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата добавления")

    class Meta:
        verbose_name = "Элемент корзины"
        verbose_name_plural = "Элементы корзины"
        unique_together = [['cart', 'product']]
        indexes = [
            models.Index(fields=['cart', 'product']),
        ]

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

    @property
    def subtotal(self):
        """Подытог для этого элемента"""
        if self.product is None:
            return Decimal('0')
        return self.product.final_price * self.quantity

    def clean(self):
        """Валидация перед сохранением"""
        from django.core.exceptions import ValidationError
        if self.quantity > self.product.stock_quantity:
            raise ValidationError(
                f"Недостаточно товара на складе. Доступно: {self.product.stock_quantity}"
            )


class Order(models.Model):
    """Заказ"""
    
    STATUS_CHOICES = [
        ('pending', 'Ожидает оплаты'),
        ('processing', 'В обработке'),
        ('shipped', 'Отправлен'),
        ('delivered', 'Доставлен'),
        ('cancelled', 'Отменен'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Ожидает оплаты'),
        ('paid', 'Оплачен'),
        ('failed', 'Ошибка оплаты'),
        ('refunded', 'Возвращен'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('sbp', 'СБП'),
        ('sber_pay', 'Сбер Pay'),
        ('sber_bank', 'Сбер банк'),
        ('installment', 'Рассрочка'),
        ('card', 'Банковская карта'),
        ('new_card', 'Новая карта'),
        ('cash', 'Наличные при получении'),
        ('installment_on_delivery', 'Рассрочка при получении'),
    ]
    
    DELIVERY_METHOD_CHOICES = [
        ('courier', 'Курьером'),
        ('pickup', 'Самовывоз'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders',
        verbose_name="Пользователь"
    )
    order_number = models.CharField(
        max_length=32,
        unique=True,
        editable=False,
        verbose_name="Номер заказа"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name="Статус"
    )
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name="Общая сумма"
    )
    
    # Способ и адрес доставки
    delivery_method = models.CharField(
        max_length=20,
        choices=DELIVERY_METHOD_CHOICES,
        default='courier',
        verbose_name="Способ получения"
    )
    delivery_address = models.TextField(verbose_name="Адрес доставки")
    delivery_city = models.CharField(max_length=100, verbose_name="Город")
    delivery_postal_code = models.CharField(max_length=20, verbose_name="Почтовый индекс")
    delivery_date = models.DateField(null=True, blank=True, verbose_name="Дата доставки")
    delivery_time = models.CharField(max_length=20, null=True, blank=True, verbose_name="Время доставки")
    
    # Контактная информация
    phone = models.CharField(max_length=20, verbose_name="Телефон")
    email = models.EmailField(verbose_name="Email")
    
    # Оплата
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='pending',
        verbose_name="Статус оплаты"
    )
    payment_method = models.CharField(
        max_length=30,
        choices=PAYMENT_METHOD_CHOICES,
        default='card',
        verbose_name="Способ оплаты"
    )
    payment_id = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        verbose_name="ID платежа"
    )
    
    # Промокоды и бонусы
    promo_code = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        verbose_name="Промокод"
    )
    promo_discount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0'),
        validators=[MinValueValidator(0)],
        verbose_name="Скидка от промокода"
    )
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['status']),
            models.Index(fields=['payment_status']),
        ]

    def __str__(self):
        return f"Заказ {self.order_number}"

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self.generate_order_number()

        # Auto-calculate total_amount from order items if not provided
        # This happens when creating orders manually in admin
        if self.total_amount is None or self.total_amount == 0:
            # If order already exists, calculate from existing items
            if self.pk:
                self.total_amount = sum(
                    item.subtotal for item in self.items.all()
                )
            # For new orders without items yet, set to 0 temporarily
            else:
                self.total_amount = Decimal('0')

        super().save(*args, **kwargs)

    @staticmethod
    def generate_order_number():
        """Генерация уникального номера заказа"""
        return f"ORD-{uuid.uuid4().hex[:12].upper()}"

    @property
    def can_be_cancelled(self):
        """Можно ли отменить заказ"""
        return self.status in ['pending', 'processing']

    def cancel(self):
        """Отменить заказ"""
        if self.can_be_cancelled:
            self.status = 'cancelled'
            # Вернуть товары на склад и уменьшить счетчик заказов
            for item in self.items.all():
                item.product.stock_quantity += item.quantity
                item.product.orders_count = max(0, item.product.orders_count - item.quantity)
                item.product.save(update_fields=['stock_quantity', 'orders_count'])
            self.save(update_fields=['status'])
            return True
        return False

    def mark_as_paid(self):
        """Отметить заказ как оплаченный"""
        self.payment_status = 'paid'
        if self.status == 'pending':
            self.status = 'processing'
        self.save(update_fields=['payment_status', 'status'])

    def recalculate_total(self):
        """Пересчитать общую сумму заказа из элементов"""
        self.total_amount = sum(item.subtotal for item in self.items.all())
        self.save(update_fields=['total_amount'])


class OrderItem(models.Model):
    """Элемент заказа"""
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name="Заказ"
    )
    product = models.ForeignKey(
        'catalog.Product',
        on_delete=models.PROTECT,
        verbose_name="Товар"
    )
    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        verbose_name="Количество"
    )
    price_at_purchase = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name="Цена на момент покупки"
    )
    product_name = models.CharField(
        max_length=200,
        verbose_name="Название товара"
    )

    class Meta:
        verbose_name = "Элемент заказа"
        verbose_name_plural = "Элементы заказа"
        indexes = [
            models.Index(fields=['order']),
        ]

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"

    @property
    def subtotal(self):
        """Подытог для этого элемента"""
        if self.price_at_purchase is None or self.quantity is None:
            return Decimal('0')
        return self.price_at_purchase * self.quantity

    def save(self, *args, **kwargs):
        # Проверяем, это новый элемент заказа или обновление существующего
        is_new = self.pk is None
        
        # Сохранить snapshot данных товара
        if not self.price_at_purchase:
            self.price_at_purchase = self.product.final_price
        if not self.product_name:
            self.product_name = self.product.name
        
        super().save(*args, **kwargs)

        # Увеличить счетчик заказов товара только для новых элементов
        if is_new and self.product:
            self.product.orders_count += self.quantity
            self.product.save(update_fields=['orders_count'])

        # Пересчитать общую сумму заказа после сохранения элемента
        if self.order_id:
            self.order.recalculate_total()

    def delete(self, *args, **kwargs):
        """Переопределяем удаление для пересчета суммы заказа"""
        order = self.order
        super().delete(*args, **kwargs)
        # Пересчитать общую сумму заказа после удаления элемента
        if order:
            order.recalculate_total()


class PromoCode(models.Model):
    """Промокод для скидки"""
    
    DISCOUNT_TYPE_CHOICES = [
        ('percent', 'Процент'),
        ('fixed', 'Фиксированная сумма'),
    ]
    
    code = models.CharField(
        max_length=50,
        unique=True,
        verbose_name="Код промокода"
    )
    discount_type = models.CharField(
        max_length=20,
        choices=DISCOUNT_TYPE_CHOICES,
        default='percent',
        verbose_name="Тип скидки"
    )
    discount_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name="Значение скидки"
    )
    min_order_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0'),
        validators=[MinValueValidator(0)],
        verbose_name="Минимальная сумма заказа"
    )
    max_discount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        verbose_name="Максимальная скидка"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Активен"
    )
    valid_from = models.DateTimeField(
        verbose_name="Действителен с"
    )
    valid_to = models.DateTimeField(
        verbose_name="Действителен до"
    )
    usage_limit = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name="Лимит использований"
    )
    used_count = models.PositiveIntegerField(
        default=0,
        verbose_name="Количество использований"
    )
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    
    class Meta:
        verbose_name = "Промокод"
        verbose_name_plural = "Промокоды"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['is_active', 'valid_from', 'valid_to']),
        ]
    
    def __str__(self):
        return f"{self.code} ({self.get_discount_type_display()})"
    
    def is_valid(self):
        """Проверяет валидность промокода"""
        from django.utils import timezone
        now = timezone.now()
        
        if not self.is_active:
            return False, "Промокод неактивен"
        
        if now < self.valid_from:
            return False, "Промокод еще не действителен"
        
        if now > self.valid_to:
            return False, "Промокод истек"
        
        if self.usage_limit and self.used_count >= self.usage_limit:
            return False, "Превышен лимит использований промокода"
        
        return True, None
    
    def calculate_discount(self, order_amount):
        """Вычисляет размер скидки для заказа"""
        if order_amount < self.min_order_amount:
            return Decimal('0')
        
        if self.discount_type == 'percent':
            discount = order_amount * (self.discount_value / 100)
            if self.max_discount:
                discount = min(discount, self.max_discount)
        else:
            discount = self.discount_value
        
        return min(discount, order_amount)

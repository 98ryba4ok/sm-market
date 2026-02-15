from django.contrib import admin
from django.utils.html import format_html
from .models import Cart, CartItem, Order, OrderItem, PromoCode


class CartItemInline(admin.TabularInline):
    """Inline для элементов корзины"""
    model = CartItem
    extra = 0
    fields = ['product', 'quantity', 'subtotal', 'added_at']
    readonly_fields = ['subtotal', 'added_at']
    
    def subtotal(self, obj):
        """Подытог для элемента"""
        return f'{obj.subtotal} ₽'
    subtotal.short_description = 'Подытог'


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    """Админка для корзин (для отладки)"""
    list_display = [
        'id', 'user', 'session_key', 'total_amount_display',
        'total_items', 'created_at', 'updated_at'
    ]
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username', 'session_key']
    readonly_fields = ['created_at', 'updated_at', 'total_amount', 'total_items']
    inlines = [CartItemInline]
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('user', 'session_key')
        }),
        ('Итоги', {
            'fields': ('total_amount', 'total_items')
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def total_amount_display(self, obj):
        """Отображение общей суммы"""
        return f'{obj.total_amount} ₽'
    total_amount_display.short_description = 'Общая сумма'
    
    def total_items(self, obj):
        """Количество товаров в корзине"""
        return obj.items.count()
    total_items.short_description = 'Товаров'


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    """Админка для элементов корзины"""
    list_display = ['cart', 'product', 'quantity', 'subtotal_display', 'added_at']
    list_filter = ['added_at']
    search_fields = ['cart__user__username', 'product__name']
    readonly_fields = ['added_at', 'subtotal']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('cart', 'product', 'quantity')
        }),
        ('Итоги', {
            'fields': ('subtotal',)
        }),
        ('Даты', {
            'fields': ('added_at',),
            'classes': ('collapse',)
        }),
    )
    
    def subtotal_display(self, obj):
        """Отображение подытога"""
        return f'{obj.subtotal} ₽'
    subtotal_display.short_description = 'Подытог'


class OrderItemInline(admin.TabularInline):
    """Inline для элементов заказа"""
    model = OrderItem
    extra = 0
    fields = ['product', 'product_name', 'quantity', 'price_at_purchase', 'subtotal']
    readonly_fields = ['product_name', 'price_at_purchase', 'subtotal']
    
    def subtotal(self, obj):
        """Подытог для элемента"""
        return f'{obj.subtotal} ₽'
    subtotal.short_description = 'Подытог'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Админка для заказов"""
    list_display = [
        'order_number', 'user', 'status_badge', 'payment_status_badge',
        'total_amount_display', 'payment_method', 'created_at'
    ]
    list_filter = ['status', 'payment_status', 'payment_method', 'delivery_method', 'created_at']
    search_fields = [
        'order_number', 'user__username', 'email',
        'phone', 'delivery_address', 'promo_code'
    ]
    readonly_fields = [
        'order_number', 'created_at', 'updated_at',
        'can_be_cancelled', 'total_amount', 'promo_discount'
    ]
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('order_number', 'user', 'status', 'can_be_cancelled')
        }),
        ('Контактная информация', {
            'fields': ('email', 'phone')
        }),
        ('Доставка', {
            'fields': (
                'delivery_method', 'delivery_address', 'delivery_city',
                'delivery_postal_code', 'delivery_date', 'delivery_time'
            )
        }),
        ('Оплата и скидки', {
            'fields': (
                'payment_method', 'payment_status', 'payment_id',
                'promo_code', 'promo_discount',
                'total_amount'
            )
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def status_badge(self, obj):
        """Цветной бейдж статуса заказа"""
        colors = {
            'pending': '#ffa500',      # Оранжевый
            'processing': '#2196f3',   # Синий
            'shipped': '#9c27b0',      # Фиолетовый
            'delivered': '#4caf50',    # Зеленый
            'cancelled': '#f44336',    # Красный
        }
        color = colors.get(obj.status, '#757575')
        return format_html(
            '<span style="background-color: {}; color: white; '
            'padding: 3px 10px; border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Статус'
    
    def payment_status_badge(self, obj):
        """Цветной бейдж статуса оплаты"""
        colors = {
            'pending': '#ffa500',      # Оранжевый
            'paid': '#4caf50',         # Зеленый
            'failed': '#f44336',       # Красный
            'refunded': '#9e9e9e',     # Серый
        }
        color = colors.get(obj.payment_status, '#757575')
        return format_html(
            '<span style="background-color: {}; color: white; '
            'padding: 3px 10px; border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            obj.get_payment_status_display()
        )
    payment_status_badge.short_description = 'Статус оплаты'
    
    def total_amount_display(self, obj):
        """Отображение общей суммы"""
        return f'{obj.total_amount} ₽'
    total_amount_display.short_description = 'Сумма'
    
    actions = [
        'mark_as_processing', 'mark_as_shipped',
        'mark_as_delivered', 'mark_as_cancelled',
        'mark_as_paid'
    ]
    
    def mark_as_processing(self, request, queryset):
        """Отметить заказы как "В обработке" """
        updated = queryset.update(status='processing')
        self.message_user(
            request,
            f'{updated} заказ(ов) отмечено как "В обработке"'
        )
    mark_as_processing.short_description = 'Отметить как "В обработке"'
    
    def mark_as_shipped(self, request, queryset):
        """Отметить заказы как "Отправлен" """
        updated = queryset.update(status='shipped')
        self.message_user(
            request,
            f'{updated} заказ(ов) отмечено как "Отправлен"'
        )
    mark_as_shipped.short_description = 'Отметить как "Отправлен"'
    
    def mark_as_delivered(self, request, queryset):
        """Отметить заказы как "Доставлен" """
        updated = queryset.update(status='delivered')
        self.message_user(
            request,
            f'{updated} заказ(ов) отмечено как "Доставлен"'
        )
    mark_as_delivered.short_description = 'Отметить как "Доставлен"'
    
    def mark_as_cancelled(self, request, queryset):
        """Отменить заказы"""
        count = 0
        for order in queryset:
            if order.can_be_cancelled:
                order.cancel()
                count += 1
        self.message_user(
            request,
            f'{count} заказ(ов) отменено (товары возвращены на склад)'
        )
    mark_as_cancelled.short_description = 'Отменить заказы'
    
    def mark_as_paid(self, request, queryset):
        """Отметить заказы как оплаченные"""
        updated = queryset.update(payment_status='paid')
        self.message_user(
            request,
            f'{updated} заказ(ов) отмечено как оплаченные'
        )
    mark_as_paid.short_description = 'Отметить как оплаченные'


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    """Админка для элементов заказа"""
    list_display = [
        'order', 'product', 'product_name',
        'quantity', 'price_at_purchase_display', 'subtotal_display'
    ]
    list_filter = ['order__status', 'order__created_at']
    search_fields = ['order__order_number', 'product__name', 'product_name']
    readonly_fields = ['price_at_purchase', 'product_name', 'subtotal']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('order', 'product', 'product_name', 'quantity')
        }),
        ('Цены', {
            'fields': ('price_at_purchase', 'subtotal')
        }),
    )
    
    def price_at_purchase_display(self, obj):
        """Отображение цены на момент покупки"""
        return f'{obj.price_at_purchase} ₽'
    price_at_purchase_display.short_description = 'Цена'
    
    def subtotal_display(self, obj):
        """Отображение подытога"""
        return f'{obj.subtotal} ₽'
    subtotal_display.short_description = 'Подытог'


@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    """Админка для промокодов"""
    list_display = [
        'code', 'discount_type', 'discount_value_display',
        'is_active_badge', 'used_count', 'usage_limit',
        'valid_from', 'valid_to'
    ]
    list_filter = ['is_active', 'discount_type', 'created_at']
    search_fields = ['code']
    readonly_fields = ['used_count', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('code', 'is_active')
        }),
        ('Скидка', {
            'fields': (
                'discount_type', 'discount_value',
                'min_order_amount', 'max_discount'
            )
        }),
        ('Период действия', {
            'fields': ('valid_from', 'valid_to')
        }),
        ('Использование', {
            'fields': ('usage_limit', 'used_count')
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def discount_value_display(self, obj):
        """Отображение скидки"""
        if obj.discount_type == 'percent':
            return f'{obj.discount_value}%'
        else:
            return f'{obj.discount_value} ₽'
    discount_value_display.short_description = 'Скидка'
    
    def is_active_badge(self, obj):
        """Цветной бейдж статуса активности"""
        color = '#4caf50' if obj.is_active else '#f44336'
        text = 'Активен' if obj.is_active else 'Неактивен'
        return format_html(
            '<span style="background-color: {}; color: white; '
            'padding: 3px 10px; border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            text
        )
    is_active_badge.short_description = 'Статус'
    
    actions = ['activate_promo', 'deactivate_promo']
    
    def activate_promo(self, request, queryset):
        """Активировать промокоды"""
        updated = queryset.update(is_active=True)
        self.message_user(
            request,
            f'{updated} промокод(ов) активировано'
        )
    activate_promo.short_description = 'Активировать'
    
    def deactivate_promo(self, request, queryset):
        """Деактивировать промокоды"""
        updated = queryset.update(is_active=False)
        self.message_user(
            request,
            f'{updated} промокод(ов) деактивировано'
        )
    deactivate_promo.short_description = 'Деактивировать'

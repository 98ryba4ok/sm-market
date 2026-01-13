from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from .models import Category, Product, ProductImage, ProductReview, Wishlist, Banner, Brand, ConsultationRequest


class ProductImageInline(admin.TabularInline):
    """Inline для изображений товара"""
    model = ProductImage
    extra = 1
    fields = ['image', 'image_preview', 'is_main', 'order', 'alt_text']
    readonly_fields = ['image_preview']
    
    def image_preview(self, obj):
        """Превью изображения"""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 100px; max-width: 150px;" />',
                obj.image.url
            )
        return '-'
    image_preview.short_description = 'Превью'


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Админка для категорий"""
    list_display = ['name', 'slug', 'parent', 'image_preview', 'is_active', 'created_at']
    list_filter = ['is_active', 'parent', 'created_at']
    search_fields = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at', 'image_preview']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'slug', 'parent', 'description')
        }),
        ('Изображение', {
            'fields': ('image', 'image_preview')
        }),
        ('Настройки', {
            'fields': ('is_active',)
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def image_preview(self, obj):
        """Превью изображения категории"""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 150px; max-width: 200px;" />',
                obj.image.url
            )
        return '-'
    image_preview.short_description = 'Превью изображения'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Админка для товаров"""
    list_display = [
        'name', 'slug', 'category', 'brand', 'price', 'discount_price',
        'final_price_display', 'stock_quantity', 'in_stock_display',
        'is_active', 'views_count', 'created_at'
    ]
    list_filter = ['is_active', 'category', 'brand', 'created_at']
    search_fields = ['name', 'slug', 'description', 'sku']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = [
        'created_at', 'updated_at', 'views_count',
        'final_price', 'discount_percentage', 'in_stock', 'country_of_origin'
    ]
    inlines = [ProductImageInline]

    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'slug', 'category', 'brand', 'description', 'sku')
        }),
        ('Цены', {
            'fields': ('price', 'discount_price', 'final_price', 'discount_percentage')
        }),
        ('Склад', {
            'fields': ('stock_quantity', 'in_stock')
        }),
        ('Характеристики товара', {
            'fields': ('specifications', 'warranty_months', 'country_of_origin'),
            'description': 'Технические характеристики и информация о товаре'
        }),
        ('Настройки', {
            'fields': ('is_active',)
        }),
        ('Статистика', {
            'fields': ('views_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def final_price_display(self, obj):
        """Отображение финальной цены"""
        return f'{obj.final_price} ₽'
    final_price_display.short_description = 'Финальная цена'

    def in_stock_display(self, obj):
        """Индикатор наличия на складе"""
        if obj.in_stock:
            return mark_safe('<span style="color: green;">✓ В наличии</span>')
        return mark_safe('<span style="color: red;">✗ Нет в наличии</span>')
    in_stock_display.short_description = 'Наличие'


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    """Админка для изображений товаров"""
    list_display = ['product', 'image_preview', 'is_main', 'order', 'alt_text']
    list_filter = ['is_main', 'product']
    search_fields = ['product__name', 'alt_text']
    readonly_fields = ['image_preview']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('product', 'image', 'image_preview')
        }),
        ('Настройки', {
            'fields': ('is_main', 'order', 'alt_text')
        }),
    )
    
    def image_preview(self, obj):
        """Превью изображения"""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 200px; max-width: 300px;" />',
                obj.image.url
            )
        return '-'
    image_preview.short_description = 'Превью'


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    """Админка для отзывов о товарах"""
    list_display = [
        'product', 'user', 'rating', 'rating_stars',
        'is_verified_purchase', 'created_at'
    ]
    list_filter = ['rating', 'is_verified_purchase', 'created_at']
    search_fields = ['product__name', 'user__username', 'comment']
    readonly_fields = ['created_at', 'updated_at', 'rating_stars']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('product', 'user', 'rating', 'rating_stars', 'comment')
        }),
        ('Настройки', {
            'fields': ('is_verified_purchase',)
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def rating_stars(self, obj):
        """Визуальное отображение рейтинга звездами"""
        stars = '★' * obj.rating + '☆' * (5 - obj.rating)
        return format_html(
            '<span style="color: #ffa500; font-size: 16px;">{}</span>',
            stars
        )
    rating_stars.short_description = 'Рейтинг'
    
    actions = ['mark_as_verified', 'mark_as_unverified']
    
    def mark_as_verified(self, request, queryset):
        """Отметить отзывы как подтвержденные покупки"""
        updated = queryset.update(is_verified_purchase=True)
        self.message_user(
            request,
            f'{updated} отзыв(ов) отмечено как подтвержденные покупки'
        )
    mark_as_verified.short_description = 'Отметить как подтвержденные покупки'
    
    def mark_as_unverified(self, request, queryset):
        """Снять отметку подтвержденной покупки"""
        updated = queryset.update(is_verified_purchase=False)
        self.message_user(
            request,
            f'У {updated} отзыв(ов) снята отметка подтвержденной покупки'
        )
    mark_as_unverified.short_description = 'Снять отметку подтвержденной покупки'


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    """Админка для списков желаний"""
    list_display = ['user', 'products_count', 'created_at']
    search_fields = ['user__username']
    readonly_fields = ['created_at', 'products_count']
    filter_horizontal = ['products']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('user', 'products_count')
        }),
        ('Товары', {
            'fields': ('products',)
        }),
        ('Даты', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def products_count(self, obj):
        """Количество товаров в списке желаний"""
        return obj.products.count()
    products_count.short_description = 'Количество товаров'


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    """Админка для брендов"""
    list_display = ['name', 'country_of_origin', 'order', 'is_active', 'created_at']
    list_filter = ['is_active', 'country_of_origin', 'created_at']
    search_fields = ['name', 'description', 'country_of_origin']
    readonly_fields = ['slug', 'created_at', 'updated_at']
    list_editable = ['order', 'is_active']

    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'slug', 'description', 'country_of_origin')
        }),
        ('Настройки', {
            'fields': ('order', 'is_active')
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    """Админка для баннеров главной страницы"""
    list_display = [
        'title', 'image_preview', 'order', 'is_active',
        'link', 'created_at'
    ]
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at', 'image_preview']
    list_editable = ['order', 'is_active']

    fieldsets = (
        ('Основная информация', {
            'fields': ('title', 'description', 'button_text')
        }),
        ('Изображение', {
            'fields': ('image', 'image_preview')
        }),
        ('Ссылка', {
            'fields': ('link',)
        }),
        ('Настройки', {
            'fields': ('order', 'is_active')
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def image_preview(self, obj):
        """Превью изображения баннера"""
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 150px; max-width: 300px;" />',
                obj.image.url
            )
        return '-'
    image_preview.short_description = 'Превью изображения'


@admin.register(ConsultationRequest)
class ConsultationRequestAdmin(admin.ModelAdmin):
    """Админка для заявок на консультацию"""
    list_display = [
        'id', 'name', 'phone', 'email', 'status', 
        'created_at', 'formatted_ip'
    ]
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'phone', 'email', 'message', 'ip_address']
    readonly_fields = [
        'id', 'created_at', 'updated_at', 
        'ip_address', 'user_agent', 'formatted_ip'
    ]
    list_editable = ['status']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Информация о клиенте', {
            'fields': ('name', 'phone', 'email', 'message')
        }),
        ('Статус', {
            'fields': ('status', 'admin_notes')
        }),
        ('Техническая информация', {
            'fields': ('ip_address', 'formatted_ip', 'user_agent', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def formatted_ip(self, obj):
        """Форматированный IP адрес с ссылкой на geolocation"""
        if obj.ip_address:
            return format_html(
                '<a href="https://www.ip-api.com/{}" target="_blank">{}</a>',
                obj.ip_address,
                obj.ip_address
            )
        return '-'
    formatted_ip.short_description = 'IP адрес (с геолокацией)'
    
    def get_queryset(self, request):
        """Оптимизация запросов"""
        qs = super().get_queryset(request)
        return qs.select_related()
    
    actions = ['mark_as_in_progress', 'mark_as_contacted', 'mark_as_completed']
    
    def mark_as_in_progress(self, request, queryset):
        """Отметить как 'В обработке'"""
        updated = queryset.update(status='in_progress')
        self.message_user(request, f'{updated} заявок отмечено как "В обработке"')
    mark_as_in_progress.short_description = 'Отметить как "В обработке"'
    
    def mark_as_contacted(self, request, queryset):
        """Отметить как 'Связались'"""
        updated = queryset.update(status='contacted')
        self.message_user(request, f'{updated} заявок отмечено как "Связались"')
    mark_as_contacted.short_description = 'Отметить как "Связались"'
    
    def mark_as_completed(self, request, queryset):
        """Отметить как 'Завершена'"""
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} заявок отмечено как "Завершена"')
    mark_as_completed.short_description = 'Отметить как "Завершена"'

from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings
import uuid


class Brand(models.Model):
    """Бренд товаров"""
    name = models.CharField(max_length=200, unique=True, verbose_name="Название")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="URL slug")
    description = models.TextField(blank=True, verbose_name="Описание")
    country_of_origin = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Страна бренда"
    )
    order = models.PositiveIntegerField(default=0, verbose_name="Порядок отображения")
    is_active = models.BooleanField(default=True, verbose_name="Активен")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Бренд"
        verbose_name_plural = "Бренды"
        ordering = ['order', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active', 'order']),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            # Транслитерация для русских названий
            base_slug = slugify(self.name)
            if not base_slug:
                # Используем транслитерацию
                translit_map = {
                    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
                    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
                    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
                    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
                    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
                }
                name_lower = self.name.lower()
                translit = ''.join(translit_map.get(c, c) for c in name_lower)
                base_slug = slugify(translit)

            if not base_slug:
                base_slug = f'brand-{uuid.uuid4().hex[:8]}'

            self.slug = base_slug
        super().save(*args, **kwargs)


class Room(models.Model):
    """Помещение (Ванная, Кухня и т.д.)"""
    name = models.CharField(max_length=200, verbose_name="Название")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="URL slug")
    description = models.TextField(blank=True, verbose_name="Описание")
    image = models.ImageField(
        upload_to='rooms/',
        null=True,
        blank=True,
        verbose_name="Изображение"
    )
    order = models.PositiveIntegerField(default=0, verbose_name="Порядок отображения")
    is_active = models.BooleanField(default=True, verbose_name="Активно")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    
    class Meta:
        verbose_name = "Помещение"
        verbose_name_plural = "Помещения"
        ordering = ['order', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active', 'order']),
        ]
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            # Транслитерация для русских названий
            base_slug = slugify(self.name)
            if not base_slug:
                translit_map = {
                    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
                    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
                    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
                    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
                    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
                }
                name_lower = self.name.lower()
                translit = ''.join(translit_map.get(c, c) for c in name_lower)
                base_slug = slugify(translit)
            
            if not base_slug:
                base_slug = f'room-{uuid.uuid4().hex[:8]}'
            
            self.slug = base_slug
        super().save(*args, **kwargs)


class Category(models.Model):
    """Категория оборудования"""
    name = models.CharField(max_length=200, verbose_name="Название")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="URL slug")
    description = models.TextField(blank=True, verbose_name="Описание")
    rooms = models.ManyToManyField(
        Room,
        related_name='categories',
        blank=True,
        verbose_name="Доступно для помещений",
        help_text="В каких помещениях используется эта категория"
    )
    image = models.ImageField(
        upload_to='categories/',
        null=True,
        blank=True,
        verbose_name="Изображение"
    )
    order = models.PositiveIntegerField(default=0, verbose_name="Порядок отображения")
    is_active = models.BooleanField(default=True, verbose_name="Активна")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
        ordering = ['name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            # Транслитерация для русских названий
            base_slug = slugify(self.name)  # Без allow_unicode - вернет пустую строку для кириллицы
            if not base_slug:  # Если slugify вернул пустую строку (для кириллицы)
                # Используем транслитерацию
                translit_map = {
                    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
                    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
                    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
                    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
                    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
                }
                name_lower = self.name.lower()
                translit = ''.join(translit_map.get(c, c) for c in name_lower)
                base_slug = slugify(translit)
            
            if not base_slug:  # Если все еще пустой, используем UUID
                base_slug = f'category-{uuid.uuid4().hex[:8]}'
            
            self.slug = base_slug
        super().save(*args, **kwargs)



class Product(models.Model):
    """Товар"""
    name = models.CharField(max_length=200, verbose_name="Название")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="URL slug")
    description = models.TextField(verbose_name="Описание")
    room = models.ForeignKey(
        Room,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products',
        verbose_name="Помещение"
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name="Категория оборудования"
    )
    brand = models.ForeignKey(
        Brand,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products',
        verbose_name="Бренд"
    )
    label = models.CharField(
        max_length=50,
        blank=True,
        choices=[
            ('new', 'Новинка'),
            ('hit', 'Хит продаж'),
            ('sale', 'Акция'),
            ('exclusive', 'Эксклюзив'),
        ],
        verbose_name="Лейбл"
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name="Цена"
    )
    discount_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        verbose_name="Цена со скидкой"
    )
    stock_quantity = models.PositiveIntegerField(
        default=0,
        verbose_name="Количество на складе"
    )
    sku = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Артикул (Код товара)"
    )
    specifications = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="Характеристики товара",
        help_text="JSON объект с характеристиками (например: {'Материал': 'Латунь', 'Механизм': 'Керамический картридж'})"
    )
    warranty_months = models.PositiveIntegerField(
        default=12,
        verbose_name="Гарантия (месяцев)"
    )
    is_active = models.BooleanField(default=True, verbose_name="Активен")
    views_count = models.PositiveIntegerField(
        default=0,
        verbose_name="Количество просмотров"
    )
    orders_count = models.PositiveIntegerField(
        default=0,
        verbose_name="Количество заказов",
        help_text="Счетчик заказов для сортировки по популярности"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['brand', 'is_active']),
            models.Index(fields=['price']),
            models.Index(fields=['-created_at']),
            models.Index(fields=['-orders_count']),  # Индекс для сортировки по популярности
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            # Транслитерация для русских названий
            base_slug = slugify(self.name)  # Без allow_unicode - вернет пустую строку для кириллицы
            if not base_slug:  # Если slugify вернул пустую строку (для кириллицы)
                # Используем транслитерацию
                translit_map = {
                    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
                    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
                    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
                    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
                    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
                }
                name_lower = self.name.lower()
                translit = ''.join(translit_map.get(c, c) for c in name_lower)
                base_slug = slugify(translit)
            
            if not base_slug:  # Если все еще пустой, используем UUID
                base_slug = f'product-{uuid.uuid4().hex[:8]}'
            
            self.slug = base_slug
        super().save(*args, **kwargs)

    @property
    def final_price(self):
        """Возвращает финальную цену (со скидкой если есть)"""
        return self.discount_price if self.discount_price else self.price

    @property
    def discount_percentage(self):
        """Возвращает процент скидки"""
        if self.discount_price and self.discount_price < self.price:
            return int(((self.price - self.discount_price) / self.price) * 100)
        return 0

    @property
    def in_stock(self):
        """Проверка наличия товара на складе"""
        return self.stock_quantity > 0

    @property
    def country_of_origin(self):
        """Получить страну бренда"""
        return self.brand.country_of_origin if self.brand else ""

    def increment_views(self):
        """Увеличить счетчик просмотров"""
        self.views_count += 1
        self.save(update_fields=['views_count'])


class ProductImage(models.Model):
    """Изображение товара (галерея)"""
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name="Товар"
    )
    image = models.ImageField(
        upload_to='products/',
        verbose_name="Изображение"
    )
    is_main = models.BooleanField(default=False, verbose_name="Главное изображение")
    order = models.PositiveIntegerField(default=0, verbose_name="Порядок")
    alt_text = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="Alt текст"
    )

    class Meta:
        verbose_name = "Изображение товара"
        verbose_name_plural = "Изображения товаров"
        ordering = ['order', 'id']
        indexes = [
            models.Index(fields=['product', 'is_main']),
            models.Index(fields=['order']),
        ]

    def __str__(self):
        return f"Изображение для {self.product.name}"

    def save(self, *args, **kwargs):
        # Если это главное изображение, убрать флаг у других
        if self.is_main:
            ProductImage.objects.filter(
                product=self.product,
                is_main=True
            ).exclude(pk=self.pk).update(is_main=False)
        super().save(*args, **kwargs)


class ProductReview(models.Model):
    """Отзыв на товар"""
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name="Товар"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name="Пользователь"
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Рейтинг"
    )
    comment = models.TextField(verbose_name="Комментарий")
    is_verified_purchase = models.BooleanField(
        default=False,
        verbose_name="Подтвержденная покупка"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Отзыв"
        verbose_name_plural = "Отзывы"
        ordering = ['-created_at']
        unique_together = [['product', 'user']]
        indexes = [
            models.Index(fields=['product', '-created_at']),
            models.Index(fields=['rating']),
        ]

    def __str__(self):
        return f"Отзыв от {self.user.email} на {self.product.name}"


class Wishlist(models.Model):
    """Избранное пользователя"""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='wishlist',
        verbose_name="Пользователь"
    )
    products = models.ManyToManyField(
        Product,
        related_name='wishlisted_by',
        verbose_name="Товары"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        verbose_name = "Избранное"
        verbose_name_plural = "Избранное"

    def __str__(self):
        return f"Избранное {self.user.email}"

    def add_product(self, product):
        """Добавить товар в избранное"""
        self.products.add(product)

    def remove_product(self, product):
        """Удалить товар из избранного"""
        self.products.remove(product)

    def is_in_wishlist(self, product):
        """Проверить, есть ли товар в избранном"""
        return self.products.filter(pk=product.pk).exists()


class Banner(models.Model):
    """Баннер для главной страницы (Hero Slider)"""
    title = models.CharField(max_length=200, verbose_name="Заголовок")
    description = models.TextField(verbose_name="Описание")
    image = models.ImageField(
        upload_to='hero/',
        verbose_name="Изображение"
    )
    link = models.URLField(
        blank=True,
        null=True,
        verbose_name="Ссылка"
    )
    button_text = models.CharField(
        max_length=100,
        blank=True,
        default="Подробнее",
        verbose_name="Текст кнопки"
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name="Порядок отображения"
    )
    is_active = models.BooleanField(default=True, verbose_name="Активен")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    class Meta:
        verbose_name = "Баннер"
        verbose_name_plural = "Баннеры"
        ordering = ['order', '-created_at']
        indexes = [
            models.Index(fields=['is_active', 'order']),
        ]

    def __str__(self):
        return self.title


# Импортируем модель заявок на консультацию
from .models_consultation import ConsultationRequest

__all__ = [
    'Room',
    'Brand',
    'Category',
    'Product',
    'ProductImage',
    'ProductReview',
    'Wishlist',
    'Banner',
    'ConsultationRequest',
]

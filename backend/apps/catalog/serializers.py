from rest_framework import serializers
from django.db.models import Avg
from .models import Category, Product, ProductImage, ProductReview, Wishlist, Banner, Brand, ConsultationRequest


class CategorySerializer(serializers.ModelSerializer):
    """Сериализатор категории с вложенными подкатегориями"""
    subcategories = serializers.SerializerMethodField()
    products_count = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'parent',
            'image', 'is_active', 'subcategories', 'products_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_image(self, obj):
        """Вернуть относительный URL изображения"""
        if obj.image:
            url = obj.image.url
            # Если URL начинается с http, извлекаем только путь
            if url.startswith('http://') or url.startswith('https://'):
                from urllib.parse import urlparse
                parsed = urlparse(url)
                return parsed.path
            return url
        return None
    
    def get_subcategories(self, obj):
        """Получить подкатегории (только первый уровень)"""
        if obj.subcategories.exists():
            return CategorySerializer(
                obj.subcategories.filter(is_active=True),
                many=True,
                context=self.context
            ).data
        return []
    
    def get_products_count(self, obj):
        """Количество активных товаров в категории"""
        return obj.products.filter(is_active=True).count()


class ProductImageSerializer(serializers.ModelSerializer):
    """Сериализатор изображения товара"""
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_main', 'order', 'alt_text']
        read_only_fields = ['id']

    def get_image(self, obj):
        """Вернуть только относительный URL без домена"""
        if obj.image:
            # Используем .url который возвращает полный путь, затем убираем схему и хост
            url = obj.image.url
            # Если URL начинается с http, извлекаем только путь
            if url.startswith('http://') or url.startswith('https://'):
                from urllib.parse import urlparse
                parsed = urlparse(url)
                return parsed.path
            return url
        return None


class BrandSerializer(serializers.ModelSerializer):
    """Сериализатор для брендов"""
    class Meta:
        model = Brand
        fields = [
            'id', 'name', 'slug', 'description', 'country_of_origin',
            'order', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProductReviewSerializer(serializers.ModelSerializer):
    """Сериализатор отзыва с информацией о пользователе"""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = ProductReview
        fields = [
            'id', 'product', 'user', 'user_id', 'user_email',
            'rating', 'comment', 'is_verified_purchase',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'is_verified_purchase']

    def validate_rating(self, value):
        """Валидация рейтинга"""
        if value < 1 or value > 5:
            raise serializers.ValidationError("Рейтинг должен быть от 1 до 5")
        return value


class ProductListSerializer(serializers.ModelSerializer):
    """Легковесный сериализатор для списка товаров"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    brand_id = serializers.IntegerField(source='brand.id', read_only=True, allow_null=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True, allow_null=True)
    main_image = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.IntegerField(source='reviews.count', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'category_name',
            'brand_id', 'brand_name', 'sku',
            'price', 'discount_price', 'final_price', 'discount_percentage',
            'stock_quantity', 'in_stock', 'main_image',
            'average_rating', 'reviews_count', 'views_count'
        ]
        read_only_fields = ['id', 'slug', 'views_count']
    
    def get_main_image(self, obj):
        """Получить главное изображение товара"""
        main_image = obj.images.filter(is_main=True).first()
        if main_image:
            url = main_image.image.url
            # Если URL начинается с http, извлекаем только путь
            if url.startswith('http://') or url.startswith('https://'):
                from urllib.parse import urlparse
                parsed = urlparse(url)
                return parsed.path
            return url
        return None
    
    def get_average_rating(self, obj):
        """Средний рейтинг товара"""
        avg = obj.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Полный сериализатор товара с изображениями и отзывами"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    brand = BrandSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.IntegerField(source='reviews.count', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description',
            'category', 'category_name', 'category_slug', 'brand',
            'price', 'discount_price', 'final_price', 'discount_percentage',
            'stock_quantity', 'in_stock', 'is_active',
            'sku', 'specifications', 'country_of_origin', 'warranty_months',
            'images', 'reviews', 'average_rating', 'reviews_count',
            'views_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'views_count', 'created_at', 'updated_at']

    def get_average_rating(self, obj):
        """Средний рейтинг товара"""
        avg = obj.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else None


class WishlistSerializer(serializers.ModelSerializer):
    """Сериализатор избранного"""
    products = ProductListSerializer(many=True, read_only=True)
    products_count = serializers.IntegerField(source='products.count', read_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'products', 'products_count', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class WishlistAddRemoveSerializer(serializers.Serializer):
    """Сериализатор для добавления/удаления товара из избранного"""
    product_id = serializers.IntegerField()

    def validate_product_id(self, value):
        """Проверка существования товара"""
        if not Product.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError("Товар не найден или неактивен")
        return value


class BannerSerializer(serializers.ModelSerializer):
    """Сериализатор баннера для главной страницы"""
    image = serializers.SerializerMethodField()

    class Meta:
        model = Banner
        fields = [
            'id', 'title', 'description', 'image', 'link',
            'button_text', 'order', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_image(self, obj):
        """Вернуть относительный URL изображения"""
        if obj.image:
            url = obj.image.url
            # Если URL начинается с http, извлекаем только путь
            if url.startswith('http://') or url.startswith('https://'):
                from urllib.parse import urlparse
                parsed = urlparse(url)
                return parsed.path
            return url
        return None

class ConsultationRequestSerializer(serializers.ModelSerializer):
    """Сериализатор для заявок на консультацию"""

    class Meta:
        model = ConsultationRequest
        fields = [
            'id', 'name', 'phone', 'email', 'message',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']

    def validate_phone(self, value):
        """Валидация номера телефона"""
        # Убираем все символы кроме цифр и +
        phone = ''.join(c for c in value if c.isdigit() or c == '+')

        if not phone:
            raise serializers.ValidationError("Введите корректный номер телефона")

        # Проверяем длину
        digits = phone.replace('+', '')
        if len(digits) < 10 or len(digits) > 15:
            raise serializers.ValidationError("Номер телефона должен содержать от 10 до 15 цифр")

        return phone

    def create(self, validated_data):
        """Создание заявки с дополнительной информацией"""
        request = self.context.get('request')

        # Добавляем IP адрес и User Agent
        if request:
            # Получаем IP адрес
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = request.META.get('REMOTE_ADDR')
            validated_data['ip_address'] = ip

            # Получаем User Agent
            validated_data['user_agent'] = request.META.get('HTTP_USER_AGENT', '')

        return super().create(validated_data)

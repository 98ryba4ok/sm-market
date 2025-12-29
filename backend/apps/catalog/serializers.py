from rest_framework import serializers
from django.db.models import Avg
from .models import Category, Product, ProductImage, ProductReview, Wishlist


class CategorySerializer(serializers.ModelSerializer):
    """Сериализатор категории с вложенными подкатегориями"""
    subcategories = serializers.SerializerMethodField()
    products_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'parent',
            'image', 'is_active', 'subcategories', 'products_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
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
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_main', 'order', 'alt_text']
        read_only_fields = ['id']


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
    main_image = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.IntegerField(source='reviews.count', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'category_name',
            'price', 'discount_price', 'final_price', 'discount_percentage',
            'stock_quantity', 'in_stock', 'main_image',
            'average_rating', 'reviews_count', 'views_count'
        ]
        read_only_fields = ['id', 'slug', 'views_count']
    
    def get_main_image(self, obj):
        """Получить главное изображение товара"""
        main_image = obj.images.filter(is_main=True).first()
        if main_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(main_image.image.url)
            return main_image.image.url
        return None
    
    def get_average_rating(self, obj):
        """Средний рейтинг товара"""
        avg = obj.reviews.aggregate(Avg('rating'))['rating__avg']
        return round(avg, 1) if avg else None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Полный сериализатор товара с изображениями и отзывами"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.IntegerField(source='reviews.count', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description',
            'category', 'category_name', 'category_slug',
            'price', 'discount_price', 'final_price', 'discount_percentage',
            'stock_quantity', 'in_stock', 'is_active',
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
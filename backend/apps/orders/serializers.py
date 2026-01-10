from rest_framework import serializers
from decimal import Decimal
from .models import Cart, CartItem, Order, OrderItem
from apps.catalog.models import Product
from apps.catalog.serializers import ProductListSerializer


class CartItemSerializer(serializers.ModelSerializer):
    """Сериализатор элемента корзины с деталями товара"""
    product_detail = ProductListSerializer(source='product', read_only=True)
    subtotal = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    
    class Meta:
        model = CartItem
        fields = [
            'id', 'cart', 'product', 'product_detail',
            'quantity', 'subtotal', 'added_at'
        ]
        read_only_fields = ['id', 'cart', 'added_at']
    
    def validate_quantity(self, value):
        """Валидация количества"""
        if value < 1:
            raise serializers.ValidationError("Количество должно быть больше 0")
        return value
    
    def validate(self, data):
        """Проверка наличия товара на складе"""
        product = data.get('product')
        quantity = data.get('quantity', 1)
        
        if product and quantity > product.stock_quantity:
            raise serializers.ValidationError({
                'quantity': f'Недостаточно товара на складе. Доступно: {product.stock_quantity}'
            })
        
        return data


class CartSerializer(serializers.ModelSerializer):
    """Сериализатор корзины с элементами и общей суммой"""
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    total_items = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Cart
        fields = [
            'id', 'user', 'session_key', 'items',
            'total_amount', 'total_items',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class AddToCartSerializer(serializers.Serializer):
    """Сериализатор для добавления товара в корзину"""
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(default=1, min_value=1)
    
    def validate_product_id(self, value):
        """Проверка существования и активности товара"""
        try:
            product = Product.objects.get(id=value, is_active=True)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Товар не найден или неактивен")
        return value
    
    def validate(self, data):
        """Проверка наличия товара на складе"""
        try:
            product = Product.objects.get(id=data['product_id'])
            if data['quantity'] > product.stock_quantity:
                raise serializers.ValidationError({
                    'quantity': f'Недостаточно товара на складе. Доступно: {product.stock_quantity}'
                })
        except Product.DoesNotExist:
            pass
        
        return data


class UpdateCartItemSerializer(serializers.Serializer):
    """Сериализатор для обновления количества товара в корзине"""
    quantity = serializers.IntegerField(min_value=1)
    
    def validate_quantity(self, value):
        """Проверка наличия товара на складе"""
        cart_item = self.instance
        if cart_item and value > cart_item.product.stock_quantity:
            raise serializers.ValidationError(
                f'Недостаточно товара на складе. Доступно: {cart_item.product.stock_quantity}'
            )
        return value
    
    def update(self, instance, validated_data):
        """Обновить количество товара в корзине"""
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.save()
        return instance


class OrderItemSerializer(serializers.ModelSerializer):
    """Сериализатор элемента заказа"""
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'order', 'product', 'product_name',
            'quantity', 'price_at_purchase', 'subtotal'
        ]
        read_only_fields = ['id', 'order', 'price_at_purchase', 'product_name']


class OrderSerializer(serializers.ModelSerializer):
    """Сериализатор заказа с элементами"""
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_status_display = serializers.CharField(
        source='get_payment_status_display',
        read_only=True
    )
    payment_method_display = serializers.CharField(
        source='get_payment_method_display',
        read_only=True
    )
    can_be_cancelled = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'order_number', 'status', 'status_display',
            'total_amount', 'delivery_address', 'delivery_city',
            'delivery_postal_code', 'phone', 'email',
            'payment_status', 'payment_status_display',
            'payment_method', 'payment_method_display',
            'payment_id', 'items', 'can_be_cancelled',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'order_number', 'payment_id',
            'created_at', 'updated_at'
        ]


class OrderCreateSerializer(serializers.Serializer):
    """Сериализатор для создания заказа"""
    delivery_address = serializers.CharField(max_length=500)
    delivery_city = serializers.CharField(max_length=100)
    delivery_postal_code = serializers.CharField(max_length=20)
    phone = serializers.CharField(max_length=20)
    email = serializers.EmailField()
    payment_method = serializers.ChoiceField(
        choices=Order.PAYMENT_METHOD_CHOICES,
        default='card'
    )
    
    def validate(self, data):
        """Проверка наличия товаров в корзине"""
        user = self.context['request'].user
        
        # Получить корзину пользователя
        try:
            if user.is_authenticated:
                cart = Cart.objects.get(user=user)
            else:
                session_key = self.context['request'].session.session_key
                if not session_key:
                    raise serializers.ValidationError("Корзина пуста")
                cart = Cart.objects.get(session_key=session_key)
        except Cart.DoesNotExist:
            raise serializers.ValidationError("Корзина пуста")
        
        if not cart.items.exists():
            raise serializers.ValidationError("Корзина пуста")
        
        # Проверить наличие всех товаров на складе
        for item in cart.items.all():
            if item.quantity > item.product.stock_quantity:
                raise serializers.ValidationError({
                    'cart': f'Товар "{item.product.name}" недоступен в нужном количестве. '
                           f'Доступно: {item.product.stock_quantity}'
                })
        
        data['cart'] = cart
        return data
    
    def create(self, validated_data):
        """Создание заказа из корзины"""
        cart = validated_data.pop('cart')
        user = self.context['request'].user
        
        # Создать заказ
        order = Order.objects.create(
            user=user if user.is_authenticated else None,
            total_amount=cart.total_amount,
            delivery_address=validated_data['delivery_address'],
            delivery_city=validated_data['delivery_city'],
            delivery_postal_code=validated_data['delivery_postal_code'],
            phone=validated_data['phone'],
            email=validated_data['email'],
            payment_method=validated_data['payment_method'],
            status='pending',
            payment_status='pending'
        )
        
        # Создать элементы заказа и уменьшить остатки
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price_at_purchase=cart_item.product.final_price,
                product_name=cart_item.product.name
            )
            
            # Уменьшить количество товара на складе
            cart_item.product.stock_quantity -= cart_item.quantity
            cart_item.product.save(update_fields=['stock_quantity'])
        
        # Очистить корзину
        cart.items.all().delete()
        
        return order
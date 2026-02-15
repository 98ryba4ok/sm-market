from rest_framework import serializers
from decimal import Decimal
from django.utils import timezone
from .models import Cart, CartItem, Order, OrderItem, PromoCode
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
    delivery_method_display = serializers.CharField(
        source='get_delivery_method_display',
        read_only=True
    )
    can_be_cancelled = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'order_number', 'status', 'status_display',
            'total_amount', 'delivery_method', 'delivery_method_display',
            'delivery_address', 'delivery_city', 'delivery_postal_code',
            'delivery_date', 'delivery_time', 'phone', 'email',
            'payment_status', 'payment_status_display',
            'payment_method', 'payment_method_display',
            'payment_id', 'promo_code', 'promo_discount',
            'items', 'can_be_cancelled',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'order_number', 'payment_id',
            'promo_discount',
            'created_at', 'updated_at'
        ]


class PromoCodeSerializer(serializers.ModelSerializer):
    """Сериализатор промокода"""
    
    class Meta:
        model = PromoCode
        fields = [
            'id', 'code', 'discount_type', 'discount_value',
            'min_order_amount', 'max_discount', 'is_active',
            'valid_from', 'valid_to', 'usage_limit', 'used_count'
        ]
        read_only_fields = ['id', 'used_count']


class PromoCodeValidationSerializer(serializers.Serializer):
    """Сериализатор для валидации промокода"""
    code = serializers.CharField(max_length=50)
    cart_total = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    def validate(self, data):
        """Валидация промокода"""
        code = data['code']
        cart_total = data['cart_total']
        
        try:
            promo = PromoCode.objects.get(code=code)
        except PromoCode.DoesNotExist:
            raise serializers.ValidationError({'code': 'Промокод не найден'})
        
        is_valid, error = promo.is_valid()
        if not is_valid:
            raise serializers.ValidationError({'code': error})
        
        if cart_total < promo.min_order_amount:
            raise serializers.ValidationError({
                'code': f'Минимальная сумма заказа для этого промокода: {promo.min_order_amount} ₽'
            })
        
        discount = promo.calculate_discount(cart_total)
        
        data['promo_code'] = promo
        data['discount_amount'] = discount
        return data


class OrderCreateSerializer(serializers.Serializer):
    """Сериализатор для создания заказа"""
    delivery_method = serializers.ChoiceField(
        choices=Order.DELIVERY_METHOD_CHOICES,
        default='courier'
    )
    delivery_address = serializers.CharField(max_length=500)
    delivery_city = serializers.CharField(max_length=100)
    delivery_postal_code = serializers.CharField(max_length=20)
    delivery_date = serializers.DateField(required=False, allow_null=True)
    delivery_time = serializers.CharField(max_length=20, required=False, allow_null=True, allow_blank=True)
    phone = serializers.CharField(max_length=20)
    email = serializers.EmailField()
    payment_method = serializers.ChoiceField(
        choices=Order.PAYMENT_METHOD_CHOICES,
        default='card'
    )
    promo_code = serializers.CharField(max_length=50, required=False, allow_null=True, allow_blank=True)
    selected_items = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        allow_empty=True
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
        
        # Получить товары для оформления
        selected_items = data.get('selected_items', [])
        if selected_items:
            cart_items = cart.items.filter(id__in=selected_items)
            if not cart_items.exists():
                raise serializers.ValidationError("Выбранные товары не найдены в корзине")
        else:
            cart_items = cart.items.all()
        
        if not cart_items.exists():
            raise serializers.ValidationError("Корзина пуста")
        
        # Проверить наличие всех товаров на складе
        for item in cart_items:
            if item.quantity > item.product.stock_quantity:
                raise serializers.ValidationError({
                    'cart': f'Товар "{item.product.name}" недоступен в нужном количестве. '
                           f'Доступно: {item.product.stock_quantity}'
                })
        
        # Валидация промокода
        promo_code_str = data.get('promo_code')
        promo_discount = Decimal('0')
        if promo_code_str:
            try:
                promo = PromoCode.objects.get(code=promo_code_str)
                is_valid, error = promo.is_valid()
                if not is_valid:
                    raise serializers.ValidationError({'promo_code': error})
                
                # Рассчитать сумму корзины
                cart_total = sum(item.subtotal for item in cart_items)
                
                if cart_total < promo.min_order_amount:
                    raise serializers.ValidationError({
                        'promo_code': f'Минимальная сумма заказа для этого промокода: {promo.min_order_amount} ₽'
                    })
                
                promo_discount = promo.calculate_discount(cart_total)
                data['promo_code_obj'] = promo
                data['promo_discount'] = promo_discount
            except PromoCode.DoesNotExist:
                raise serializers.ValidationError({'promo_code': 'Промокод не найден'})
        else:
            data['promo_discount'] = promo_discount
        
        data['cart'] = cart
        data['cart_items'] = cart_items
        return data
    
    def create(self, validated_data):
        """Создание заказа из корзины"""
        from django.db import transaction
        
        cart = validated_data.pop('cart')
        cart_items = validated_data.pop('cart_items')
        promo_code_obj = validated_data.pop('promo_code_obj', None)
        promo_discount = validated_data.pop('promo_discount')
        selected_items = validated_data.pop('selected_items', None)
        
        user = self.context['request'].user
        
        # Рассчитать итоговую сумму
        subtotal = sum(item.subtotal for item in cart_items)
        total_amount = subtotal - promo_discount
        total_amount = max(total_amount, Decimal('0'))
        
        with transaction.atomic():
            # Создать заказ
            order = Order.objects.create(
                user=user if user.is_authenticated else None,
                total_amount=total_amount,
                delivery_method=validated_data['delivery_method'],
                delivery_address=validated_data['delivery_address'],
                delivery_city=validated_data['delivery_city'],
                delivery_postal_code=validated_data['delivery_postal_code'],
                delivery_date=validated_data.get('delivery_date'),
                delivery_time=validated_data.get('delivery_time'),
                phone=validated_data['phone'],
                email=validated_data['email'],
                payment_method=validated_data['payment_method'],
                promo_code=validated_data.get('promo_code'),
                promo_discount=promo_discount,
                status='pending',
                payment_status='pending'
            )
            
            # Создать элементы заказа и уменьшить остатки
            for cart_item in cart_items:
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
            
            # Применить промокод
            if promo_code_obj:
                promo_code_obj.used_count += 1
                promo_code_obj.save(update_fields=['used_count'])
            
            # Удалить из корзины только оформленные товары
            cart_items.delete()
        
        return order
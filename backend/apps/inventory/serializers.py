from django.utils import timezone
from rest_framework import serializers
from apps.catalog.models import Product, Category
from .models import StockMovement


class StockProductSerializer(serializers.ModelSerializer):
    balance = serializers.IntegerField(read_only=True)
    boxes = serializers.SerializerMethodField()
    pieces = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    class Meta:
        model = Product
        fields = ['id', 'name', 'sku', 'category', 'category_name', 'units_per_box', 'price', 'stock_quantity', 'balance', 'boxes', 'pieces', 'is_active']
        read_only_fields = ['stock_quantity']
    def get_boxes(self, obj):
        return getattr(obj, 'balance', obj.stock_quantity) // obj.units_per_box
    def get_pieces(self, obj):
        return getattr(obj, 'balance', obj.stock_quantity) % obj.units_per_box


class NewProductSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    sku = serializers.CharField(max_length=100)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    units_per_box = serializers.IntegerField(min_value=1, max_value=1000000, default=1)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0)
    def validate_sku(self, value):
        if Product.objects.filter(sku__iexact=value).exists():
            raise serializers.ValidationError('Товар с таким артикулом уже существует.')
        return value


class MovementInputSerializer(serializers.Serializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    kind = serializers.ChoiceField(choices=['receipt', 'expense'])
    boxes = serializers.IntegerField(min_value=0, max_value=1000000, default=0)
    pieces = serializers.IntegerField(min_value=0, max_value=100000000, default=0)
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0)
    occurred_at = serializers.DateTimeField(required=True)
    note = serializers.CharField(max_length=500, allow_blank=True, default='')
    request_id = serializers.UUIDField(required=True)
    def validate(self, data):
        if data['boxes'] == 0 and data['pieces'] == 0:
            raise serializers.ValidationError('Укажите количество коробок или штук.')
        if data['boxes'] * data['product'].units_per_box + data['pieces'] > 2147483647:
            raise serializers.ValidationError('Слишком большое количество.')
        if data['occurred_at'] > timezone.now():
            raise serializers.ValidationError({'occurred_at': 'Дата не может быть в будущем.'})
        return data


class MovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name')
    sku = serializers.CharField(source='product.sku')
    kind_display = serializers.CharField(source='get_kind_display')
    actor_name = serializers.SerializerMethodField()
    order_number = serializers.CharField(source='order.order_number', default=None)
    total = serializers.SerializerMethodField()
    can_reverse = serializers.SerializerMethodField()
    class Meta:
        model = StockMovement
        fields = ['id', 'product', 'product_name', 'sku', 'kind', 'kind_display', 'quantity', 'units_per_box', 'unit_price', 'total', 'occurred_at', 'created_at', 'actor_name', 'order_number', 'note', 'reverses', 'can_reverse']
    def get_actor_name(self, obj):
        return obj.actor.get_full_name() if obj.actor else 'Система'
    def get_total(self, obj):
        return str(abs(obj.quantity) * obj.unit_price)
    def get_can_reverse(self, obj):
        return obj.kind in ['receipt', 'expense'] and not hasattr(obj, 'reversal')

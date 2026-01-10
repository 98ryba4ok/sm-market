from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import transaction
from .models import Cart, CartItem, Order
from .serializers import (
    CartSerializer,
    CartItemSerializer,
    AddToCartSerializer,
    UpdateCartItemSerializer,
    OrderSerializer,
    OrderCreateSerializer
)
from apps.catalog.models import Product


class CartViewSet(viewsets.ViewSet):
    """
    ViewSet для корзины
    
    retrieve: Получить корзину текущего пользователя
    add_item: Добавить товар в корзину
    update_item: Обновить количество товара
    remove_item: Удалить товар из корзины
    clear: Очистить корзину
    """
    
    def get_permissions(self):
        """Разрешить доступ к корзине для всех (включая гостей)"""
        return [AllowAny()]
    
    def _get_or_create_cart(self, request):
        """Получить или создать корзину для пользователя/гостя"""
        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user)
        else:
            # Для гостей используем session_key
            if not request.session.session_key:
                request.session.create()
            session_key = request.session.session_key
            cart, created = Cart.objects.get_or_create(session_key=session_key)
        
        return cart
    
    def list(self, request):
        """Получить корзину - GET /api/cart/"""
        cart = self._get_or_create_cart(request)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Добавить товар в корзину"""
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        product_id = serializer.validated_data['product_id']
        quantity = serializer.validated_data['quantity']
        
        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response(
                {'detail': 'Товар не найден'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        cart = self._get_or_create_cart(request)
        
        # Проверить, есть ли товар уже в корзине
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            # Товар уже в корзине, увеличить количество
            new_quantity = cart_item.quantity + quantity
            
            # Проверить наличие на складе
            if new_quantity > product.stock_quantity:
                return Response(
                    {
                        'detail': f'Недостаточно товара на складе. Доступно: {product.stock_quantity}',
                        'available': product.stock_quantity,
                        'current_in_cart': cart_item.quantity
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            cart_item.quantity = new_quantity
            cart_item.save()
        
        # Вернуть обновленную корзину
        cart_serializer = CartSerializer(cart)
        return Response(
            cart_serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['patch'], url_path='update-item/(?P<item_id>[^/.]+)')
    def update_item(self, request, item_id=None):
        """Обновить количество товара в корзине
        URL: /api/cart/update-item/{item_id}/
        """
        cart = self._get_or_create_cart(request)
        
        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
        except CartItem.DoesNotExist:
            return Response(
                {'detail': 'Товар не найден в корзине'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = UpdateCartItemSerializer(
            cart_item,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Вернуть обновленную корзину
        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data)
    
    @action(detail=False, methods=['delete'], url_path='remove-item/(?P<item_id>[^/.]+)')
    def remove_item(self, request, item_id=None):
        """Удалить товар из корзины
        URL: /api/cart/remove-item/{item_id}/
        """
        cart = self._get_or_create_cart(request)
        
        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
        except CartItem.DoesNotExist:
            return Response(
                {'detail': 'Товар не найден в корзине'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        cart_item.delete()
        
        # Вернуть обновленную корзину
        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data)
    
    @action(detail=False, methods=['post'])
    def clear(self, request):
        """Очистить корзину"""
        cart = self._get_or_create_cart(request)
        cart.items.all().delete()
        
        return Response(
            {'detail': 'Корзина очищена'},
            status=status.HTTP_200_OK
        )


class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet для заказов
    
    list: Получить список заказов пользователя
    create: Создать заказ из корзины
    retrieve: Получить детальную информацию о заказе
    cancel: Отменить заказ
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Получить заказы текущего пользователя"""
        return Order.objects.filter(
            user=self.request.user
        ).prefetch_related('items__product').order_by('-created_at')
    
    def get_serializer_class(self):
        """Выбрать сериализатор в зависимости от действия"""
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Создать заказ из корзины"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Создать заказ (логика в сериализаторе)
        order = serializer.save()
        
        # Вернуть созданный заказ
        order_serializer = OrderSerializer(order)
        return Response(
            order_serializer.data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Отменить заказ"""
        order = self.get_object()
        
        # Проверить, можно ли отменить заказ
        if not order.can_be_cancelled:
            return Response(
                {
                    'detail': 'Заказ нельзя отменить. '
                             'Отменить можно только заказы со статусом "В обработке" или "Ожидает оплаты"'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Отменить заказ и вернуть товары на склад
        order.cancel()
        
        # Вернуть обновленный заказ
        serializer = self.get_serializer(order)
        return Response({
            'detail': 'Заказ отменен',
            'order': serializer.data
        })
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def update_status(self, request, pk=None):
        """
        Обновить статус заказа (только для администраторов)
        
        Доступные статусы:
        - pending: Ожидает оплаты
        - processing: В обработке
        - shipped: Отправлен
        - delivered: Доставлен
        - cancelled: Отменен
        """
        # Проверить права администратора
        if not request.user.is_staff:
            return Response(
                {'detail': 'Недостаточно прав'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        order = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status:
            return Response(
                {'detail': 'Не указан новый статус'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Проверить валидность статуса
        valid_statuses = [choice[0] for choice in Order.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response(
                {
                    'detail': f'Неверный статус. Доступные: {", ".join(valid_statuses)}'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Обновить статус
        order.status = new_status
        order.save(update_fields=['status', 'updated_at'])
        
        # Вернуть обновленный заказ
        serializer = self.get_serializer(order)
        return Response({
            'detail': 'Статус заказа обновлен',
            'order': serializer.data
        })

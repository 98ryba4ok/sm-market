import json
import logging

from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from decimal import Decimal

from .models import Cart, CartItem, Order, PromoCode
from .serializers import (
    CartSerializer,
    CartItemSerializer,
    AddToCartSerializer,
    UpdateCartItemSerializer,
    OrderSerializer,
    OrderCreateSerializer,
    PromoCodeSerializer,
    PromoCodeValidationSerializer,
)
from apps.catalog.models import Product

logger = logging.getLogger(__name__)


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
    
    @action(detail=False, methods=['post'])
    def calculate_totals(self, request):
        """
        Рассчитать итоговую сумму заказа с учетом промокода
        
        Параметры:
        - promo_code: код промокода (опционально)
        - selected_items: список ID товаров для оформления (опционально)
        
        Возвращает:
        - subtotal: сумма без скидок
        - promo_discount: скидка от промокода
        - delivery_cost: стоимость доставки
        - total: итоговая сумма
        """
        cart = self._get_or_create_cart(request)
        
        promo_code_str = request.data.get('promo_code')
        selected_items = request.data.get('selected_items', [])
        
        # Получить товары
        if selected_items:
            cart_items = cart.items.filter(id__in=selected_items)
        else:
            cart_items = cart.items.all()
        
        if not cart_items.exists():
            return Response(
                {'detail': 'Корзина пуста'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Рассчитать промежуточную сумму
        subtotal = sum(item.subtotal for item in cart_items)
        
        # Применить промокод
        promo_discount = Decimal('0')
        promo_error = None
        if promo_code_str:
            try:
                promo = PromoCode.objects.get(code=promo_code_str)
                is_valid, error = promo.is_valid()
                
                if is_valid:
                    if subtotal >= promo.min_order_amount:
                        promo_discount = promo.calculate_discount(subtotal)
                    else:
                        promo_error = f'Минимальная сумма заказа: {promo.min_order_amount} ₽'
                else:
                    promo_error = error
            except PromoCode.DoesNotExist:
                promo_error = 'Промокод не найден'
        
        # Рассчитать итоговую сумму
        total = subtotal - promo_discount
        total = max(total, Decimal('0'))
        
        # Стоимость доставки
        delivery_cost = Decimal('0')
        
        return Response({
            'subtotal': str(subtotal),
            'promo_discount': str(promo_discount),
            'delivery_cost': str(delivery_cost),
            'total': str(total),
            'promo_error': promo_error
        })


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
    
    @action(detail=True, methods=['post'])
    def create_payment(self, request, pk=None):
        """POST /api/orders/{id}/create_payment/"""
        return self._do_create_payment(self.get_object())

    @action(detail=False, methods=['post'], url_path='create-payment-by-number')
    def create_payment_by_number(self, request):
        """POST /api/orders/create-payment-by-number/ — создать платёж по order_number"""
        order_number = request.data.get('order_number')
        if not order_number:
            return Response({'detail': 'Не указан order_number'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            order = Order.objects.get(order_number=order_number, user=request.user)
        except Order.DoesNotExist:
            return Response({'detail': 'Заказ не найден'}, status=status.HTTP_404_NOT_FOUND)
        return self._do_create_payment(order)

    def _do_create_payment(self, order):
        if order.payment_status == 'paid':
            return Response({'detail': 'Заказ уже оплачен'}, status=status.HTTP_400_BAD_REQUEST)

        from . import yookassa as yk
        from django.conf import settings

        payment_data = yk.create_payment(
            order_id=order.id,
            order_number=order.order_number,
            amount=order.total_amount,
            description=f'Оплата заказа {order.order_number} на sm-santex.ru',
            return_url=settings.YOOKASSA_RETURN_URL,
        )

        if payment_data.get('payment_id'):
            order.payment_id = payment_data['payment_id']
            order.save(update_fields=['payment_id'])

        return Response({
            'order_id': order.id,
            'payment_id': payment_data.get('payment_id'),
            'confirmation_url': payment_data.get('confirmation_url'),
            'message': payment_data.get('message', 'Платёж создан'),
        })

    @action(detail=True, methods=['get'])
    def check_payment(self, request, pk=None):
        """GET /api/orders/{id}/check_payment/ — проверить статус оплаты"""
        order = self.get_object()

        if order.payment_status == 'paid':
            return Response({'status': 'paid', 'paid': True, 'order_id': order.id})

        if not order.payment_id:
            return Response({'status': 'no_payment', 'paid': False, 'order_id': order.id})

        from . import yookassa as yk

        result = yk.check_payment_status(order.payment_id)

        if result.get('paid'):
            order.mark_as_paid()

        return Response({
            'status': result.get('status'),
            'paid': result.get('paid', False),
            'order_id': order.id,
        })


class PromoCodeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для промокодов
    
    list: Получить список активных промокодов (только для админов)
    retrieve: Получить информацию о промокоде
    validate: Проверить промокод и рассчитать скидку
    """
    queryset = PromoCode.objects.all()
    serializer_class = PromoCodeSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Обычные пользователи видят только активные промокоды"""
        if self.request.user.is_staff:
            return PromoCode.objects.all()
        return PromoCode.objects.filter(is_active=True)
    
    @action(detail=False, methods=['post'])
    def validate(self, request):
        """
        Проверить промокод и рассчитать скидку
        
        Параметры:
        - code: код промокода
        - cart_total: сумма корзины
        
        Возвращает:
        - is_valid: валиден ли промокод
        - discount_amount: размер скидки
        - error: сообщение об ошибке (если невалиден)
        """
        serializer = PromoCodeValidationSerializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            promo = serializer.validated_data['promo_code']
            discount = serializer.validated_data['discount_amount']
            
            return Response({
                'is_valid': True,
                'discount_amount': str(discount),
                'discount_type': promo.discount_type,
                'error': None
            })
        except serializers.ValidationError as e:
            error_message = str(e.detail.get('code', ['Неизвестная ошибка'])[0])
            return Response({
                'is_valid': False,
                'discount_amount': '0',
                'error': error_message
            }, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class YooKassaWebhookView(APIView):
    """
    POST /api/webhook/yookassa/
    Принимает уведомления от ЮКассы об изменении статуса платежа.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        try:
            data = json.loads(request.body)
        except (json.JSONDecodeError, ValueError):
            logger.warning('YooKassa webhook: bad JSON body')
            return Response({'detail': 'bad request'}, status=status.HTTP_400_BAD_REQUEST)

        from . import yookassa as yk

        result = yk.parse_webhook(data)
        logger.info('YooKassa webhook received: %s', result)

        if result.get('status') == 'error':
            return Response({'detail': 'parse error'}, status=status.HTTP_400_BAD_REQUEST)

        order_id = result.get('order_id')
        payment_id = result.get('payment_id')
        paid = result.get('paid', False)
        yookassa_status = result.get('status')

        if order_id:
            try:
                order = Order.objects.get(id=order_id)
            except Order.DoesNotExist:
                logger.warning('YooKassa webhook: order %s not found', order_id)
                return Response(status=status.HTTP_200_OK)

            if payment_id and not order.payment_id:
                order.payment_id = payment_id
                order.save(update_fields=['payment_id'])

            if paid and yookassa_status == 'succeeded' and order.payment_status != 'paid':
                order.mark_as_paid()
                logger.info('Order %s marked as paid via webhook', order.order_number)

            elif yookassa_status == 'canceled' and order.payment_status == 'pending':
                order.payment_status = 'failed'
                order.save(update_fields=['payment_status'])
                logger.info('Order %s payment marked as failed via webhook', order.order_number)

        return Response(status=status.HTTP_200_OK)

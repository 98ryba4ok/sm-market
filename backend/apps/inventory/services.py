from decimal import Decimal
from django.db import transaction
from django.db.models import F, Sum, Value
from django.db.models.functions import Greatest
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from apps.catalog.models import Product
from .models import StockMovement as Movement


@transaction.atomic
def move_stock(*, product_id, kind, quantity, unit_price=0, actor=None, occurred_at=None,
               note='', order=None, request_id=None, reverses=None):
    # Все операции, в том числе заказы, блокируют одну и ту же строку товара.
    product = Product.objects.select_for_update().get(pk=product_id)
    unit_price = Decimal(str(unit_price))
    occurred_at = occurred_at or timezone.now()
    if quantity == 0 or not unit_price.is_finite() or unit_price < 0:
        raise ValidationError('Количество должно быть ненулевым, цена — неотрицательной.')
    if occurred_at > timezone.now():
        raise ValidationError({'occurred_at': 'Нельзя провести операцию будущим временем.'})
    if kind in [Movement.Kind.RECEIPT, Movement.Kind.RETURN, Movement.Kind.OPENING] and quantity < 0:
        raise ValidationError('Приход должен увеличивать остаток.')
    if kind in [Movement.Kind.EXPENSE, Movement.Kind.SALE] and quantity > 0:
        raise ValidationError('Расход должен уменьшать остаток.')
    if request_id:
        previous = Movement.objects.filter(request_id=request_id).first()
        if previous:
            if (previous.product_id, previous.kind, previous.quantity, previous.unit_price, previous.note, previous.actor_id, previous.occurred_at) != (product_id, kind, quantity, unit_price, note, getattr(actor, 'pk', None), occurred_at):
                raise ValidationError('Этот запрос уже использован для другой операции. Обновите форму.')
            return previous
    if order:
        previous = Movement.objects.filter(order=order, product=product, kind=kind).first()
        if previous:
            return previous
    if reverses and Movement.objects.filter(reverses=reverses).exists():
        raise ValidationError('Эта операция уже исправлена.')

    movements = Movement.objects.filter(product=product)
    # Поддержка новых товаров, загруженных старым импортом с готовым остатком.
    if not movements.exists() and product.stock_quantity:
        Movement.objects.create(product=product, kind=Movement.Kind.OPENING,
            quantity=product.stock_quantity, units_per_box=product.units_per_box,
            occurred_at=product.created_at, note='Начальный остаток при подключении учёта')
    opening = movements.filter(kind=Movement.Kind.OPENING).order_by('occurred_at').first()
    if opening and occurred_at < opening.occurred_at:
        raise ValidationError('Дата операции раньше начала складского учёта этого товара.')
    if product.stock_quantity + quantity > 2147483647:
        raise ValidationError("Превышено максимально допустимое количество товара.")
    if product.stock_quantity + quantity < 0:
        raise ValidationError({'quantity': f'Недостаточно товара. Доступно {product.stock_quantity} шт.'})
    # При вводе задним числом проверяем весь последующий остаток, не только текущий.
    before = movements.filter(occurred_at__lte=occurred_at).aggregate(total=Sum('quantity'))['total'] or 0
    balance = before + quantity
    if balance < 0:
        raise ValidationError('На указанную дату не было нужного количества товара.')
    for delta in movements.filter(occurred_at__gt=occurred_at).order_by('occurred_at', 'id').values_list('quantity', flat=True):
        balance += delta
        if balance < 0:
            raise ValidationError('Операция создаст отрицательный остаток в истории товара.')
    if balance != product.stock_quantity + quantity:
        raise ValidationError("Остаток товара не совпадает с журналом. Требуется сверка складского учёта.")
    movement = Movement.objects.create(product=product, kind=kind, quantity=quantity,
        units_per_box=product.units_per_box, unit_price=unit_price, actor=actor,
        occurred_at=occurred_at, note=note, order=order, request_id=request_id, reverses=reverses)
    # Условный UPDATE дополнительно защищает от перерасхода; транзакция включает журнал.
    updated = Product.objects.filter(pk=product.pk, stock_quantity__gte=max(0, -quantity)).update(stock_quantity=F('stock_quantity') + quantity)
    if not updated:
        raise ValidationError('Остаток изменился. Обновите страницу и повторите операцию.')
    return movement


@transaction.atomic
def reverse_movement(movement_id, actor, note):
    original = Movement.objects.get(pk=movement_id)
    if original.kind not in [Movement.Kind.RECEIPT, Movement.Kind.EXPENSE]:
        raise ValidationError('Исправлять здесь можно только ручные операции. Заказы отменяются в разделе заказов.')
    if not note.strip():
        raise ValidationError('Укажите причину исправления.')
    return move_stock(product_id=original.product_id, kind=Movement.Kind.REVERSAL,
        quantity=-original.quantity, unit_price=original.unit_price, actor=actor,
        note=note, reverses=original)


@transaction.atomic
def cancel_order(order_id):
    from apps.orders.models import Order
    order = Order.objects.select_for_update().get(pk=order_id)
    if not order.can_be_cancelled:
        return False
    for item in order.items.select_related('product').order_by('product_id'):
        if item.product_id:
            move_stock(product_id=item.product_id, kind=Movement.Kind.RETURN,
                quantity=item.quantity, unit_price=item.price_at_purchase, order=order,
                actor=order.user, note=f'Отмена заказа {order.order_number}')
            Product.objects.filter(pk=item.product_id).update(orders_count=Greatest(F('orders_count') - item.quantity, Value(0)))
    order.status = 'cancelled'
    order.save(update_fields=['status', 'updated_at'])
    return True

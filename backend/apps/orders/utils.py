"""Утилиты для работы с заказами и корзинами"""
from django.db import transaction
from .models import Cart, CartItem


@transaction.atomic
def merge_guest_cart_with_user_cart(session_key, user):
    """
    Объединить гостевую корзину с корзиной авторизованного пользователя

    Args:
        session_key: Ключ сессии гостя
        user: Пользователь, который вошел в систему

    Returns:
        Cart: Объединенная корзина пользователя
    """
    if not session_key:
        # Если нет session_key, просто вернем корзину пользователя
        user_cart, _ = Cart.objects.get_or_create(user=user)
        return user_cart

    # Получаем гостевую корзину (берем первую, если их несколько)
    guest_cart = Cart.objects.filter(session_key=session_key, user__isnull=True).first()
    
    if not guest_cart:
        # Нет гостевой корзины - вернем корзину пользователя
        user_cart, _ = Cart.objects.get_or_create(user=user)
        return user_cart

    # Получаем или создаем корзину пользователя
    user_cart, _ = Cart.objects.get_or_create(user=user)

    # Переносим товары из гостевой корзины в пользовательскую
    merged_count = 0
    for guest_item in guest_cart.items.all():
        # Проверяем, есть ли такой товар уже в пользовательской корзине
        user_item = user_cart.items.filter(product=guest_item.product).first()

        if user_item:
            # Товар уже есть - увеличиваем количество
            new_quantity = user_item.quantity + guest_item.quantity

            # Проверяем наличие на складе
            if new_quantity <= guest_item.product.stock_quantity:
                user_item.quantity = new_quantity
                user_item.save()
                merged_count += 1
            else:
                # Устанавливаем максимально доступное количество
                user_item.quantity = guest_item.product.stock_quantity
                user_item.save()
                merged_count += 1
        else:
            # Товара нет - создаем новый элемент
            # Проверяем наличие на складе
            if guest_item.quantity <= guest_item.product.stock_quantity:
                CartItem.objects.create(
                    cart=user_cart,
                    product=guest_item.product,
                    quantity=guest_item.quantity
                )
                merged_count += 1
            else:
                # Создаем с максимально доступным количеством
                if guest_item.product.stock_quantity > 0:
                    CartItem.objects.create(
                        cart=user_cart,
                        product=guest_item.product,
                        quantity=guest_item.product.stock_quantity
                    )
                    merged_count += 1

    # Удаляем все гостевые корзины с этим session_key (на случай дубликатов)
    Cart.objects.filter(session_key=session_key, user__isnull=True).delete()

    return user_cart

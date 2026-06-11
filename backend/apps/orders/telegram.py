"""Telegram-уведомления о заказах.

Сбой отправки не должен влиять на обработку заказа/оплаты — все ошибки
логируются и подавляются. Конфигурация через settings:
TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID (берутся из .env).
"""
import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

_API_URL = "https://api.telegram.org/bot{token}/sendMessage"


def _send(text: str) -> None:
    token = getattr(settings, "TELEGRAM_BOT_TOKEN", "")
    chat_id = getattr(settings, "TELEGRAM_CHAT_ID", "")
    if not token or not chat_id:
        return
    try:
        requests.post(
            _API_URL.format(token=token),
            json={
                "chat_id": chat_id,
                "text": text,
                "disable_web_page_preview": True,
            },
            timeout=10,
        )
    except Exception:
        logger.exception("Не удалось отправить Telegram-уведомление")


def _items_lines(order) -> list:
    lines = []
    for item in order.items.all():
        name = item.product_name or "товар"
        lines.append(f"• {name} × {item.quantity} — {item.subtotal} ₽")
    return lines


def _delivery_str(order) -> str:
    if order.delivery_method == "pickup":
        return "Самовывоз"
    parts = [order.delivery_postal_code, order.delivery_city, order.delivery_address]
    return ", ".join(p for p in parts if p) or "—"


def notify_order_created(order) -> None:
    """Уведомление о новом оформленном заказе."""
    lines = [
        f"🆕 Новый заказ №{order.order_number}",
        f"Сумма: {order.total_amount} ₽",
        f"Оплата: {order.get_payment_status_display()} ({order.get_payment_method_display()})",
        "",
        "Товары:",
        *_items_lines(order),
        "",
        f"Покупатель: {order.email}",
        f"Телефон: {order.phone}",
        f"Доставка: {_delivery_str(order)}",
    ]
    _send("\n".join(lines))


def notify_order_paid(order) -> None:
    """Уведомление об успешно оплаченном заказе."""
    lines = [
        f"✅ Оплачен заказ №{order.order_number}",
        f"Сумма: {order.total_amount} ₽",
        "",
        "Товары:",
        *_items_lines(order),
        "",
        f"Покупатель: {order.email}",
        f"Телефон: {order.phone}",
        f"Доставка: {_delivery_str(order)}",
    ]
    _send("\n".join(lines))

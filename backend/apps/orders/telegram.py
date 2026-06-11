"""Telegram-уведомления о заказах.

Сбой отправки не должен влиять на обработку заказа/оплаты — все ошибки
логируются и подавляются. Конфигурация через settings:
- TELEGRAM_BOT_TOKEN — токен бота от @BotFather
- TELEGRAM_CHAT_ID — id чата/группы
- TELEGRAM_PROXY (опц.) — http(s)/socks5 прокси, если до Telegram нет прямого доступа

Отправка идёт в фоновом потоке с ретраями: egress к api.telegram.org с
российских серверов часто нестабилен (троттлинг), поэтому повторяем попытки.
"""
import logging
import socket
import threading
import time

import requests
import urllib3.util.connection as _urllib3_conn
from django.conf import settings

logger = logging.getLogger(__name__)

# У сервера нет IPv6-маршрута, а api.telegram.org отдаёт AAAA-запись —
# requests пытается идти по IPv6 и падает с "Network is unreachable".
# Форсируем IPv4 (на этом хосте весь исходящий трафик и так IPv4).
_urllib3_conn.allowed_gai_family = lambda: socket.AF_INET

_API_URL = "https://api.telegram.org/bot{token}/sendMessage"
_MAX_ATTEMPTS = 6
_RETRY_DELAY = 2  # секунд между попытками


def _deliver(text: str) -> None:
    token = getattr(settings, "TELEGRAM_BOT_TOKEN", "")
    chat_id = getattr(settings, "TELEGRAM_CHAT_ID", "")
    if not token or not chat_id:
        return

    proxy = getattr(settings, "TELEGRAM_PROXY", "")
    proxies = {"http": proxy, "https": proxy} if proxy else None
    payload = {"chat_id": chat_id, "text": text, "disable_web_page_preview": True}

    for attempt in range(1, _MAX_ATTEMPTS + 1):
        try:
            r = requests.post(
                _API_URL.format(token=token), json=payload, timeout=8, proxies=proxies
            )
            if r.ok:
                return
            # Ошибка уровня API (неверный chat_id и т.п.) — ретрай не поможет
            logger.warning("Telegram API %s: %s", r.status_code, r.text[:200])
            return
        except requests.RequestException as exc:
            if attempt == _MAX_ATTEMPTS:
                logger.warning(
                    "Telegram недоступен после %s попыток: %s", attempt, exc
                )
            else:
                time.sleep(_RETRY_DELAY)


def _send(text: str) -> None:
    """Неблокирующая отправка: фоновый поток, чтобы не задерживать ответ API."""
    threading.Thread(target=_deliver, args=(text,), daemon=True).start()


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

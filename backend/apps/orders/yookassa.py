import uuid
import logging
from decimal import Decimal
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)


def _get_settings():
    from django.conf import settings
    return settings


def _configure():
    settings = _get_settings()
    from yookassa import Configuration
    Configuration.account_id = settings.YOOKASSA_SHOP_ID
    Configuration.secret_key = settings.YOOKASSA_SECRET_KEY


def create_payment(
    order_id: int,
    order_number: str,
    amount: Decimal,
    description: str,
    return_url: str,
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    settings = _get_settings()

    if not settings.YOOKASSA_ENABLED:
        return {
            'payment_id': str(uuid.uuid4()),
            'confirmation_url': None,
            'status': 'pending',
            'paid': False,
            'message': 'Интеграция с ЮКасса отключена',
        }

    try:
        _configure()
        from yookassa import Payment

        idempotency_key = str(uuid.uuid4())
        payload = {
            'amount': {
                'value': str(amount.quantize(Decimal('0.01'))),
                'currency': 'RUB',
            },
            'confirmation': {
                'type': 'redirect',
                'return_url': f'{return_url}?order_id={order_id}',
            },
            'capture': True,
            'description': description,
            'metadata': {**(metadata or {}), 'order_id': order_id, 'order_number': order_number},
        }

        payment = Payment.create(payload, idempotency_key)

        return {
            'payment_id': payment.id,
            'confirmation_url': payment.confirmation.confirmation_url,
            'status': payment.status,
            'paid': payment.paid,
        }
    except Exception as exc:
        logger.exception('YooKassa create_payment error: %s', exc)
        return {
            'payment_id': None,
            'confirmation_url': None,
            'status': 'error',
            'paid': False,
            'message': str(exc),
        }


def check_payment_status(payment_id: str) -> Dict[str, Any]:
    settings = _get_settings()

    if not settings.YOOKASSA_ENABLED:
        return {'status': 'pending', 'paid': False, 'amount': None}

    try:
        _configure()
        from yookassa import Payment

        payment = Payment.find_one(payment_id)
        return {
            'status': payment.status,
            'paid': payment.paid,
            'amount': str(payment.amount.value) if payment.amount else None,
        }
    except Exception as exc:
        logger.exception('YooKassa check_payment_status error: %s', exc)
        return {'status': 'error', 'paid': False, 'amount': None, 'message': str(exc)}


def parse_webhook(data: Dict[str, Any]) -> Dict[str, Any]:
    """Parse incoming YooKassa webhook notification."""
    settings = _get_settings()

    if not settings.YOOKASSA_ENABLED:
        return {'payment_id': None, 'status': 'pending', 'paid': False, 'order_id': None}

    try:
        _configure()
        from yookassa.domain.notification import WebhookNotification

        notification = WebhookNotification(data)
        payment = notification.object

        order_id = None
        if payment.metadata:
            order_id = payment.metadata.get('order_id')

        return {
            'payment_id': payment.id,
            'status': payment.status,
            'paid': payment.paid,
            'order_id': order_id,
        }
    except Exception as exc:
        logger.exception('YooKassa parse_webhook error: %s', exc)
        return {'payment_id': None, 'status': 'error', 'paid': False, 'order_id': None, 'message': str(exc)}

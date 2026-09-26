from datetime import timedelta
from decimal import Decimal
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone
from apps.users.models import User
from apps.catalog.models import Product, Category, Room
from apps.inventory.services import move_stock


class Command(BaseCommand):
    help = 'Создаёт демонстрационные данные только в изолированной локальной SQLite-базе.'
    @transaction.atomic
    def handle(self, *args, **options):
        if not settings.DEBUG or settings.DATABASES['default']['ENGINE'] != 'django.db.backends.sqlite3':
            raise CommandError('Команда разрешена только с config.settings_local.')
        if User.objects.filter(email='warehouse@local.test').exists():
            self.stdout.write('Демонстрационная база уже подготовлена; существующие данные сохранены.')
            return
        user = User.objects.create_user(email='warehouse@local.test', phone='+79990000001',
            password='Warehouse-demo-2026!', first_name='Сотрудник', last_name='Демо', is_staff=True)
        room, _ = Room.objects.get_or_create(slug='vannaya-komnata', defaults={'name': 'Ванная комната'})
        samples = [
            ('Смеситель для раковины хром', 'DEMO-SM-001', 'Смесители', 6, '4200', '2600', 42, 5),
            ('Душевая лейка круглая', 'DEMO-DS-002', 'Душевые системы', 12, '1250', '740', 60, 17),
            ('Сифон для раковины', 'DEMO-SF-003', 'Комплектующие', 20, '690', '350', 80, 12),
            ('Зеркало круглое 60 см', 'DEMO-ZR-004', 'Зеркала', 4, '6500', '4100', 12, 2),
            ('Кран шаровой 1/2', 'DEMO-KR-005', 'Комплектующие', 10, '450', '220', 30, 30),
            ('Полотенцедержатель', 'DEMO-PL-006', 'Аксессуары', 8, '1800', '1050', 24, 3),
        ]
        for name, sku, category_name, pack, price, cost, received, spent in samples:
            category, _ = Category.objects.get_or_create(name=category_name)
            category.rooms.add(room)
            product = Product.objects.create(name=name, sku=sku, category=category, room=room,
                price=Decimal(price), units_per_box=pack, description='Демонстрационный товар для локальной проверки складского учёта.')
            move_stock(product_id=product.pk, kind='receipt', quantity=received, unit_price=cost,
                actor=user, occurred_at=timezone.now()-timedelta(days=3), note='Демонстрационная поставка')
            move_stock(product_id=product.pk, kind='expense', quantity=-spent, unit_price=price,
                actor=user, occurred_at=timezone.now()-timedelta(days=1), note='Демонстрационная выдача')
        self.stdout.write('Демо-склад создан: 6 товаров. Вход: warehouse@local.test / Warehouse-demo-2026!')

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.files import File
from decimal import Decimal
import random
import shutil
from pathlib import Path
from apps.catalog.models import Category, Product, ProductImage, ProductReview, Brand, Banner
from apps.orders.models import Order, OrderItem

User = get_user_model()


class Command(BaseCommand):
    help = 'Создает тестовые данные для интернет-магазина'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Очистить существующие данные перед созданием новых',
        )

    def get_photo_path(self, filename):
        """Получить путь к фото из локальной папки photo рядом со скриптом"""
        # Папка photo находится рядом с этим файлом
        script_dir = Path(__file__).parent
        photo_dir = script_dir / 'photo'
        photo_path = photo_dir / filename

        if photo_path.exists():
            return photo_path
        return None
    
    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Очистка существующих данных...')
            OrderItem.objects.all().delete()
            Order.objects.all().delete()
            ProductReview.objects.all().delete()
            ProductImage.objects.all().delete()
            Product.objects.all().delete()
            Banner.objects.all().delete()
            Brand.objects.all().delete()
            Category.objects.all().delete()
            # Удаляем тестовых пользователей (кроме суперпользователей)
            User.objects.filter(is_superuser=False, is_staff=False).delete()
            self.stdout.write(self.style.SUCCESS('✓ Данные очищены'))
        
        # Создать тестовых пользователей
        self.stdout.write('Создание тестовых пользователей...')
        test_users = []
        users_data = [
            {'email': 'ivan@example.com', 'phone': '+79991234567'},
            {'email': 'maria@example.com', 'phone': '+79991234568'},
            {'email': 'alex@example.com', 'phone': '+79991234569'},
            {'email': 'elena@example.com', 'phone': '+79991234570'},
            {'email': 'dmitry@example.com', 'phone': '+79991234571'},
        ]
        
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                email=user_data['email'],
                defaults={
                    'phone': user_data['phone'],
                }
            )
            if created:
                user.set_password('testpass123')
                user.save()
                self.stdout.write(f'  ✓ Создан пользователь: {user.email}')
            test_users.append(user)
        
        # Создать категории
        self.stdout.write('Создание категорий...')
        categories_data = [
            {'name': 'Сантехника', 'description': 'Сантехническое оборудование для дома', 'image': 'santehnika.png'},
            {'name': 'Кухни', 'description': 'Кухонное оборудование и мебель', 'image': 'kuhni.png'},
            {'name': 'Унитазы', 'description': 'Унитазы и комплектующие', 'image': 'unitazy.png'},
            {'name': 'Плитка', 'description': 'Плитка для ванной и кухни', 'image': 'plitka.png'},
            {'name': 'Ванны', 'description': 'Ванны и душевые кабины', 'image': 'vanny.png'},
            {'name': 'Мебель для ванны', 'description': 'Мебель и аксессуары для ванной комнаты', 'image': 'mebel.png'},
        ]

        categories = []
        for cat_data in categories_data:
            category = Category.objects.create(
                name=cat_data['name'],
                description=cat_data['description'],
                is_active=True
            )

            # Добавляем изображение, если оно существует
            photo_path = self.get_photo_path(cat_data['image'])
            if photo_path:
                with open(photo_path, 'rb') as f:
                    category.image.save(cat_data['image'], File(f), save=True)
                self.stdout.write(f'  ✓ Создана категория: {category.name} (с изображением)')
            else:
                self.stdout.write(f'  ✓ Создана категория: {category.name} (без изображения)')

            categories.append(category)

        # Создать бренды
        self.stdout.write('\nСоздание брендов...')
        brands_data = [
            {'name': 'GESSI', 'description': 'Итальянский производитель премиум сантехники', 'order': 1, 'logo': 'gessi.png'},
            {'name': 'cielo', 'description': 'Дизайнерская керамика и сантехника', 'order': 2, 'logo': 'cielo.png'},
            {'name': 'Jorger', 'description': 'Эксклюзивная сантехника класса люкс', 'order': 3, 'logo': 'jorger.png'},
            {'name': 'KRONOS ceramiche', 'description': 'Итальянская керамическая плитка', 'order': 4, 'logo': 'kronos.png'},
            {'name': 'DevoN&DevoN', 'description': 'Мебель для ванных комнат', 'order': 5, 'logo': 'devon.png'},
        ]

        brands = []
        for brand_data in brands_data:
            brand = Brand.objects.create(
                name=brand_data['name'],
                description=brand_data['description'],
                order=brand_data['order'],
                is_active=True
            )

            # Добавляем логотип, если он существует
            photo_path = self.get_photo_path(brand_data['logo'])
            if photo_path:
                with open(photo_path, 'rb') as f:
                    brand.logo.save(brand_data['logo'], File(f), save=True)
                self.stdout.write(f'  ✓ Создан бренд: {brand.name} (с логотипом)')
            else:
                self.stdout.write(f'  ✓ Создан бренд: {brand.name} (без логотипа)')

            brands.append(brand)

        # Создать баннеры
        self.stdout.write('\nСоздание баннеров...')
        banners_data = [
            {
                'title': 'Новая коллекция смесителей GESSI Perle',
                'description': 'Откройте мир роскошных смесителей. Ваш официальный дистрибьютор GESSI',
                'button_text': 'Смотреть коллекцию',
                'link': '/catalog/santehnika',
                'order': 1,
                'image': 'banner1.png'
            },
            {
                'title': 'Эксклюзивная итальянская плитка',
                'description': 'KRONOS ceramiche - керамика мирового класса для вашего интерьера',
                'button_text': 'Каталог плитки',
                'link': '/catalog/plitka',
                'order': 2,
                'image': 'banner2.png'
            },
        ]

        for banner_data in banners_data:
            banner = Banner.objects.create(
                title=banner_data['title'],
                description=banner_data['description'],
                button_text=banner_data['button_text'],
                link=banner_data['link'],
                order=banner_data['order'],
                is_active=True
            )

            # Добавляем изображение, если оно существует
            photo_path = self.get_photo_path(banner_data['image'])
            if photo_path:
                with open(photo_path, 'rb') as f:
                    banner.image.save(banner_data['image'], File(f), save=True)
                self.stdout.write(f'  ✓ Создан баннер: {banner.title} (с изображением)')
            else:
                self.stdout.write(f'  ✓ Создан баннер: {banner.title} (без изображения)')

        # Создать товары (1 товар в 5 дубликатах)
        self.stdout.write('\nСоздание товаров...')

        description = '''Кухонный смеситель Omoikiri Shinagawa-C - это воплощение японского минимализма и функциональности.

Особенности:
• Высококачественная латунь с хромированным покрытием
• Керамический картридж 35 мм для плавной регулировки
• Поворот излива на 360°
• Аэратор для экономии воды
• Простая установка и обслуживание
• Гарантия 5 лет

Технические характеристики:
- Высота: 295 мм
- Вылет излива: 220 мм
- Присоединительный размер: 1/2"
- Рабочее давление: 0.5-6 бар'''

        products = []
        gessi_brand = brands[0]  # GESSI
        santehnika_category = categories[0]  # Сантехника

        for i in range(5):
            # Добавляем уникальный суффикс к названию для каждого дубликата, кроме первого
            product_name = 'Кухонный смеситель Omoikiri Shinagawa-C'
            if i > 0:
                product_name = f'{product_name} #{i+1}'

            product = Product.objects.create(
                name=product_name,
                description=description,
                category=santehnika_category,
                brand=gessi_brand,
                price=Decimal('33000'),
                discount_price=Decimal('29990'),
                stock_quantity=10,
                is_active=True
            )
            products.append(product)
            self.stdout.write(f'  ✓ Создан товар: {product.name} ({product.final_price} ₽)')
        
        # Создать изображения товаров
        self.stdout.write('\nСоздание изображений товаров...')

        product_image_filename = 'product.png'
        photo_path = self.get_photo_path(product_image_filename)

        if photo_path:
            images_created = 0
            for product in products:
                with open(photo_path, 'rb') as f:
                    product_image = ProductImage.objects.create(
                        product=product,
                        alt_text=product.name,
                        is_main=True
                    )
                    product_image.image.save(f'{product.slug}.png', File(f), save=True)
                    images_created += 1

            self.stdout.write(self.style.SUCCESS(f'✓ Создано изображений: {images_created}'))
        else:
            self.stdout.write(self.style.WARNING(f'⚠ Файл {product_image_filename} не найден в папке photo, изображения не созданы'))
        
        # Создать отзывы
        self.stdout.write('\nСоздание отзывов...')
        review_comments = [
            'Отличный товар! Полностью соответствует описанию.',
            'Очень доволен покупкой. Рекомендую!',
            'Хорошее качество за свою цену.',
            'Быстрая доставка, товар в отличном состоянии.',
            'Превзошел все ожидания!',
            'Неплохо, но есть небольшие недостатки.',
            'Отличное соотношение цены и качества.',
            'Пользуюсь уже месяц - никаких нареканий.',
            'Качество на высоте!',
            'Буду заказывать еще.',
            'Товар пришел быстро, упаковка отличная.',
            'Соответствует описанию, все работает.',
            'Рекомендую к покупке!',
            'За эти деньги - отличный вариант.',
            'Пользуюсь каждый день, очень удобно.',
        ]
        
        reviews_created = 0
        # Создаем отзывы от разных пользователей на разные товары
        for product in products:
            # Каждый товар получает от 0 до 3 отзывов
            num_reviews = random.randint(0, 3)
            # Выбираем случайных пользователей для отзывов
            reviewers = random.sample(test_users, min(num_reviews, len(test_users)))
            
            for user in reviewers:
                ProductReview.objects.create(
                    product=product,
                    user=user,
                    rating=random.randint(3, 5),
                    comment=random.choice(review_comments),
                    is_verified_purchase=random.choice([True, True, False])  # 66% verified
                )
                reviews_created += 1
        
        self.stdout.write(self.style.SUCCESS(f'✓ Создано отзывов: {reviews_created}'))
        
        # Создать тестовые заказы
        self.stdout.write('\nСоздание тестовых заказов...')
        orders_created = 0
        
        cities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань']
        
        for user in test_users[:3]:  # Создаем заказы для первых 3 пользователей
            # Каждый пользователь делает 1-2 заказа
            num_orders = random.randint(1, 2)
            
            for _ in range(num_orders):
                # Выбираем 1-4 случайных товара для заказа
                order_products = random.sample(products, random.randint(1, 4))
                
                # Рассчитываем общую сумму заказа
                total = Decimal('0')
                for product in order_products:
                    quantity = random.randint(1, 3)
                    total += product.final_price * quantity
                
                # Создаем заказ
                city = random.choice(cities)
                order = Order.objects.create(
                    user=user,
                    status=random.choice(['pending', 'processing', 'shipped', 'delivered']),
                    payment_method=random.choice(['card', 'cash']),
                    payment_status=random.choice(['pending', 'paid']),
                    total_amount=total,
                    delivery_address=f'ул. Тестовая, д. {random.randint(1, 100)}, кв. {random.randint(1, 200)}',
                    delivery_city=city,
                    delivery_postal_code=f'{random.randint(100000, 999999)}',
                    phone=user.phone,
                    email=user.email,
                )
                
                # Добавляем товары в заказ
                for product in order_products:
                    quantity = random.randint(1, 3)
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=quantity,
                        price_at_purchase=product.final_price,
                        product_name=product.name
                    )
                
                orders_created += 1
        
        self.stdout.write(self.style.SUCCESS(f'✓ Создано заказов: {orders_created}'))
        
        # Итоговая статистика
        self.stdout.write('\n' + '='*70)
        self.stdout.write(self.style.SUCCESS('✓ Тестовые данные успешно созданы!'))
        self.stdout.write('='*70)
        self.stdout.write(f'Пользователей: {len(test_users)}')
        self.stdout.write(f'Категорий: {Category.objects.count()}')
        self.stdout.write(f'Брендов: {Brand.objects.count()}')
        self.stdout.write(f'Баннеров: {Banner.objects.count()}')
        self.stdout.write(f'Товаров: {Product.objects.count()}')
        self.stdout.write(f'Изображений: {ProductImage.objects.count()}')
        self.stdout.write(f'Отзывов: {ProductReview.objects.count()}')
        self.stdout.write(f'Заказов: {Order.objects.count()}')
        self.stdout.write(f'Позиций в заказах: {OrderItem.objects.count()}')

        self.stdout.write('\n' + '='*70)
        self.stdout.write(self.style.SUCCESS('Созданные категории:'))
        self.stdout.write('='*70)
        for cat in Category.objects.all():
            self.stdout.write(f'  • {cat.name} ({cat.slug})')

        self.stdout.write('\n' + '='*70)
        self.stdout.write(self.style.SUCCESS('Созданные бренды:'))
        self.stdout.write('='*70)
        for brand in Brand.objects.all():
            self.stdout.write(f'  • {brand.name}')

        self.stdout.write('\n' + '='*70)
        self.stdout.write(self.style.SUCCESS('Созданные баннеры:'))
        self.stdout.write('='*70)
        for banner in Banner.objects.all():
            self.stdout.write(f'  • {banner.title}')

        self.stdout.write('\n' + '='*70)
        self.stdout.write(self.style.SUCCESS('Тестовые пользователи (пароль для всех: testpass123):'))
        self.stdout.write('='*70)
        for user in test_users:
            self.stdout.write(f'  📧 {user.email}')

        self.stdout.write('\n' + '='*70)
        self.stdout.write('ℹ️  Изображения загружаются из папки:')
        self.stdout.write('  backend/apps/catalog/management/commands/photo/')
        self.stdout.write('')
        self.stdout.write('Необходимые файлы:')
        self.stdout.write('  • Категории: santehnika.png, kuhni.png, unitazy.png, plitka.png, vanny.png, mebel.png')
        self.stdout.write('  • Бренды: gessi.png, cielo.png, jorger.png, kronos.png, devon.png')
        self.stdout.write('  • Баннеры: banner1.png, banner2.png')
        self.stdout.write('  • Товар: product.png')
        self.stdout.write('='*70)

        self.stdout.write('\n' + '='*70)
        self.stdout.write('Для доступа к админ-панели создайте суперпользователя:')
        self.stdout.write('  python manage.py createsuperuser')
        self.stdout.write('\nИли используйте Docker:')
        self.stdout.write('  docker-compose exec backend python manage.py createsuperuser')
        self.stdout.write('='*70)
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.files import File
from decimal import Decimal
import random
import shutil
from pathlib import Path
from apps.catalog.models import Room, Category, Product, ProductImage, ProductReview, Brand, Banner
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
            Room.objects.all().delete()
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
        
        # Создать помещения
        self.stdout.write('Создание помещений...')
        rooms_data = [
            {'name': 'Ванная комната', 'description': 'Оборудование и мебель для ванной комнаты', 'order': 1, 'image': 'bathroom.png'},
            {'name': 'Кухня', 'description': 'Кухонное оборудование и аксессуары', 'order': 2, 'image': 'kitchen.png'},
            {'name': 'Гостиная', 'description': 'Мебель и декор для гостиной', 'order': 3, 'image': 'living.png'},
            {'name': 'Спальня', 'description': 'Мебель и аксессуары для спальни', 'order': 4, 'image': 'bedroom.png'},
            {'name': 'Прихожая', 'description': 'Мебель и аксессуары для прихожей', 'order': 5, 'image': 'hallway.png'},
            {'name': 'Кабинет', 'description': 'Мебель и оборудование для домашнего офиса', 'order': 6, 'image': 'office.png'},
        ]

        rooms = []
        for room_data in rooms_data:
            room = Room.objects.create(
                name=room_data['name'],
                description=room_data['description'],
                order=room_data['order'],
                is_active=True
            )

            # Добавляем изображение, если оно существует
            photo_path = self.get_photo_path(room_data['image'])
            if photo_path:
                with open(photo_path, 'rb') as f:
                    room.image.save(room_data['image'], File(f), save=True)
                self.stdout.write(f'  ✓ Создано помещение: {room.name} (с изображением)')
            else:
                self.stdout.write(f'  ✓ Создано помещение: {room.name} (без изображения)')

            rooms.append(room)

        # Создать категории
        self.stdout.write('\nСоздание категорий...')
        categories_data = [
            {'name': 'Смесители и комплектующие', 'description': 'Смесители для ванной и кухни, запорная арматура и комплектующие', 'rooms': [0, 1], 'image': 'smesiteli.png'},
            {'name': 'Лейки и шланги для душа', 'description': 'Ручные лейки, шланги и аксессуары для душа', 'rooms': [0], 'image': 'leiki.png'},
            {'name': 'Стойки для душа', 'description': 'Душевые стойки, штанги и системы', 'rooms': [0], 'image': 'stoyki.png'},
            {'name': 'Радиаторы и комплектующие', 'description': 'Радиаторы отопления, термостаты и монтажные комплекты', 'rooms': [0, 2, 3], 'image': 'radiatory.png'},
            {'name': 'Сифоны и комплектующие', 'description': 'Сифоны для раковин, ванн и поддонов', 'rooms': [0, 1], 'image': 'sifony.png'},
            {'name': 'Унитазы и комплектующие', 'description': 'Унитазы, инсталляции, арматура и кнопки смыва', 'rooms': [0], 'image': 'unitazy.png'},
            {'name': 'Водосчетчики', 'description': 'Счетчики холодной и горячей воды', 'rooms': [0, 1], 'image': 'vodoschotchiki.png'},
            {'name': 'Водонагреватель', 'description': 'Накопительные и проточные водонагреватели', 'rooms': [0, 1], 'image': 'vodonagrevateli.png'},
            {'name': 'Инструменты', 'description': 'Профессиональный инструмент для монтажа сантехники', 'rooms': [0, 1, 2, 3, 4, 5], 'image': 'instrumenty.png'},
            {'name': 'Коллектора и комплектующие', 'description': 'Распределительные коллекторы и фитинги', 'rooms': [0, 1], 'image': 'kollektory.png'},
            {'name': 'Котельное оборудование', 'description': 'Котлы, горелки и элементы котельных систем', 'rooms': [0, 1], 'image': 'kotelnoe.png'},
            {'name': 'Краны', 'description': 'Шаровые краны, вентили и запорная арматура', 'rooms': [0, 1], 'image': 'krany.png'},
            {'name': 'Оборудование для контроля и защиты', 'description': 'Системы защиты от протечек, датчики и автоматика', 'rooms': [0, 1], 'image': 'oborudovanie.png'},
        ]

        categories = []
        for cat_data in categories_data:
            category = Category.objects.create(
                name=cat_data['name'],
                description=cat_data['description'],
                is_active=True
            )

            # Привязываем категорию к помещениям
            for room_idx in cat_data['rooms']:
                category.rooms.add(rooms[room_idx])

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
            {'name': 'GROHE', 'description': 'Немецкий производитель сантехники премиум-класса', 'country': 'Германия', 'order': 1, 'logo': 'grohe.png'},
            {'name': 'GEBERIT', 'description': 'Швейцарский производитель инсталляций и сантехнических систем', 'country': 'Швейцария', 'order': 2, 'logo': 'geberit.png'},
            {'name': 'THERMEX', 'description': 'Водонагреватели и климатическое оборудование', 'country': 'Россия', 'order': 3, 'logo': 'thermex.png'},
            {'name': 'Grundfos', 'description': 'Датский производитель насосного оборудования', 'country': 'Дания', 'order': 4, 'logo': 'grundfos.png'},
            {'name': 'OVENTROP', 'description': 'Немецкая арматура для систем отопления и водоснабжения', 'country': 'Германия', 'order': 5, 'logo': 'oventrop.png'},
            {'name': 'Viega', 'description': 'Системы трубопроводов и инсталляций', 'country': 'Германия', 'order': 6, 'logo': 'viega.png'},
        ]

        brands = []
        for brand_data in brands_data:
            brand = Brand.objects.create(
                name=brand_data['name'],
                description=brand_data['description'],
                country_of_origin=brand_data['country'],
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

        # Создать товары для каждой категории
        self.stdout.write('\nСоздание товаров...')

        products = []
        labels = ['new', 'hit', 'sale', 'exclusive', '']
        product_counter = 0
        
        # Создаем по 3-5 товаров для каждой категории
        for cat_idx, category in enumerate(categories):
            num_products = random.randint(3, 5)
            
            for i in range(num_products):
                # Выбираем случайный бренд
                brand = random.choice(brands)
                
                # Выбираем случайное помещение из тех, к которым привязана категория
                room = random.choice(list(category.rooms.all()))
                
                # Генерируем уникальное название товара с глобальным счетчиком
                product_counter += 1
                product_name = f'{category.name} {brand.name} Артикул {product_counter}'
                
                # Выбираем случайный лейбл
                label = random.choice(labels)
                
                # Генерируем цену
                base_price = Decimal(random.randint(1500, 55000))
                has_discount = random.choice([True, False])
                discount_price = base_price * Decimal('0.85') if has_discount else None

                description = f'''Сантехника из категории "{category.name}" от бренда {brand.name}.

Особенности:
• Высокое качество материалов
• Соответствует европейским стандартам
• Простой монтаж
• Гарантия производителя

Подходит для: {room.name}'''

                product = Product.objects.create(
                    name=product_name,
                    description=description,
                    category=category,
                    room=room,
                    brand=brand,
                    price=base_price,
                    discount_price=discount_price,
                    stock_quantity=random.randint(5, 50),
                    sku=f'{brand.slug.upper()[:3]}-{category.slug.upper()[:3]}-{1000 + product_counter}',
                    label=label,
                    orders_count=random.randint(0, 100),
                    specifications={
                        "Бренд": brand.name,
                        "Категория": category.name,
                        "Помещение": room.name,
                        "Страна производства": brand.country_of_origin,
                    },
                    warranty_months=random.choice([12, 24, 36, 60]),
                    is_active=True
                )
                products.append(product)
                label_text = f", лейбл: {label}" if label else ""
                self.stdout.write(f'  ✓ Создан товар: {product.name} (SKU: {product.sku}, {product.final_price} ₽{label_text})')
        
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
        self.stdout.write(f'Помещений: {Room.objects.count()}')
        self.stdout.write(f'Категорий: {Category.objects.count()}')
        self.stdout.write(f'Брендов: {Brand.objects.count()}')
        self.stdout.write(f'Баннеров: {Banner.objects.count()}')
        self.stdout.write(f'Товаров: {Product.objects.count()}')
        self.stdout.write(f'Изображений: {ProductImage.objects.count()}')
        self.stdout.write(f'Отзывов: {ProductReview.objects.count()}')
        self.stdout.write(f'Заказов: {Order.objects.count()}')
        self.stdout.write(f'Позиций в заказах: {OrderItem.objects.count()}')

        self.stdout.write('\n' + '='*70)
        self.stdout.write(self.style.SUCCESS('Созданные помещения:'))
        self.stdout.write('='*70)
        for room in Room.objects.all():
            self.stdout.write(f'  • {room.name} ({room.slug})')

        self.stdout.write('\n' + '='*70)
        self.stdout.write(self.style.SUCCESS('Созданные категории:'))
        self.stdout.write('='*70)
        for cat in Category.objects.all():
            room_names = ', '.join([r.name for r in cat.rooms.all()])
            self.stdout.write(f'  • {cat.name} ({cat.slug}) - Помещения: {room_names}')

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
        self.stdout.write('  • Помещения: bathroom.png, kitchen.png, living.png, bedroom.png, hallway.png, office.png')
        self.stdout.write('  • Категории: santehnika.png, kuhni.png, unitazy.png, plitka.png, vanny.png, mebel.png, и др.')
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
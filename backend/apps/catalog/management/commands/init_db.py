from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.files import File
from django.core.management import call_command
from decimal import Decimal
import random
from pathlib import Path
from apps.catalog.models import Room, Category, Product, ProductImage, ProductReview, Brand, Banner
from apps.orders.models import Order, OrderItem

User = get_user_model()


class Command(BaseCommand):
    help = 'Полная инициализация базы данных: создание админа, тестовых данных и изображений'

    def add_arguments(self, parser):
        parser.add_argument(
            '--skip-admin',
            action='store_true',
            help='Пропустить создание администратора',
        )
        parser.add_argument(
            '--skip-images',
            action='store_true',
            help='Пропустить добавление изображений товаров',
        )

    def get_photo_path(self, filename):
        """Получить путь к фото из локальной папки photo рядом со скриптом"""
        script_dir = Path(__file__).parent
        photo_dir = script_dir / 'photo'
        photo_path = photo_dir / filename
        
        if photo_path.exists():
            return photo_path
        return None

    def handle(self, *args, **options):
        self.stdout.write('='*70)
        self.stdout.write(self.style.SUCCESS('🚀 ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ'))
        self.stdout.write('='*70)
        
        # Шаг 1: Очистка базы данных
        self.stdout.write('\n📦 Шаг 1/5: Очистка существующих данных...')
        OrderItem.objects.all().delete()
        Order.objects.all().delete()
        ProductReview.objects.all().delete()
        ProductImage.objects.all().delete()
        Product.objects.all().delete()
        Banner.objects.all().delete()
        Brand.objects.all().delete()
        Category.objects.all().delete()
        Room.objects.all().delete()
        # Удаляем всех пользователей кроме суперпользователей
        User.objects.filter(is_superuser=False).delete()
        self.stdout.write(self.style.SUCCESS('  ✓ База данных очищена'))
        
        # Шаг 2: Создание администратора
        if not options['skip_admin']:
            self.stdout.write('\n👤 Шаг 2/5: Создание администратора...')
            admin_email = 'admin@mail.ru'
            admin_password = 'admin'
            
            if User.objects.filter(email=admin_email).exists():
                self.stdout.write(self.style.WARNING(f'  ⚠ Администратор {admin_email} уже существует'))
            else:
                admin = User.objects.create_superuser(
                    email=admin_email,
                    phone='+79999999999',
                    password=admin_password
                )
                admin.first_name = 'Администратор'
                admin.last_name = 'Системы'
                admin.save()
                self.stdout.write(self.style.SUCCESS(f'  ✓ Создан администратор:'))
                self.stdout.write(f'    📧 Email: {admin_email}')
                self.stdout.write(f'    🔑 Пароль: {admin_password}')
        else:
            self.stdout.write('\n👤 Шаг 2/5: Создание администратора пропущено')
        
        # Шаг 3: Создание тестовых пользователей
        self.stdout.write('\n👥 Шаг 3/5: Создание тестовых пользователей...')
        test_users = []
        users_data = [
            {'email': 'ivan@example.com', 'phone': '+79991234567', 'first_name': 'Иван', 'last_name': 'Иванов'},
            {'email': 'maria@example.com', 'phone': '+79991234568', 'first_name': 'Мария', 'last_name': 'Петрова'},
            {'email': 'alex@example.com', 'phone': '+79991234569', 'first_name': 'Александр', 'last_name': 'Сидоров'},
            {'email': 'elena@example.com', 'phone': '+79991234570', 'first_name': 'Елена', 'last_name': 'Смирнова'},
            {'email': 'dmitry@example.com', 'phone': '+79991234571', 'first_name': 'Дмитрий', 'last_name': 'Козлов'},
        ]
        
        for user_data in users_data:
            user = User.objects.create_user(
                email=user_data['email'],
                phone=user_data['phone'],
                password='testpass123',
                first_name=user_data['first_name'],
                last_name=user_data['last_name']
            )
            test_users.append(user)
            self.stdout.write(f'  ✓ {user.get_full_name()} ({user.email})')
        
        # Шаг 4: Создание каталога товаров
        self.stdout.write('\n🏪 Шаг 4/5: Создание каталога товаров...')
        
        # Создать помещения
        self.stdout.write('  📍 Создание помещений...')
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
            
            rooms.append(room)
            self.stdout.write(f'    ✓ {room.name}')
        
        # Создать категории
        self.stdout.write('  📂 Создание категорий...')
        categories_data = [
            {'name': 'Смесители', 'description': 'Смесители для ванной и кухни', 'rooms': [0, 1], 'image': 'santehnika.png'},
            {'name': 'Унитазы', 'description': 'Унитазы и комплектующие', 'rooms': [0], 'image': 'unitazy.png'},
            {'name': 'Плитка', 'description': 'Плитка для ванной и кухни', 'rooms': [0, 1], 'image': 'plitka.png'},
            {'name': 'Ванны', 'description': 'Ванны и душевые кабины', 'rooms': [0], 'image': 'vanny.png'},
            {'name': 'Мебель для ванны', 'description': 'Мебель и аксессуары для ванной комнаты', 'rooms': [0], 'image': 'mebel.png'},
            {'name': 'Кухонные мойки', 'description': 'Мойки для кухни', 'rooms': [1], 'image': 'kuhni.png'},
            {'name': 'Диваны', 'description': 'Диваны и кресла для гостиной', 'rooms': [2], 'image': 'sofa.png'},
            {'name': 'Столы', 'description': 'Столы и стулья для гостиной', 'rooms': [2], 'image': 'tables.png'},
            {'name': 'Кровати', 'description': 'Кровати и матрасы', 'rooms': [3], 'image': 'beds.png'},
            {'name': 'Шкафы', 'description': 'Шкафы и комоды для спальни', 'rooms': [3], 'image': 'wardrobes.png'},
            {'name': 'Вешалки', 'description': 'Вешалки и обувницы для прихожей', 'rooms': [4], 'image': 'hangers.png'},
            {'name': 'Зеркала', 'description': 'Зеркала для прихожей', 'rooms': [4], 'image': 'mirrors.png'},
            {'name': 'Письменные столы', 'description': 'Столы для домашнего офиса', 'rooms': [5], 'image': 'desks.png'},
            {'name': 'Кресла офисные', 'description': 'Офисные кресла и стулья', 'rooms': [5], 'image': 'chairs.png'},
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
            
            categories.append(category)
            self.stdout.write(f'    ✓ {category.name}')
        
        # Создать бренды
        self.stdout.write('  🏷️  Создание брендов...')
        brands_data = [
            {'name': 'GESSI', 'description': 'Итальянский производитель премиум сантехники', 'country': 'Италия', 'order': 1, 'logo': 'gessi.png'},
            {'name': 'cielo', 'description': 'Дизайнерская керамика и сантехника', 'country': 'Италия', 'order': 2, 'logo': 'cielo.png'},
            {'name': 'Jorger', 'description': 'Эксклюзивная сантехника класса люкс', 'country': 'Германия', 'order': 3, 'logo': 'jorger.png'},
            {'name': 'KRONOS ceramiche', 'description': 'Итальянская керамическая плитка', 'country': 'Италия', 'order': 4, 'logo': 'kronos.png'},
            {'name': 'DevoN&DevoN', 'description': 'Мебель для ванных комнат', 'country': 'Россия', 'order': 5, 'logo': 'devon.png'},
            {'name': 'SICIS', 'description': 'Итальянская мозаика и плитка', 'country': 'Италия', 'order': 6, 'logo': 'sicis.png'},
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
            
            brands.append(brand)
            self.stdout.write(f'    ✓ {brand.name}')
        
        # Создать баннеры
        self.stdout.write('  🎨 Создание баннеров...')
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
            
            self.stdout.write(f'    ✓ {banner.title}')
        
        # Создать товары (50+ штук)
        self.stdout.write('  🛍️  Создание товаров (50+ штук)...')
        products = []
        labels = ['new', 'hit', 'sale', 'exclusive', '']
        product_counter = 0
        
        # Создаем минимум 50 товаров, распределяя по категориям
        total_products_needed = 50
        products_per_category = max(4, total_products_needed // len(categories) + 1)
        
        for category in categories:
            for i in range(products_per_category):
                if product_counter >= total_products_needed:
                    break
                
                # Выбираем случайный бренд
                brand = random.choice(brands)
                
                # Выбираем ПЕРВОЕ помещение из тех, к которым привязана категория
                # Это важно для правильной фильтрации: товар должен быть привязан к конкретному помещению
                room = list(category.rooms.all())[0] if category.rooms.exists() else None
                
                # Генерируем уникальное название товара
                product_counter += 1
                product_name = f'{category.name} {brand.name} Модель {product_counter}'
                
                # Выбираем случайный лейбл
                label = random.choice(labels)
                
                # Генерируем цену
                base_price = Decimal(random.randint(10000, 150000))
                has_discount = random.choice([True, False])
                discount_price = base_price * Decimal('0.85') if has_discount else None
                
                description = f'''Премиальный товар из категории "{category.name}" от бренда {brand.name}.

Особенности:
• Высокое качество материалов
• Современный дизайн
• Простая установка
• Гарантия производителя

Идеально подходит для помещения: {room.name if room else "Универсальное"}

Страна производства: {brand.country_of_origin}'''
                
                product = Product.objects.create(
                    name=product_name,
                    description=description,
                    category=category,
                    room=room,  # Привязываем к конкретному помещению
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
                        "Помещение": room.name if room else "Универсальное",
                        "Страна производства": brand.country_of_origin,
                        "Материал": random.choice(["Латунь", "Нержавеющая сталь", "Керамика", "Дерево", "Стекло"]),
                        "Цвет": random.choice(["Хром", "Матовый черный", "Золото", "Белый", "Серый"]),
                    },
                    warranty_months=random.choice([12, 24, 36, 60]),
                    is_active=True
                )
                products.append(product)
        
        self.stdout.write(f'    ✓ Создано товаров: {len(products)}')
        
        # Создать изображения товаров
        if not options['skip_images']:
            self.stdout.write('  🖼️  Добавление изображений товаров...')
            product_image_filename = 'смеситель.png'
            photo_path = self.get_photo_path(product_image_filename)
            
            if photo_path:
                images_created = 0
                for product in products:
                    # Добавляем 4 изображения для каждого товара
                    for i in range(4):
                        with open(photo_path, 'rb') as f:
                            product_image = ProductImage.objects.create(
                                product=product,
                                alt_text=f'{product.name} - изображение {i + 1}',
                                is_main=(i == 0),
                                order=i
                            )
                            product_image.image.save(f'{product.slug}-{i + 1}.png', File(f), save=True)
                            images_created += 1
                
                self.stdout.write(f'    ✓ Создано изображений: {images_created}')
            else:
                self.stdout.write(self.style.WARNING(f'    ⚠ Файл {product_image_filename} не найден, изображения не созданы'))
                self.stdout.write(self.style.WARNING(f'    💡 Вы можете добавить изображения позже командой: python manage.py add_product_images'))
        else:
            self.stdout.write('  🖼️  Добавление изображений товаров пропущено')
            self.stdout.write(self.style.WARNING(f'    💡 Вы можете добавить изображения позже командой: python manage.py add_product_images'))
        
        # Создать отзывы
        self.stdout.write('  ⭐ Создание отзывов...')
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
        for product in products:
            # Каждый товар получает от 0 до 3 отзывов
            num_reviews = random.randint(0, 3)
            reviewers = random.sample(test_users, min(num_reviews, len(test_users)))
            
            for user in reviewers:
                ProductReview.objects.create(
                    product=product,
                    user=user,
                    rating=random.randint(3, 5),
                    comment=random.choice(review_comments),
                    is_verified_purchase=random.choice([True, True, False])
                )
                reviews_created += 1
        
        self.stdout.write(f'    ✓ Создано отзывов: {reviews_created}')
        
        # Создать тестовые заказы
        self.stdout.write('  📦 Создание тестовых заказов...')
        orders_created = 0
        cities = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань']
        
        for user in test_users[:3]:
            num_orders = random.randint(1, 2)
            
            for _ in range(num_orders):
                order_products = random.sample(products, random.randint(1, 4))
                
                total = Decimal('0')
                for product in order_products:
                    quantity = random.randint(1, 3)
                    total += product.final_price * quantity
                
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
        
        self.stdout.write(f'    ✓ Создано заказов: {orders_created}')
        
        # Шаг 5: Итоговая статистика
        self.stdout.write('\n📊 Шаг 5/5: Итоговая статистика')
        self.stdout.write('='*70)
        self.stdout.write(self.style.SUCCESS('✅ БАЗА ДАННЫХ УСПЕШНО ИНИЦИАЛИЗИРОВАНА!'))
        self.stdout.write('='*70)
        self.stdout.write(f'👥 Пользователей: {User.objects.count()}')
        self.stdout.write(f'   - Администраторов: {User.objects.filter(is_superuser=True).count()}')
        self.stdout.write(f'   - Обычных пользователей: {User.objects.filter(is_superuser=False).count()}')
        self.stdout.write(f'📍 Помещений: {Room.objects.count()}')
        self.stdout.write(f'📂 Категорий: {Category.objects.count()}')
        self.stdout.write(f'🏷️  Брендов: {Brand.objects.count()}')
        self.stdout.write(f'🎨 Баннеров: {Banner.objects.count()}')
        self.stdout.write(f'🛍️  Товаров: {Product.objects.count()}')
        self.stdout.write(f'🖼️  Изображений: {ProductImage.objects.count()}')
        self.stdout.write(f'⭐ Отзывов: {ProductReview.objects.count()}')
        self.stdout.write(f'📦 Заказов: {Order.objects.count()}')
        self.stdout.write(f'📋 Позиций в заказах: {OrderItem.objects.count()}')
        
        # Информация для входа
        self.stdout.write('\n' + '='*70)
        self.stdout.write(self.style.SUCCESS('🔐 ДАННЫЕ ДЛЯ ВХОДА'))
        self.stdout.write('='*70)
        
        if not options['skip_admin']:
            self.stdout.write('\n👨‍💼 Администратор:')
            self.stdout.write('  📧 Email: admin@mail.ru')
            self.stdout.write('  🔑 Пароль: admin')
            self.stdout.write('  🌐 Админ-панель: http://localhost:8000/admin/')
        
        self.stdout.write('\n👤 Тестовые пользователи (пароль для всех: testpass123):')
        for user in test_users:
            self.stdout.write(f'  📧 {user.email} ({user.get_full_name()})')
        
        self.stdout.write('\n' + '='*70)
        self.stdout.write('ℹ️  ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ')
        self.stdout.write('='*70)
        self.stdout.write('📁 Изображения загружаются из папки:')
        self.stdout.write('   backend/apps/catalog/management/commands/photo/')
        self.stdout.write('')
        self.stdout.write('📝 Необходимые файлы изображений:')
        self.stdout.write('   • Помещения: bathroom.png, kitchen.png, living.png, bedroom.png, hallway.png, office.png')
        self.stdout.write('   • Категории: santehnika.png, unitazy.png, plitka.png, vanny.png, mebel.png, kuhni.png, и др.')
        self.stdout.write('   • Бренды: gessi.png, cielo.png, jorger.png, kronos.png, devon.png, sicis.png')
        self.stdout.write('   • Баннеры: banner1.png, banner2.png')
        self.stdout.write('   • Товары: смеситель.png (или используйте команду add_product_images)')
        self.stdout.write('='*70)
        
        self.stdout.write('\n' + '='*70)
        self.stdout.write(self.style.SUCCESS('🎉 ГОТОВО! Интернет-магазин полностью наполнен данными'))
        self.stdout.write('='*70)
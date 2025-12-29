from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from decimal import Decimal
import random
from apps.catalog.models import Category, Product, ProductImage, ProductReview
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
    
    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Очистка существующих данных...')
            OrderItem.objects.all().delete()
            Order.objects.all().delete()
            ProductReview.objects.all().delete()
            ProductImage.objects.all().delete()
            Product.objects.all().delete()
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
            {
                'name': 'Электроника',
                'description': 'Электронные устройства и гаджеты',
                'subcategories': [
                    {'name': 'Смартфоны', 'description': 'Мобильные телефоны и аксессуары'},
                    {'name': 'Ноутбуки', 'description': 'Портативные компьютеры'},
                    {'name': 'Наушники', 'description': 'Аудио устройства'},
                ]
            },
            {
                'name': 'Одежда',
                'description': 'Мужская и женская одежда',
                'subcategories': [
                    {'name': 'Мужская одежда', 'description': 'Одежда для мужчин'},
                    {'name': 'Женская одежда', 'description': 'Одежда для женщин'},
                ]
            },
            {
                'name': 'Дом и сад',
                'description': 'Товары для дома и сада',
                'subcategories': [
                    {'name': 'Мебель', 'description': 'Домашняя мебель'},
                    {'name': 'Декор', 'description': 'Предметы декора'},
                ]
            },
            {
                'name': 'Спорт',
                'description': 'Спортивные товары и оборудование',
                'subcategories': [
                    {'name': 'Фитнес', 'description': 'Оборудование для фитнеса'},
                    {'name': 'Велосипеды', 'description': 'Велосипеды и аксессуары'},
                ]
            },
        ]
        
        categories = {}
        for cat_data in categories_data:
            parent_cat = Category.objects.create(
                name=cat_data['name'],
                description=cat_data['description'],
                is_active=True
            )
            categories[cat_data['name']] = parent_cat
            self.stdout.write(f'  ✓ Создана категория: {parent_cat.name}')
            
            for subcat_data in cat_data.get('subcategories', []):
                subcat = Category.objects.create(
                    name=subcat_data['name'],
                    description=subcat_data['description'],
                    parent=parent_cat,
                    is_active=True
                )
                categories[subcat_data['name']] = subcat
                self.stdout.write(f'    ✓ Создана подкатегория: {subcat.name}')
        
        # Создать товары
        self.stdout.write('\nСоздание товаров...')
        products_data = [
            # Электроника - Смартфоны
            {'name': 'iPhone 15 Pro', 'category': 'Смартфоны', 'price': 99990, 'discount': 94990, 'stock': 15},
            {'name': 'Samsung Galaxy S24', 'category': 'Смартфоны', 'price': 79990, 'stock': 20},
            {'name': 'Xiaomi 14 Pro', 'category': 'Смартфоны', 'price': 59990, 'discount': 54990, 'stock': 25},
            {'name': 'Google Pixel 8', 'category': 'Смартфоны', 'price': 69990, 'stock': 10},
            
            # Электроника - Ноутбуки
            {'name': 'MacBook Pro 16"', 'category': 'Ноутбуки', 'price': 249990, 'stock': 8},
            {'name': 'Dell XPS 15', 'category': 'Ноутбуки', 'price': 149990, 'discount': 139990, 'stock': 12},
            {'name': 'Lenovo ThinkPad X1', 'category': 'Ноутбуки', 'price': 129990, 'stock': 15},
            {'name': 'ASUS ROG Strix', 'category': 'Ноутбуки', 'price': 179990, 'discount': 169990, 'stock': 7},
            
            # Электроника - Наушники
            {'name': 'AirPods Pro 2', 'category': 'Наушники', 'price': 24990, 'stock': 30},
            {'name': 'Sony WH-1000XM5', 'category': 'Наушники', 'price': 29990, 'discount': 27990, 'stock': 25},
            {'name': 'Bose QuietComfort', 'category': 'Наушники', 'price': 27990, 'stock': 20},
            
            # Одежда - Мужская
            {'name': 'Мужская куртка', 'category': 'Мужская одежда', 'price': 8990, 'discount': 6990, 'stock': 40},
            {'name': 'Мужские джинсы', 'category': 'Мужская одежда', 'price': 4990, 'stock': 50},
            {'name': 'Мужская рубашка', 'category': 'Мужская одежда', 'price': 2990, 'stock': 60},
            
            # Одежда - Женская
            {'name': 'Женское платье', 'category': 'Женская одежда', 'price': 5990, 'discount': 4990, 'stock': 35},
            {'name': 'Женская блузка', 'category': 'Женская одежда', 'price': 3490, 'stock': 45},
            {'name': 'Женские брюки', 'category': 'Женская одежда', 'price': 4490, 'stock': 40},
            
            # Дом и сад - Мебель
            {'name': 'Диван угловой', 'category': 'Мебель', 'price': 49990, 'discount': 44990, 'stock': 5},
            {'name': 'Кресло офисное', 'category': 'Мебель', 'price': 12990, 'stock': 15},
            {'name': 'Стол письменный', 'category': 'Мебель', 'price': 8990, 'stock': 20},
            
            # Дом и сад - Декор
            {'name': 'Картина настенная', 'category': 'Декор', 'price': 2990, 'stock': 30},
            {'name': 'Ваза декоративная', 'category': 'Декор', 'price': 1490, 'discount': 990, 'stock': 40},
            {'name': 'Светильник настольный', 'category': 'Декор', 'price': 3490, 'stock': 25},
            
            # Спорт - Фитнес
            {'name': 'Гантели 10кг', 'category': 'Фитнес', 'price': 2990, 'stock': 50},
            {'name': 'Коврик для йоги', 'category': 'Фитнес', 'price': 1490, 'discount': 1190, 'stock': 60},
            {'name': 'Фитнес-браслет', 'category': 'Фитнес', 'price': 4990, 'stock': 35},
            
            # Спорт - Велосипеды
            {'name': 'Горный велосипед', 'category': 'Велосипеды', 'price': 34990, 'discount': 29990, 'stock': 10},
            {'name': 'Городской велосипед', 'category': 'Велосипеды', 'price': 24990, 'stock': 15},
            {'name': 'Детский велосипед', 'category': 'Велосипеды', 'price': 9990, 'stock': 20},
        ]
        
        descriptions = [
            'Высокое качество и надежность. Отличный выбор для повседневного использования.',
            'Современный дизайн и передовые технологии. Идеально подходит для требовательных пользователей.',
            'Отличное соотношение цены и качества. Проверено временем.',
            'Премиум качество по доступной цене. Гарантия производителя 2 года.',
            'Инновационное решение для вашего комфорта. Рекомендуем!',
        ]
        
        products = []
        for prod_data in products_data:
            category = categories[prod_data['category']]
            product = Product.objects.create(
                name=prod_data['name'],
                description=random.choice(descriptions),
                category=category,
                price=Decimal(prod_data['price']),
                discount_price=Decimal(prod_data['discount']) if 'discount' in prod_data else None,
                stock_quantity=prod_data['stock'],
                is_active=True
            )
            products.append(product)
            self.stdout.write(f'  ✓ Создан товар: {product.name} ({product.final_price} ₽)')
        
        # Создать изображения товаров (placeholder URLs)
        self.stdout.write('\nСоздание изображений товаров...')
        images_created = 0
        placeholder_base = 'https://placehold.co/600x600'
        
        for product in products:
            # Создаем 1-3 изображения для каждого товара
            num_images = random.randint(1, 3)
            for i in range(num_images):
                # Используем разные цвета для разных изображений
                colors = ['png/3B82F6/FFFFFF', 'png/10B981/FFFFFF', 'png/F59E0B/FFFFFF',
                         'png/EF4444/FFFFFF', 'png/8B5CF6/FFFFFF']
                color = random.choice(colors)
                
                ProductImage.objects.create(
                    product=product,
                    image=f'{placeholder_base}/{color}?text={product.name[:20]}',
                    alt_text=f'{product.name} - изображение {i+1}',
                    is_main=(i == 0)  # Первое изображение - главное
                )
                images_created += 1
        
        self.stdout.write(self.style.SUCCESS(f'✓ Создано изображений: {images_created}'))
        
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
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS('✓ Тестовые данные успешно созданы!'))
        self.stdout.write('='*60)
        self.stdout.write(f'Пользователей: {len(test_users)}')
        self.stdout.write(f'Категорий: {Category.objects.count()}')
        self.stdout.write(f'Товаров: {Product.objects.count()}')
        self.stdout.write(f'Изображений: {ProductImage.objects.count()}')
        self.stdout.write(f'Отзывов: {ProductReview.objects.count()}')
        self.stdout.write(f'Заказов: {Order.objects.count()}')
        self.stdout.write(f'Позиций в заказах: {OrderItem.objects.count()}')
        
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS('Тестовые пользователи (пароль для всех: testpass123):'))
        self.stdout.write('='*60)
        for user in test_users:
            self.stdout.write(f'  📧 {user.email}')
        
        self.stdout.write('\n' + '='*60)
        self.stdout.write('Для доступа к админ-панели создайте суперпользователя:')
        self.stdout.write('  python manage.py createsuperuser')
        self.stdout.write('\nИли используйте Docker:')
        self.stdout.write('  docker-compose exec backend python manage.py createsuperuser')
        self.stdout.write('='*60)
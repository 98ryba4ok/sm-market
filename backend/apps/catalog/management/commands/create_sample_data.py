from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.files import File
from pathlib import Path
from apps.catalog.models import Room, Category, Brand, Banner

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
            Banner.objects.all().delete()
            Brand.objects.all().delete()
            Category.objects.all().delete()
            Room.objects.all().delete()
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

        # Итоговая статистика
        self.stdout.write('\n' + '='*70)
        self.stdout.write(self.style.SUCCESS('✓ Данные успешно созданы!'))
        self.stdout.write('='*70)
        self.stdout.write(f'Пользователей: {len(test_users)}')
        self.stdout.write(f'Помещений: {Room.objects.count()}')
        self.stdout.write(f'Категорий: {Category.objects.count()}')
        self.stdout.write(f'Брендов: {Brand.objects.count()}')
        self.stdout.write(f'Баннеров: {Banner.objects.count()}')

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
        self.stdout.write('  • Категории: smesiteli.png, leiki.png, stoyki.png, radiatory.png, sifony.png,')
        self.stdout.write('               unitazy.png, vodoschotchiki.png, vodonagrevateli.png, instrumenty.png,')
        self.stdout.write('               kollektory.png, kotelnoe.png, krany.png, oborudovanie.png')
        self.stdout.write('  • Бренды: grohe.png, geberit.png, thermex.png, grundfos.png, oventrop.png, viega.png')
        self.stdout.write('  • Баннеры: banner1.png, banner2.png')
        self.stdout.write('='*70)
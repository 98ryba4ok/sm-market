from django.core.management.base import BaseCommand
from django.core.files import File
from pathlib import Path
from apps.catalog.models import Product, ProductImage


class Command(BaseCommand):
    help = 'Добавляет изображения смесителя ко всем существующим товарам'

    def get_photo_path(self, filename):
        """Получить путь к фото из локальной папки photo рядом со скриптом"""
        script_dir = Path(__file__).parent
        photo_dir = script_dir / 'photo'
        photo_path = photo_dir / filename
        
        if photo_path.exists():
            return photo_path
        return None

    def handle(self, *args, **options):
        # Путь к изображению смесителя
        image_path = self.get_photo_path('смеситель.png')
        
        if not image_path:
            self.stdout.write(self.style.ERROR('❌ Файл смеситель.png не найден в папке photo'))
            self.stdout.write('Скопируйте файл в: backend/apps/catalog/management/commands/photo/')
            return
        
        self.stdout.write(f'📁 Найден файл: {image_path}')
        
        # Получаем все товары
        products = Product.objects.all()
        total_products = products.count()
        
        if total_products == 0:
            self.stdout.write(self.style.WARNING('⚠️  В базе данных нет товаров'))
            return
        
        self.stdout.write(f'\n🔄 Обработка {total_products} товаров...\n')
        
        images_created = 0
        products_updated = 0
        
        for product in products:
            self.stdout.write(f'  Обработка товара: {product.name}')
            
            # Удаляем старые изображения товара
            old_images_count = product.images.count()
            if old_images_count > 0:
                product.images.all().delete()
                self.stdout.write(f'    ✓ Удалено старых изображений: {old_images_count}')
            
            # Добавляем 4 изображения
            for i in range(4):
                with open(image_path, 'rb') as f:
                    product_image = ProductImage.objects.create(
                        product=product,
                        alt_text=f'{product.name} - изображение {i + 1}',
                        is_main=(i == 0),  # Первое изображение - главное
                        order=i
                    )
                    # Сохраняем файл с уникальным именем
                    product_image.image.save(
                        f'{product.slug}-{i + 1}.png',
                        File(f),
                        save=True
                    )
                    images_created += 1
            
            products_updated += 1
            self.stdout.write(f'    ✓ Добавлено 4 изображения\n')
        
        # Итоговая статистика
        self.stdout.write('\n' + '='*70)
        self.stdout.write(self.style.SUCCESS('✅ Изображения успешно добавлены!'))
        self.stdout.write('='*70)
        self.stdout.write(f'Обработано товаров: {products_updated}')
        self.stdout.write(f'Создано изображений: {images_created}')
        self.stdout.write(f'Изображений на товар: 4')
        self.stdout.write('='*70)

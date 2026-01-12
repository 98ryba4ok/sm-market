import os
from django.core.management.base import BaseCommand
from django.conf import settings
from apps.catalog.models import Product, ProductImage


class Command(BaseCommand):
    help = 'Добавляет изображение смесителя для всех товаров без изображений'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Добавить изображение даже для товаров, у которых уже есть изображения',
        )

    def handle(self, *args, **options):
        force = options['force']
        
        image_filename = 'смеситель.png'
        image_path = os.path.join(settings.MEDIA_ROOT, 'products', image_filename)
        
        if not os.path.exists(image_path):
            self.stdout.write(
                self.style.ERROR(f'Файл изображения не найден: {image_path}')
            )
            self.stdout.write(
                self.style.WARNING('Убедитесь, что файл смеситель.png находится в backend/media/products/')
            )
            return
        
        products = Product.objects.all()
        total_products = products.count()
        
        if total_products == 0:
            self.stdout.write(self.style.WARNING('В базе данных нет товаров'))
            return
        
        self.stdout.write(f'Найдено товаров: {total_products}')
        
        added_count = 0
        skipped_count = 0
        
        for product in products:
            existing_images = product.images.exists()
            
            if existing_images and not force:
                skipped_count += 1
                continue
            
            image_relative_path = f'products/{image_filename}'
            
            ProductImage.objects.create(
                product=product,
                image=image_relative_path,
                is_main=not existing_images,
                order=product.images.count(),
                alt_text=product.name
            )
            
            added_count += 1
            self.stdout.write(f'✓ Добавлено изображение для: {product.name}')
        
        self.stdout.write(self.style.SUCCESS(f'\n=== Готово ==='))
        self.stdout.write(self.style.SUCCESS(f'Добавлено изображений: {added_count}'))
        if skipped_count > 0:
            self.stdout.write(self.style.WARNING(f'Пропущено товаров (уже есть изображения): {skipped_count}'))
            self.stdout.write(self.style.NOTICE('Используйте --force для добавления изображений всем товарам'))

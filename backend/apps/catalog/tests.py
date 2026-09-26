from django.test import TestCase
from rest_framework.test import APIClient

from .models import Category, Product, Room


class HomepageCatalogTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.room = Room.objects.create(name='Ванная', slug='vannaya-komnata')
        self.category = Category.objects.create(name='Зеркала', slug='zerkala')
        self.category.rooms.add(self.room)
        self.mirror = Product.objects.create(
            name='Зеркало круглое', slug='mirror', sku='MIRROR-1',
            category=self.category, room=self.room, price='1200', stock_quantity=4,
        )
        other_category = Category.objects.create(name='Смесители', slug='smesiteli')
        Product.objects.create(
            name='Смеситель хром', slug='mixer', sku='MIXER-1',
            category=other_category, price='2000', stock_quantity=3,
        )

    def test_homepage_plural_link_finds_category_products(self):
        response = self.client.get('/api/catalog/products/', {'search': 'Зеркала'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual([p['id'] for p in response.data['results']], [self.mirror.id])

    def test_empty_search_does_not_fall_back_to_all_products(self):
        response = self.client.get('/api/catalog/products/', {'search': 'Диваны'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 0)

    def test_room_link_filters_products(self):
        response = self.client.get('/api/catalog/products/', {'room': self.room.slug})
        self.assertEqual(response.status_code, 200)
        self.assertEqual([p['id'] for p in response.data['results']], [self.mirror.id])

    def test_missing_and_inactive_rooms_do_not_show_unrelated_products(self):
        for slug in ['kuhnya', self.room.slug]:
            if slug == self.room.slug:
                self.room.is_active = False
                self.room.save()
            for endpoint in ['products', 'categories']:
                response = self.client.get(f'/api/catalog/{endpoint}/', {'room': slug})
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.data['count'], 0)

import uuid
from datetime import timedelta
from decimal import Decimal
from django.test import TestCase
from django.utils import timezone
from django.db.models import Sum
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate
from rest_framework.exceptions import ValidationError
from apps.catalog.models import Category, Product
from apps.users.models import User
from apps.orders.models import Cart, CartItem, Order
from apps.orders.serializers import OrderCreateSerializer
from .models import StockMovement
from .services import move_stock, reverse_movement


class WarehouseTests(TestCase):
    def setUp(self):
        self.staff = User.objects.create_user('staff@local.test', '+79990000001', 'test-password', is_staff=True)
        self.customer = User.objects.create_user('customer@local.test', '+79990000002', 'test-password')
        self.category = Category.objects.create(name='Смесители', slug='taps')
        self.product = Product.objects.create(name='Смеситель', slug='tap', sku='TAP-01', category=self.category, price='100.50', units_per_box=12)
        self.client = APIClient()
        self.client.force_authenticate(self.staff)
        self.t0 = timezone.now() - timedelta(days=5)

    def receipt(self, quantity=60, when=None):
        return move_stock(product_id=self.product.id, kind='receipt', quantity=quantity,
            unit_price='70.10', actor=self.staff, occurred_at=when or self.t0)

    def assertBalance(self, expected):
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, expected)
        self.assertEqual(StockMovement.objects.filter(product=self.product).aggregate(total=Sum('quantity'))['total'] or 0, expected)

    def post(self, **overrides):
        data = dict(product=self.product.id, kind='receipt', boxes=5, pieces=0, unit_price='70.10',
            occurred_at=timezone.now().isoformat(), request_id=str(uuid.uuid4()), note='Поставка')
        data.update(overrides)
        return self.client.post('/api/inventory/movements/', data, format='json')

    def test_boxes_and_pieces(self):
        self.assertEqual(self.post().status_code, 201)
        self.assertEqual(self.post(kind='expense', boxes=1, pieces=5, unit_price='100.50').status_code, 201)
        self.assertBalance(43)
        row = self.client.get('/api/inventory/products/').data['results'][0]
        self.assertEqual((row['boxes'], row['pieces']), (3, 7))

    def test_cannot_overspend_and_no_ledger_entry(self):
        self.receipt(2)
        response = self.post(kind='expense', boxes=0, pieces=3)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(StockMovement.objects.count(), 1)
        self.assertBalance(2)

    def test_zero_negative_fraction_and_future_rejected(self):
        for values in [dict(boxes=0,pieces=0), dict(boxes=-1), dict(pieces=1.5), dict(unit_price='-1'), dict(occurred_at=(timezone.now()+timedelta(days=1)).isoformat())]:
            self.assertEqual(self.post(**values).status_code, 400)
        self.assertBalance(0)

    def test_repeat_request_does_not_duplicate(self):
        values = dict(request_id=str(uuid.uuid4()), occurred_at=timezone.now().isoformat())
        first, second = self.post(**values), self.post(**values)
        self.assertEqual(first.status_code, 201)
        self.assertEqual(first.data['id'], second.data['id'])
        self.assertBalance(60)
        self.assertEqual(self.post(**values, pieces=1).status_code, 400)

    def test_historical_balance_and_moscow_day(self):
        self.receipt(60, self.t0)
        move_stock(product_id=self.product.id,kind='expense',quantity=-17,occurred_at=self.t0+timedelta(days=2))
        day = (self.t0+timedelta(days=1)).date().isoformat()
        self.assertEqual(self.client.get('/api/inventory/products/', {'as_of':day}).data['results'][0]['balance'],60)
        self.assertBalance(43)
        from .views import day_bound
        self.assertEqual(day_bound('2026-01-01').utcoffset(), timedelta(hours=3))
        self.assertEqual(day_bound('2026-01-01',end=True).day,2)
        self.assertEqual(self.client.get('/api/inventory/products/',{'as_of':'invalid'}).status_code,400)

    def test_backdated_expense_cannot_break_intermediate_balance(self):
        self.receipt(10,self.t0)
        move_stock(product_id=self.product.id,kind='expense',quantity=-9,occurred_at=self.t0+timedelta(days=1))
        self.receipt(30,self.t0+timedelta(days=2))
        with self.assertRaises(ValidationError):
            move_stock(product_id=self.product.id,kind='expense',quantity=-2,occurred_at=self.t0+timedelta(hours=5))
        self.assertBalance(31)

    def test_reversal_once_and_retains_original(self):
        self.receipt()
        expense=move_stock(product_id=self.product.id,kind='expense',quantity=-17)
        reversal=reverse_movement(expense.id,self.staff,'Ошибка количества')
        self.assertEqual(reversal.quantity,17)
        with self.assertRaises(ValidationError):
            reverse_movement(expense.id,self.staff,'Повтор')
        self.assertTrue(StockMovement.objects.filter(pk=expense.pk).exists())
        self.assertBalance(60)

    def test_cannot_reverse_receipt_already_spent(self):
        receipt=self.receipt(10)
        move_stock(product_id=self.product.id,kind='expense',quantity=-3)
        with self.assertRaises(ValidationError):
            reverse_movement(receipt.id,self.staff,'Ошибка поставки')
        self.assertBalance(7)

    def test_packaging_change_preserves_history(self):
        movement=self.receipt()
        response=self.client.patch(f'/api/inventory/products/{self.product.id}/packaging/',{'units_per_box':10},format='json')
        self.assertEqual(response.status_code,200)
        self.assertBalance(60)
        movement.refresh_from_db()
        self.assertEqual(movement.units_per_box,12)
        self.assertEqual(self.client.get('/api/inventory/products/').data['results'][0]['boxes'],6)
        self.assertEqual(self.client.patch(f'/api/inventory/products/{self.product.id}/packaging/',{'units_per_box':0},format='json').status_code,400)

    def test_only_staff_can_read_and_write(self):
        self.client.force_authenticate(self.customer)
        for path in ['overview/','products/','movements/']:
            self.assertEqual(self.client.get('/api/inventory/'+path).status_code,403)
        self.assertEqual(self.post().status_code,403)
        self.client.force_authenticate(None)
        self.assertEqual(self.client.get('/api/inventory/products/').status_code,401)
        self.assertBalance(0)

    def test_new_product_and_search(self):
        payload=dict(name='Лейка',sku='SHOWER-2',category=self.category.id,units_per_box=8,price='500.00',stock_quantity=999)
        response=self.client.post('/api/inventory/products/',payload,format='json')
        self.assertEqual(response.status_code,201)
        self.assertEqual(response.data['stock_quantity'],0)
        self.assertEqual(self.client.post('/api/inventory/products/',payload,format='json').status_code,400)
        self.assertEqual(self.client.get('/api/inventory/products/',{'search':'SHOWER-2'}).data['count'],1)

    def checkout(self, quantity=4):
        cart,_=Cart.objects.get_or_create(user=self.customer)
        CartItem.objects.create(cart=cart, product=self.product,quantity=quantity)
        self.client.force_authenticate(self.customer)
        return self.client.post('/api/orders/',dict(delivery_method='pickup',phone='+79990000002',email='customer@local.test',payment_method='cash'),format='json')

    def test_order_expense_and_cancel_return_once(self):
        self.receipt()
        response=self.checkout()
        self.assertEqual(response.status_code,201,response.data)
        self.assertBalance(56)
        order=Order.objects.get(pk=response.data['id'])
        stale=Order.objects.get(pk=order.pk)
        self.assertEqual(order.stock_movements.filter(kind='sale').count(),1)
        self.assertTrue(order.cancel())
        self.assertFalse(stale.cancel())
        self.assertBalance(60)
        self.assertEqual(order.stock_movements.filter(kind='return').count(),1)

    def test_payment_does_not_spend_again(self):
        self.receipt()
        response=self.checkout()
        order=Order.objects.get(pk=response.data['id'])
        order.mark_as_paid()
        order.mark_as_paid()
        self.assertBalance(56)
        self.assertEqual(order.stock_movements.filter(kind='sale').count(),1)

    def test_repeat_checkout_does_not_spend_again(self):
        self.receipt()
        self.checkout()
        response=self.client.post('/api/orders/',dict(delivery_method='pickup',phone='+79990000002',email='customer@local.test',payment_method='cash'),format='json')
        self.assertEqual(response.status_code,400)
        self.assertBalance(56)
        self.assertEqual(Order.objects.count(),1)

    def test_recheck_stock_after_serializer_validation(self):
        self.receipt(5)
        cart=Cart.objects.create(user=self.customer)
        CartItem.objects.create(cart=cart,product=self.product,quantity=4)
        request=APIRequestFactory().post('/api/orders/')
        request.user=self.customer
        serializer=OrderCreateSerializer(data=dict(delivery_method='pickup',phone='+79990000002',email='customer@local.test',payment_method='cash'),context={'request':request})
        self.assertTrue(serializer.is_valid(),serializer.errors)
        move_stock(product_id=self.product.id,kind='expense',quantity=-3)
        with self.assertRaises(ValidationError):
            serializer.save()
        self.assertEqual(Order.objects.count(),0)
        self.assertEqual(cart.items.count(),1)
        self.assertBalance(2)

    def test_cannot_bypass_order_cancel_or_delete(self):
        self.receipt()
        response=self.checkout()
        pk=response.data['id']
        self.assertEqual(self.client.patch(f'/api/orders/{pk}/',{'status':'cancelled'},format='json').status_code,405)
        self.assertEqual(self.client.delete(f'/api/orders/{pk}/').status_code,405)
        self.assertBalance(56)

    def test_filters_and_immutable_journal(self):
        receipt=self.receipt()
        self.assertEqual(self.client.get('/api/inventory/movements/', {'kind':'receipt','search':'TAP-01'}).data['count'],1)
        self.assertEqual(self.client.get('/api/inventory/movements/',{'date_from':'2026-10-01','date_to':'2026-09-01'}).status_code,400)
        self.assertEqual(self.client.delete('/api/inventory/movements/').status_code,405)
        self.assertEqual(self.client.patch('/api/inventory/movements/',{'quantity':100},format='json').status_code,405)
        self.assertBalance(60)

    def test_old_stock_import_gets_opening_balance(self):
        Product.objects.filter(pk=self.product.pk).update(stock_quantity=7)
        move_stock(product_id=self.product.pk,kind='expense',quantity=-2)
        self.assertBalance(5)
        self.assertEqual(StockMovement.objects.get(kind='opening').quantity,7)

    def test_history_before_start_is_not_reported_as_zero(self):
        self.receipt()
        response=self.client.get('/api/inventory/products/',{'as_of':(self.t0-timedelta(days=1)).date().isoformat()})
        self.assertEqual(response.status_code,400)

    def test_staff_status_cancel_routes_through_ledger(self):
        self.receipt()
        response=self.checkout()
        order_id=response.data['id']
        self.client.force_authenticate(self.staff)
        response=self.client.patch(f'/api/orders/{order_id}/update_status/',{'status':'cancelled'},format='json')
        self.assertEqual(response.status_code,200,response.data)
        self.assertBalance(60)
        response=self.client.patch(f'/api/orders/{order_id}/update_status/',{'status':'processing'},format='json')
        self.assertEqual(response.status_code,400)
        self.assertBalance(60)

    def test_cannot_reverse_automatic_order_movement(self):
        self.receipt()
        response=self.checkout()
        sale=StockMovement.objects.get(order_id=response.data['id'],kind='sale')
        self.client.force_authenticate(self.staff)
        response=self.client.post(f'/api/inventory/movements/{sale.id}/reverse/',{'note':'Недопустимое исправление'},format='json')
        self.assertEqual(response.status_code,400)
        self.assertBalance(56)

    def test_multiple_products_checkout_rolls_back_completely(self):
        self.receipt(10)
        second=Product.objects.create(name='Второй',slug='second',category=self.category,price='5')
        move_stock(product_id=second.id,kind='receipt',quantity=1)
        cart=Cart.objects.create(user=self.customer)
        CartItem.objects.create(cart=cart,product=self.product,quantity=2)
        CartItem.objects.create(cart=cart,product=second,quantity=1)
        request=APIRequestFactory().post('/api/orders/')
        request.user=self.customer
        serializer=OrderCreateSerializer(data=dict(delivery_method='pickup',phone='+79990000002',email='customer@local.test',payment_method='cash'),context={'request':request})
        self.assertTrue(serializer.is_valid())
        move_stock(product_id=second.id,kind='expense',quantity=-1)
        with self.assertRaises(ValidationError):
            serializer.save()
        self.assertEqual(Order.objects.count(),0)
        self.assertEqual(cart.items.count(),2)
        self.assertBalance(10)
        self.assertEqual(StockMovement.objects.filter(kind='sale').count(),0)

    def test_exact_decimal_total(self):
        response=self.post(boxes=0,pieces=3,unit_price='0.10')
        self.assertEqual(response.status_code,201)
        self.assertEqual(Decimal(response.data['total']),Decimal('0.30'))

    def test_moscow_filters_include_end_of_day(self):
        from .views import day_bound
        stamp=day_bound((timezone.now()-timedelta(days=3)).date().isoformat(),end=True)-timedelta(seconds=1)
        movement=self.receipt(3,stamp)
        day=stamp.date().isoformat()
        results=self.client.get('/api/inventory/movements/',{'date_from':day,'date_to':day}).data['results']
        self.assertEqual([row['id'] for row in results],[movement.pk])

    def test_stale_payment_does_not_reopen_cancelled_order(self):
        self.receipt()
        response=self.checkout()
        order=Order.objects.get(pk=response.data['id'])
        stale=Order.objects.get(pk=order.pk)
        order.cancel()
        stale.mark_as_paid()
        stale.refresh_from_db()
        self.assertEqual(stale.status,'cancelled')
        self.assertFalse(stale.cancel())
        self.assertBalance(60)

    def test_inconsistent_stock_is_rejected(self):
        self.receipt(10)
        Product.objects.filter(pk=self.product.pk).update(stock_quantity=99)
        with self.assertRaises(ValidationError):
            move_stock(product_id=self.product.id,kind='expense',quantity=-2)
        self.assertEqual(StockMovement.objects.count(),1)

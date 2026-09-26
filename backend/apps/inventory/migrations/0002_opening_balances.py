from django.db import migrations
from django.utils import timezone


def opening_balances(apps, schema_editor):
    Product = apps.get_model('catalog', 'Product')
    Movement = apps.get_model('inventory', 'StockMovement')
    now = timezone.now()
    for product in Product.objects.using(schema_editor.connection.alias).filter(stock_quantity__gt=0).iterator():
        Movement.objects.using(schema_editor.connection.alias).create(
            product_id=product.pk, kind='opening', quantity=product.stock_quantity,
            units_per_box=product.units_per_box, unit_price=0,
            occurred_at=now, note='Остаток на дату подключения складского учёта. Более ранняя история неизвестна.')


class Migration(migrations.Migration):
    dependencies = [('inventory', '0001_initial')]
    operations = [migrations.RunPython(opening_balances)]

# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0004_remove_brand_logo'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='sku',
            field=models.CharField(blank=True, max_length=100, verbose_name='Артикул (Код товара)'),
        ),
        migrations.AddField(
            model_name='product',
            name='specifications',
            field=models.JSONField(blank=True, default=dict, help_text="JSON объект с характеристиками (например: {'Материал': 'Латунь', 'Механизм': 'Керамический картридж'})", verbose_name='Характеристики товара'),
        ),
        migrations.AddField(
            model_name='product',
            name='country_of_origin',
            field=models.CharField(blank=True, max_length=100, verbose_name='Страна бренда'),
        ),
        migrations.AddField(
            model_name='product',
            name='warranty_months',
            field=models.PositiveIntegerField(default=12, verbose_name='Гарантия (месяцев)'),
        ),
    ]

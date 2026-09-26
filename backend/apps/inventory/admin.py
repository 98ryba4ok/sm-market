from django.contrib import admin
from .models import StockMovement


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ['occurred_at', 'product', 'kind', 'quantity', 'unit_price', 'actor', 'order']
    list_filter = ['kind', 'occurred_at']
    search_fields = ['product__name', 'product__sku', 'order__order_number']
    readonly_fields = [field.name for field in StockMovement._meta.fields]
    def has_add_permission(self, request):
        return False
    def has_change_permission(self, request, obj=None):
        return False
    def has_delete_permission(self, request, obj=None):
        return False

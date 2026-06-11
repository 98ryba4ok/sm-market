from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CartViewSet, OrderViewSet, PromoCodeViewSet, YooKassaWebhookView

app_name = 'orders'

router = DefaultRouter()
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'promo-codes', PromoCodeViewSet, basename='promo-code')

urlpatterns = [
    path('', include(router.urls)),
    path('webhook/yookassa/', YooKassaWebhookView.as_view(), name='yookassa-webhook'),
]
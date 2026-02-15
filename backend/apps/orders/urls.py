from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CartViewSet, OrderViewSet, PromoCodeViewSet

app_name = 'orders'

router = DefaultRouter()
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'promo-codes', PromoCodeViewSet, basename='promo-code')

urlpatterns = [
    path('', include(router.urls)),
]
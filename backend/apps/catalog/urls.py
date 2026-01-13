from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet,
    ProductViewSet,
    ProductReviewViewSet,
    WishlistViewSet,
    BrandViewSet,
    BannerViewSet,
    ConsultationRequestViewSet
)

app_name = 'catalog'

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'reviews', ProductReviewViewSet, basename='review')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'brands', BrandViewSet, basename='brand')
router.register(r'banners', BannerViewSet, basename='banner')
router.register(r'consultation-requests', ConsultationRequestViewSet, basename='consultation-request')

urlpatterns = [
    path('', include(router.urls)),
]
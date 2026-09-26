from django.urls import path
from .views import ProductsView, MovementsView, ReverseView, OverviewView, PackagingView

urlpatterns = [
    path('overview/', OverviewView.as_view()),
    path('products/', ProductsView.as_view()),
    path('products/<int:pk>/packaging/', PackagingView.as_view()),
    path('movements/', MovementsView.as_view()),
    path('movements/<int:pk>/reverse/', ReverseView.as_view()),
]

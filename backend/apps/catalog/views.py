from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg
from .models import Category, Product, ProductReview, Wishlist, Banner, Brand, ConsultationRequest
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductReviewSerializer,
    WishlistSerializer,
    WishlistAddRemoveSerializer,
    BannerSerializer,
    BrandSerializer,
    ConsultationRequestSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для категорий товаров
    
    list: Получить список всех активных категорий
    retrieve: Получить детальную информацию о категории
    products: Получить товары категории
    """
    queryset = Category.objects.filter(is_active=True).prefetch_related('subcategories')
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        """Получить только корневые категории для списка"""
        if self.action == 'list':
            return self.queryset.filter(parent=None)
        return self.queryset
    
    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        """Получить товары категории (включая подкатегории)"""
        category = self.get_object()
        
        # Получить все ID категорий (текущая + все дочерние)
        category_ids = [category.id] + [c.id for c in category.get_all_children()]
        
        # Получить товары из этих категорий
        products = Product.objects.filter(
            category_id__in=category_ids,
            is_active=True
        ).select_related('category').prefetch_related('images')
        
        # Применить фильтры и сортировку
        products = self._apply_filters(products, request)
        
        # Пагинация
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = ProductListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)
    
    def _apply_filters(self, queryset, request):
        """Применить фильтры к товарам"""
        # Фильтр по цене
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Фильтр по наличию
        in_stock = request.query_params.get('in_stock')
        if in_stock == 'true':
            queryset = queryset.filter(stock_quantity__gt=0)
        
        # Фильтр по скидке
        on_sale = request.query_params.get('on_sale')
        if on_sale == 'true':
            queryset = queryset.filter(discount_price__isnull=False)

        # Сортировка
        ordering = request.query_params.get('ordering', '-created_at')

        # Для сортировки по проценту скидки добавляем аннотацию
        if ordering in ['discount_percentage', '-discount_percentage']:
            from django.db.models import F, ExpressionWrapper, DecimalField, Case, When, Value

            queryset = queryset.annotate(
                discount_percent=Case(
                    When(
                        discount_price__isnull=False,
                        discount_price__lt=F('price'),
                        then=ExpressionWrapper(
                            (F('price') - F('discount_price')) * 100 / F('price'),
                            output_field=DecimalField()
                        )
                    ),
                    default=Value(0),
                    output_field=DecimalField()
                )
            ).order_by('-discount_percent' if ordering == '-discount_percentage' else 'discount_percent')
        else:
            allowed_orderings = [
                'price', '-price', 'name', '-name',
                'created_at', '-created_at', 'views_count', '-views_count'
            ]
            if ordering in allowed_orderings:
                queryset = queryset.order_by(ordering)
        
        return queryset


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для товаров
    
    list: Получить список товаров с фильтрацией и поиском
    retrieve: Получить детальную информацию о товаре (по ID или slug)
    reviews: Получить отзывы о товаре
    """
    queryset = Product.objects.filter(is_active=True).select_related('category')
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'views_count', 'name']
    ordering = ['-created_at']
    
    def get_object(self):
        """Получить товар по ID или slug"""
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_value = self.kwargs[lookup_url_kwarg]
        
        # Попробовать найти по ID (если это число)
        if lookup_value.isdigit():
            filter_kwargs = {'id': int(lookup_value)}
        else:
            # Иначе искать по slug
            filter_kwargs = {'slug': lookup_value}
        
        obj = queryset.filter(**filter_kwargs).first()
        
        if obj is None:
            from rest_framework.exceptions import NotFound
            raise NotFound('No Product matches the given query.')
        
        # May raise a permission denied
        self.check_object_permissions(self.request, obj)
        
        return obj
    
    def get_serializer_class(self):
        """Выбрать сериализатор в зависимости от действия"""
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer
    
    def get_queryset(self):
        """Применить фильтры к queryset"""
        queryset = super().get_queryset()
        
        # Для списка - prefetch images
        if self.action == 'list':
            queryset = queryset.prefetch_related('images')
        # Для детальной страницы - prefetch images и reviews
        elif self.action == 'retrieve':
            queryset = queryset.prefetch_related(
                'images',
                'reviews__user'
            )
        
        # Фильтр по категории
        category_slug = self.request.query_params.get('category')
        if category_slug:
            try:
                category = Category.objects.get(slug=category_slug)
                category_ids = [category.id] + [c.id for c in category.get_all_children()]
                queryset = queryset.filter(category_id__in=category_ids)
            except Category.DoesNotExist:
                pass
        
        # Фильтр по цене
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Фильтр по наличию
        in_stock = self.request.query_params.get('in_stock')
        if in_stock == 'true':
            queryset = queryset.filter(stock_quantity__gt=0)
        
        # Фильтр по скидке
        on_sale = self.request.query_params.get('on_sale')
        if on_sale == 'true':
            queryset = queryset.filter(discount_price__isnull=False)
        
        # Фильтр по рейтингу
        min_rating = self.request.query_params.get('min_rating')
        if min_rating:
            queryset = queryset.annotate(
                avg_rating=Avg('reviews__rating')
            ).filter(avg_rating__gte=min_rating)
        
        # Фильтр по бренду
        brand_id = self.request.query_params.get('brand')
        if brand_id:
            queryset = queryset.filter(brand_id=brand_id)
        
        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        """Получить товар и увеличить счетчик просмотров"""
        instance = self.get_object()
        instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        """Получить отзывы о товаре"""
        product = self.get_object()
        reviews = product.reviews.select_related('user').order_by('-created_at')
        
        # Пагинация
        page = self.paginate_queryset(reviews)
        if page is not None:
            serializer = ProductReviewSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = ProductReviewSerializer(reviews, many=True)
        return Response(serializer.data)


class ProductReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet для отзывов о товарах
    
    list: Получить список отзывов пользователя
    create: Создать отзыв
    retrieve: Получить отзыв
    update/partial_update: Обновить отзыв
    destroy: Удалить отзыв
    """
    serializer_class = ProductReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        """Получить отзывы текущего пользователя"""
        if self.request.user.is_authenticated:
            return ProductReview.objects.filter(
                user=self.request.user
            ).select_related('product', 'user').order_by('-created_at')
        return ProductReview.objects.none()
    
    def perform_create(self, serializer):
        """Создать отзыв от имени текущего пользователя"""
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        """Обновить отзыв"""
        serializer.save()
    
    def destroy(self, request, *args, **kwargs):
        """Удалить отзыв"""
        instance = self.get_object()
        
        # Проверить, что пользователь - автор отзыва
        if instance.user != request.user:
            return Response(
                {'detail': 'Вы можете удалять только свои отзывы'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class WishlistViewSet(viewsets.ViewSet):
    """
    ViewSet для списка желаний
    
    list: Получить список желаний пользователя
    add: Добавить товар в список желаний
    remove: Удалить товар из списка желаний
    clear: Очистить список желаний
    """
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """Получить список желаний"""
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add(self, request):
        """Добавить товар в список желаний"""
        serializer = WishlistAddRemoveSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        product_id = serializer.validated_data['product_id']
        
        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response(
                {'detail': 'Товар не найден'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        
        if product in wishlist.products.all():
            return Response(
                {'detail': 'Товар уже в списке желаний'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        wishlist.products.add(product)
        
        return Response(
            {'detail': 'Товар добавлен в список желаний'},
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['post'])
    def remove(self, request):
        """Удалить товар из списка желаний"""
        serializer = WishlistAddRemoveSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        product_id = serializer.validated_data['product_id']
        
        try:
            wishlist = Wishlist.objects.get(user=request.user)
        except Wishlist.DoesNotExist:
            return Response(
                {'detail': 'Список желаний пуст'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {'detail': 'Товар не найден'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if product not in wishlist.products.all():
            return Response(
                {'detail': 'Товар не найден в списке желаний'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        wishlist.products.remove(product)
        
        return Response(
            {'detail': 'Товар удален из списка желаний'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['post'])
    def clear(self, request):
        """Очистить список желаний"""
        try:
            wishlist = Wishlist.objects.get(user=request.user)
            wishlist.products.clear()
            return Response(
                {'detail': 'Список желаний очищен'},
                status=status.HTTP_200_OK
            )
        except Wishlist.DoesNotExist:
            return Response(
                {'detail': 'Список желаний пуст'},
                status=status.HTTP_404_NOT_FOUND
            )


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для брендов

    list: Получить список активных брендов
    retrieve: Получить конкретный бренд
    """
    queryset = Brand.objects.filter(is_active=True).order_by('order', 'name')
    serializer_class = BrandSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = None  # Отключаем пагинацию для брендов
    lookup_field = 'slug'


class BannerViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet для баннеров главной страницы

    list: Получить список активных баннеров
    retrieve: Получить конкретный баннер
    """
    queryset = Banner.objects.filter(is_active=True).order_by('order', '-created_at')
    serializer_class = BannerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = None  # Отключаем пагинацию для баннеров


class ConsultationRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet для заявок на консультацию
    
    create: Создать новую заявку
    list: Получить список всех заявок (только для администраторов)
    retrieve: Получить детальную информацию о заявке (только для администраторов)
    """
    queryset = ConsultationRequest.objects.all()
    serializer_class = ConsultationRequestSerializer
    
    def get_permissions(self):
        """
        Создание заявки доступно всем
        Просмотр заявок только для администраторов
        """
        if self.action == 'create':
            from rest_framework.permissions import AllowAny
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def create(self, request, *args, **kwargs):
        """Создание новой заявки на консультацию"""
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(
            {
                'detail': 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
                'data': serializer.data
            },
            status=status.HTTP_201_CREATED
        )

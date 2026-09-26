import uuid
from datetime import datetime, time, timedelta
from zoneinfo import ZoneInfo
from django.db import transaction
from django.db.models import Q, Sum, IntegerField, Value, F
from django.db.models.functions import Coalesce
from django.utils import timezone
from rest_framework import generics, serializers, status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from apps.catalog.models import Product, Category
from .models import StockMovement
from .serializers import StockProductSerializer, NewProductSerializer, MovementInputSerializer, MovementSerializer
from .services import move_stock, reverse_movement

MOSCOW = ZoneInfo('Europe/Moscow')


def day_bound(value, end=False):
    try:
        day = datetime.strptime(value, '%Y-%m-%d').date()
    except (ValueError, TypeError):
        raise serializers.ValidationError('Дата должна быть в формате ГГГГ-ММ-ДД.')
    return datetime.combine(day + timedelta(days=1 if end else 0), time.min, tzinfo=MOSCOW)


class StockPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100


class ProductsView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    pagination_class = StockPagination
    serializer_class = StockProductSerializer
    def get_queryset(self):
        products = Product.objects.select_related('category').order_by('name', 'id')
        query = self.request.query_params.get('search', '').strip()
        if query:
            products = products.filter(Q(name__icontains=query) | Q(sku__icontains=query))
        as_of = self.request.query_params.get('as_of')
        if not as_of:
            return products.annotate(balance=F('stock_quantity'))
        cutoff = day_bound(as_of, end=True)
        earliest = StockMovement.objects.order_by('occurred_at').values_list('occurred_at', flat=True).first()
        if earliest and cutoff <= earliest:
            raise serializers.ValidationError('На эту дату история складского учёта ещё не велась. Выберите более позднюю дату.')
        if StockMovement.objects.filter(kind='opening', occurred_at__gte=cutoff).exists():
            raise serializers.ValidationError('Для части товаров начальный остаток зарегистрирован позже выбранной даты. Более ранний остаток неизвестен.')
        if products.filter(stock_quantity__gt=0, stock_movements__isnull=True).exists():
            raise serializers.ValidationError('Есть товары без начальной записи учёта. Исторический остаток для них неизвестен.')
        condition = Q(stock_movements__occurred_at__lt=cutoff)
        return products.annotate(balance=Coalesce(Sum('stock_movements__quantity', filter=condition), Value(0), output_field=IntegerField()))
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = NewProductSerializer(data=request.data)
        data.is_valid(raise_exception=True)
        product = Product.objects.create(**data.validated_data, slug=f'item-{uuid.uuid4().hex[:16]}', description='')
        product.balance = 0
        return Response(StockProductSerializer(product).data, status=status.HTTP_201_CREATED)


class MovementsView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    pagination_class = StockPagination
    serializer_class = MovementSerializer
    def get_queryset(self):
        rows = StockMovement.objects.select_related('product', 'actor', 'order', 'reversal')
        params = self.request.query_params
        if params.get('search'):
            rows = rows.filter(Q(product__name__icontains=params['search']) | Q(product__sku__icontains=params['search']) | Q(order__order_number__icontains=params['search']))
        if params.get('kind'):
            rows = rows.filter(kind=params['kind'])
        if params.get('date_from'):
            rows = rows.filter(occurred_at__gte=day_bound(params['date_from']))
        if params.get('date_to'):
            rows = rows.filter(occurred_at__lt=day_bound(params['date_to'], end=True))
        if params.get('date_from') and params.get('date_to') and params['date_from'] > params['date_to']:
            raise serializers.ValidationError('Начало периода позже конца.')
        return rows
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = MovementInputSerializer(data=request.data)
        data.is_valid(raise_exception=True)
        values = data.validated_data
        product = Product.objects.select_for_update().get(pk=values['product'].pk)
        quantity = values['boxes'] * product.units_per_box + values['pieces']
        movement = move_stock(product_id=product.pk, kind=values['kind'],
            quantity=quantity if values['kind'] == 'receipt' else -quantity,
            unit_price=values['unit_price'], occurred_at=values['occurred_at'],
            note=values['note'], actor=request.user, request_id=values['request_id'])
        return Response(MovementSerializer(movement).data, status=status.HTTP_201_CREATED)


class ReverseView(APIView):
    permission_classes = [IsAdminUser]
    def post(self, request, pk):
        if not StockMovement.objects.filter(pk=pk).exists():
            return Response({'detail': 'Операция не найдена.'}, status=404)
        note = serializers.CharField(max_length=500).run_validation(request.data.get('note'))
        movement = reverse_movement(pk, request.user, note)
        return Response(MovementSerializer(movement).data, status=201)


class OverviewView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        start = day_bound(timezone.now().astimezone(MOSCOW).date().isoformat())
        today = StockMovement.objects.filter(occurred_at__gte=start)
        return Response({
            'products': Product.objects.count(),
            'units': Product.objects.aggregate(total=Sum('stock_quantity'))['total'] or 0,
            'empty': Product.objects.filter(stock_quantity=0).count(),
            'received_today': today.filter(quantity__gt=0).aggregate(total=Sum('quantity'))['total'] or 0,
            'spent_today': -(today.filter(quantity__lt=0).aggregate(total=Sum('quantity'))['total'] or 0),
            'started_at': StockMovement.objects.order_by('occurred_at').values_list('occurred_at', flat=True).first(),
            'categories': list(Category.objects.order_by('name').values('id', 'name')),
            'employee': request.user.get_full_name(),
        })


class PackagingView(APIView):
    permission_classes = [IsAdminUser]
    @transaction.atomic
    def patch(self, request, pk):
        try:
            product = Product.objects.select_for_update().get(pk=pk)
        except Product.DoesNotExist:
            return Response({'detail': 'Товар не найден.'}, status=404)
        pack = serializers.IntegerField(min_value=1, max_value=1000000).run_validation(request.data.get('units_per_box'))
        product.units_per_box = pack
        product.save(update_fields=['units_per_box'])
        return Response({'units_per_box': pack})

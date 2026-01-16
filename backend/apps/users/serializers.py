from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, PasswordResetToken, EmailChangeRequest, EmailConfirmationToken
from apps.orders.utils import merge_guest_cart_with_user_cart


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=True, allow_blank=False, error_messages={
        'required': 'Имя обязательно для заполнения',
        'blank': 'Имя не может быть пустым'
    })
    last_name = serializers.CharField(required=True, allow_blank=False, error_messages={
        'required': 'Фамилия обязательна для заполнения',
        'blank': 'Фамилия не может быть пустой'
    })
    middle_name = serializers.CharField(required=True, allow_blank=False, error_messages={
        'required': 'Отчество обязательно для заполнения',
        'blank': 'Отчество не может быть пустым'
    })

    class Meta:
        model = User
        fields = ("email", "phone", "password", "first_name", "last_name", "middle_name")

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует.")
        return value

    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Пользователь с таким телефоном уже существует.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)

        # Слияние гостевой корзины с корзиной нового пользователя
        request = self.context.get('request')
        if request and hasattr(request, 'session'):
            session_key = request.session.session_key
            if session_key:
                merge_guest_cart_with_user_cart(session_key, user)

        # Генерируем токены для автоматического входа после регистрации
        refresh = RefreshToken.for_user(user)

        # Добавляем токены к данным пользователя
        user.tokens = {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data["email"],  # здесь username это email
            password=data["password"],
        )

        if not user:
            raise serializers.ValidationError("Email или пароль неверны.")  # более дружелюбное сообщение

        # Слияние гостевой корзины с корзиной пользователя
        request = self.context.get('request')
        if request and hasattr(request, 'session'):
            session_key = request.session.session_key
            if session_key:
                merge_guest_cart_with_user_cart(session_key, user)

        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'phone', 'first_name', 'last_name', 'middle_name',
            'full_name', 'is_active', 'is_staff', 'date_joined'
        ]
        read_only_fields = ['id', 'is_active', 'is_staff', 'date_joined']
    
    def get_full_name(self, obj):
        return obj.get_full_name()


class UserUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления профиля пользователя"""
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'middle_name', 'phone']
    
    def validate_phone(self, value):
        user = self.context['request'].user
        if User.objects.filter(phone=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("Этот номер телефона уже используется.")
        return value


class ChangeEmailSerializer(serializers.Serializer):
    """Сериализатор для смены email"""
    new_email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate_new_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Этот email уже используется.")
        return value
    
    def validate(self, data):
        user = self.context['request'].user
        if not user.check_password(data['password']):
            raise serializers.ValidationError({"password": "Неверный пароль."})
        return data


class ChangePasswordSerializer(serializers.Serializer):
    """Сериализатор для смены пароля"""
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Неверный текущий пароль.")
        return value
    
    def validate_new_password(self, value):
        try:
            validate_password(value, self.context['request'].user)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value
    
    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Пароли не совпадают."})
        if data['old_password'] == data['new_password']:
            raise serializers.ValidationError({"new_password": "Новый пароль должен отличаться от текущего."})
        return data


class PasswordResetRequestSerializer(serializers.Serializer):
    """Сериализатор для запроса сброса пароля"""
    email = serializers.EmailField()
    
    def validate_email(self, value):
        if not User.objects.filter(email=value, is_active=True).exists():
            raise serializers.ValidationError("Пользователь с таким email не найден.")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Сериализатор для подтверждения сброса пароля"""
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    def validate_token(self, value):
        try:
            token_obj = PasswordResetToken.objects.get(token=value)
            if not token_obj.is_valid():
                raise serializers.ValidationError("Токен недействителен или истек.")
            self.context['token_obj'] = token_obj
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError("Недействительный токен.")
        return value
    
    def validate_new_password(self, value):
        token_obj = self.context.get('token_obj')
        if token_obj:
            try:
                validate_password(value, token_obj.user)
            except DjangoValidationError as e:
                raise serializers.ValidationError(list(e.messages))
        return value
    
    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Пароли не совпадают."})
        return data



class EmailChangeRequestSerializer(serializers.Serializer):
    """Сериализатор для запроса смены email"""
    new_email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate_new_email(self, value):
        # Проверяем, не занят ли новый email
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Этот email уже используется.")
        return value
    
    def validate(self, data):
        user = self.context['request'].user
        
        # Проверяем пароль
        if not user.check_password(data['password']):
            raise serializers.ValidationError({"password": "Неверный пароль."})
        
        # Проверяем, нет ли активного запроса на смену
        active_request = EmailChangeRequest.objects.filter(
            user=user,
            status__in=['pending_old', 'pending_new']
        ).first()
        
        if active_request:
            raise serializers.ValidationError(
                "У вас уже есть активный запрос на смену email. "
                "Завершите его или дождитесь истечения срока действия."
            )
        
        # Проверяем, не было ли недавней смены (блокировка на 7 дней)
        from django.utils import timezone
        from datetime import timedelta
        
        recent_change = EmailChangeRequest.objects.filter(
            user=user,
            status='completed',
            completed_at__gte=timezone.now() - timedelta(days=7)
        ).first()
        
        if recent_change:
            days_left = 7 - (timezone.now() - recent_change.completed_at).days
            raise serializers.ValidationError(
                f"Вы недавно меняли email. Повторная смена возможна через {days_left} дней."
            )
        
        return data


class EmailConfirmationSerializer(serializers.Serializer):
    """Сериализатор для подтверждения email (старого или нового)"""
    token = serializers.CharField()
    
    def validate_token(self, value):
        print(f"[DEBUG EmailConfirmationSerializer] Validating token: {value[:20]}...")
        
        try:
            token_obj = EmailConfirmationToken.objects.get(token=value)
            print(f"[DEBUG] Token found: type={token_obj.email_type}, is_used={token_obj.is_used}, expires_at={token_obj.expires_at}")
            
            if not token_obj.is_valid():
                print(f"[ERROR] Token is invalid: is_used={token_obj.is_used}, expired={token_obj.expires_at < timezone.now()}")
                raise serializers.ValidationError("Токен недействителен или истек.")
            
            # Проверяем статус запроса
            request = token_obj.email_change_request
            print(f"[DEBUG] Email change request status: {request.status}, token_type: {token_obj.email_type}")
            
            if token_obj.email_type == 'old' and request.status != 'pending_old':
                print(f"[ERROR] Old email token used but status is {request.status}, not pending_old")
                raise serializers.ValidationError("Этот токен уже был использован.")
            
            if token_obj.email_type == 'new' and request.status != 'pending_new':
                print(f"[ERROR] New email token used but status is {request.status}, not pending_new")
                raise serializers.ValidationError("Сначала подтвердите старый email.")
            
            self.context['token_obj'] = token_obj
            self.context['email_change_request'] = request
            print(f"[DEBUG] Token validation successful")
            
        except EmailConfirmationToken.DoesNotExist:
            print(f"[ERROR] Token not found in database")
            raise serializers.ValidationError("Недействительный токен.")
        
        return value


class EmailCancellationSerializer(serializers.Serializer):
    """Сериализатор для отмены смены email"""
    cancel_token = serializers.CharField()
    
    def validate_cancel_token(self, value):
        try:
            request = EmailChangeRequest.objects.get(cancel_token=value)
            
            if not request.can_be_cancelled():
                raise serializers.ValidationError(
                    "Невозможно отменить смену email. "
                    "Либо срок отмены истек, либо запрос не завершен."
                )
            
            self.context['email_change_request'] = request
            
        except EmailChangeRequest.DoesNotExist:
            raise serializers.ValidationError("Недействительный токен отмены.")
        
        return value

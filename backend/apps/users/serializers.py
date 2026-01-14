from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, PasswordResetToken
from apps.orders.utils import merge_guest_cart_with_user_cart


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("email", "phone", "password")

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

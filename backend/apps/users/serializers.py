from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
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
    class Meta:
        model = User
        fields = ['id', 'email', 'phone', 'is_active', 'is_staff', 'date_joined']
        read_only_fields = [
            'id',
            'email',
            'phone',
            'is_active',
            'is_staff',
            'date_joined',
        ]

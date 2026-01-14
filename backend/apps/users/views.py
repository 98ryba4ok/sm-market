from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer,
    UserUpdateSerializer, ChangeEmailSerializer, ChangePasswordSerializer,
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer
)
from .models import User, PasswordResetToken

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)

            # дополнительная защита: токен должен принадлежать пользователю
            if token["user_id"] != request.user.id:
                return Response(status=status.HTTP_403_FORBIDDEN)

            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)

        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        # Возвращаем токены для автоматического входа после регистрации
        return Response(
            {
                "email": user.email,
                "phone": user.phone,
                "refresh": user.tokens["refresh"],
                "access": user.tokens["access"],
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    def perform_create(self, serializer):
        return serializer.save()


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)


class RefreshView(TokenRefreshView):
    permission_classes = [AllowAny]





class UserProfileView(APIView):
    """Get current user profile"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UserUpdateView(APIView):
    """Update user profile (name, phone)"""
    permission_classes = [IsAuthenticated]
    
    def patch(self, request):
        serializer = UserUpdateSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Возвращаем обновленный профиль
        user_serializer = UserSerializer(request.user)
        return Response({
            'detail': 'Профиль успешно обновлен',
            'user': user_serializer.data
        })


class ChangeEmailView(APIView):
    """Change user email"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangeEmailSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        # Обновляем email
        request.user.email = serializer.validated_data['new_email']
        request.user.save()
        
        return Response({
            'detail': 'Email успешно изменен',
            'email': request.user.email
        })


class ChangePasswordView(APIView):
    """Change user password"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        # Устанавливаем новый пароль
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        
        return Response({
            'detail': 'Пароль успешно изменен'
        })


class PasswordResetRequestView(APIView):
    """Request password reset (send email with token)"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        user = User.objects.get(email=email, is_active=True)
        
        # Генерируем токен
        token_obj = PasswordResetToken.generate_token(user)
        
        # Формируем ссылку для сброса
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        reset_link = f"{frontend_url}/password-reset/{token_obj.token}"
        
        # Отправляем email
        try:
            subject = 'Сброс пароля - SM Market'
            html_message = f"""
            <html>
            <body>
                <h2>Сброс пароля</h2>
                <p>Здравствуйте!</p>
                <p>Вы запросили сброс пароля для вашего аккаунта в SM Market.</p>
                <p>Для сброса пароля перейдите по ссылке:</p>
                <p><a href="{reset_link}">{reset_link}</a></p>
                <p>Ссылка действительна в течение 24 часов.</p>
                <p>Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.</p>
                <br>
                <p>С уважением,<br>Команда SM Market</p>
            </body>
            </html>
            """
            plain_message = strip_tags(html_message)
            
            send_mail(
                subject,
                plain_message,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                html_message=html_message,
                fail_silently=False,
            )
            
            return Response({
                'detail': 'Инструкции по сбросу пароля отправлены на ваш email'
            })
        except Exception as e:
            # В случае ошибки отправки email все равно возвращаем успех
            # (чтобы не раскрывать существование email)
            print(f"Error sending email: {e}")
            return Response({
                'detail': 'Инструкции по сбросу пароля отправлены на ваш email'
            })


class PasswordResetConfirmView(APIView):
    """Confirm password reset with token"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token_obj = serializer.context['token_obj']
        
        # Устанавливаем новый пароль
        user = token_obj.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        # Помечаем токен как использованный
        token_obj.is_used = True
        token_obj.save()
        
        return Response({
            'detail': 'Пароль успешно изменен. Теперь вы можете войти с новым паролем.'
        })

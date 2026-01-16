from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import EmailChangeRequest, EmailConfirmationToken, User
from .serializers import (
    EmailChangeRequestSerializer,
    EmailConfirmationSerializer,
    EmailCancellationSerializer
)
from .utils import (
    get_client_ip,
    send_old_email_confirmation,
    send_new_email_confirmation,
    send_email_changed_notifications
)


class EmailChangeRequestView(APIView):
    """
    Инициирует процесс смены email
    POST /api/users/email-change/request/
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = EmailChangeRequestSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        # Получаем метаданные
        ip_address = get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        # Создаем запрос на смену
        email_change_request = EmailChangeRequest.create_request(
            user=request.user,
            new_email=serializer.validated_data['new_email'],
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        # Генерируем токен для подтверждения старого email
        old_token = EmailConfirmationToken.generate_token(
            email_change_request=email_change_request,
            email_type='old',
            email=request.user.email
        )
        
        # Отправляем письмо на старый email
        try:
            print(f"[DEBUG] Attempting to send email to: {request.user.email}")
            print(f"[DEBUG] Token: {old_token.token}")
            send_old_email_confirmation(request.user, email_change_request, old_token.token)
            print(f"[DEBUG] Email sent successfully to: {request.user.email}")
        except Exception as e:
            print(f"[ERROR] Error sending old email confirmation: {e}")
            import traceback
            traceback.print_exc()
            return Response(
                {'detail': 'Не удалось отправить письмо подтверждения'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            'detail': 'Письмо с подтверждением отправлено на ваш текущий email',
            'request_id': email_change_request.id,
            'status': email_change_request.status
        })


class ConfirmOldEmailView(APIView):
    """
    Подтверждает старый email
    POST /api/users/email-change/confirm-old/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = EmailConfirmationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token_obj = serializer.context['token_obj']
        email_change_request = serializer.context['email_change_request']
        
        # Помечаем токен как использованный
        token_obj.mark_as_used()
        
        # Подтверждаем старый email
        email_change_request.confirm_old_email()
        
        # Генерируем токен для подтверждения нового email
        new_token = EmailConfirmationToken.generate_token(
            email_change_request=email_change_request,
            email_type='new',
            email=email_change_request.new_email
        )
        
        # Отправляем письмо на новый email
        try:
            send_new_email_confirmation(
                email_change_request.user,
                email_change_request,
                new_token.token
            )
        except Exception as e:
            print(f"Error sending new email confirmation: {e}")
            return Response(
                {'detail': 'Не удалось отправить письмо на новый email'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            'detail': 'Старый email подтвержден. Письмо отправлено на новый email.',
            'next_step': 'confirm_new',
            'new_email_masked': f"{email_change_request.new_email[:2]}***@{email_change_request.new_email.split('@')[1]}"
        })


class ConfirmNewEmailView(APIView):
    """
    Подтверждает новый email и завершает смену
    POST /api/users/email-change/confirm-new/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        print(f"[DEBUG ConfirmNewEmailView] Received token: {request.data.get('token')}")
        
        serializer = EmailConfirmationSerializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            print(f"[ERROR ConfirmNewEmailView] Validation failed: {e}")
            print(f"[ERROR ConfirmNewEmailView] Validation errors: {serializer.errors}")
            raise
        
        token_obj = serializer.context['token_obj']
        email_change_request = serializer.context['email_change_request']
        user = email_change_request.user
        
        print(f"[DEBUG ConfirmNewEmailView] Token type: {token_obj.email_type}")
        print(f"[DEBUG ConfirmNewEmailView] Request status: {email_change_request.status}")
        print(f"[DEBUG ConfirmNewEmailView] Token is_used: {token_obj.is_used}")
        print(f"[DEBUG ConfirmNewEmailView] Token expires_at: {token_obj.expires_at}")
        
        # Помечаем токен как использованный
        token_obj.mark_as_used()
        
        # Подтверждаем новый email и меняем email пользователя
        email_change_request.confirm_new_email()
        
        # Отправляем уведомление только на СТАРЫЙ email
        # (на новый уже было отправлено письмо с подтверждением в ConfirmOldEmailView)
        try:
            from .utils import send_mail
            from django.utils.html import strip_tags
            
            user_name = user.get_full_name() or user.email
            formatted_datetime = email_change_request.completed_at.strftime('%d.%m.%Y в %H:%M:%S UTC')
            cancel_until = email_change_request.can_cancel_until.strftime('%d.%m.%Y в %H:%M:%S UTC')
            
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
            cancel_link = f"{frontend_url}/email-change/cancel/{email_change_request.cancel_token}"
            
            # Письмо на СТАРЫЙ email
            subject_old = 'Email вашего аккаунта изменен - SM Market'
            html_message_old = f"""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #f8f9fa; padding: 30px; border-radius: 8px;">
                    <h2 style="color: #333; margin-top: 0;">Email вашего аккаунта изменен</h2>
                    
                    <p style="font-size: 16px; color: #555;">
                        Здравствуйте, <strong>{user_name}</strong>!
                    </p>
                    
                    <p style="font-size: 16px; color: #555;">
                        Ваш email успешно изменен:
                    </p>
                    
                    <div style="background: white; padding: 20px; border-radius: 5px; margin: 25px 0; border-left: 4px solid #28a745;">
                        <p style="margin: 5px 0; font-size: 15px;">
                            <strong>Старый:</strong> {email_change_request.old_email}
                        </p>
                        <p style="margin: 5px 0; font-size: 15px;">
                            <strong>Новый:</strong> {email_change_request.new_email}
                        </p>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 5px; margin: 25px 0; border-left: 4px solid #007bff;">
                        <p style="margin: 5px 0; font-size: 15px;">
                            <strong>Дата и время:</strong> {formatted_datetime}
                        </p>
                        <p style="margin: 5px 0; font-size: 15px;">
                            <strong>IP-адрес:</strong> {email_change_request.ip_address}
                        </p>
                    </div>
                    
                    <div style="background: #fff3cd; padding: 20px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 25px 0;">
                        <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold; color: #856404;">
                            ЭТО ПОСЛЕДНЕЕ ПИСЬМО НА ЭТОТ АДРЕС
                        </p>
                        <p style="margin: 0 0 15px 0; font-size: 15px; color: #856404;">
                            Если это были НЕ вы, у вас есть 48 часов для отмены смены и восстановления доступа:
                        </p>
                        <a href="{cancel_link}"
                           style="display: inline-block; padding: 14px 28px; background: #dc3545;
                                  color: white; text-decoration: none; border-radius: 5px;
                                  font-weight: bold; font-size: 15px;">
                            Отменить смену и восстановить доступ
                        </a>
                        <p style="margin: 15px 0 0 0; font-size: 13px; color: #856404;">
                            Отмена возможна до: <strong>{cancel_until}</strong>
                        </p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
                    
                    <p style="color: #999; font-size: 13px; margin: 0;">
                        С уважением,<br>
                        Команда <strong>SM Market</strong>
                    </p>
                </div>
            </body>
            </html>
            """
            
            plain_message_old = strip_tags(html_message_old)
            
            send_mail(
                subject_old,
                plain_message_old,
                settings.DEFAULT_FROM_EMAIL,
                [email_change_request.old_email],
                html_message=html_message_old,
                fail_silently=False,
            )
        except Exception as e:
            print(f"Error sending email changed notification to old email: {e}")
            # Не прерываем процесс, email уже изменен
        
        # Завершаем все активные сессии пользователя для безопасности
        # (пользователю нужно будет войти заново с новым email)
        try:
            # Добавляем текущий refresh token в blacklist
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception as e:
            print(f"Error blacklisting token: {e}")
        
        return Response({
            'detail': 'Email успешно изменен. Войдите заново с новым email.',
            'new_email': user.email,
            'can_cancel_until': email_change_request.can_cancel_until.isoformat(),
            'logout_required': True
        })


class CancelEmailChangeView(APIView):
    """
    Отменяет смену email (в течение 48 часов)
    POST /api/users/email-change/cancel/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = EmailCancellationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email_change_request = serializer.context['email_change_request']
        user = email_change_request.user
        
        try:
            # Отменяем смену (откатываем email)
            email_change_request.cancel()
            
            # Блокируем аккаунт для безопасности
            user.is_active = False
            user.save()
            
            # Генерируем токен для сброса пароля
            from .models import PasswordResetToken
            reset_token = PasswordResetToken.generate_token(user)
            
            # Отправляем ссылку восстановления на старый email
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
            reset_link = f"{frontend_url}/password-reset/{reset_token.token}"
            
            from .utils import send_password_reset_link_email
            try:
                send_password_reset_link_email(user, reset_link)
            except Exception as e:
                print(f"Error sending password reset link: {e}")
            
            return Response({
                'detail': 'Смена email отменена. Аккаунт заблокирован для безопасности. '
                         'Ссылка для восстановления доступа отправлена на ваш email.',
                'account_blocked': True,
                'reset_link_sent': True
            })
            
        except ValueError as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class EmailChangeStatusView(APIView):
    """
    Получить статус текущего запроса на смену email
    GET /api/users/email-change/status/
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Ищем активный запрос
        active_request = EmailChangeRequest.objects.filter(
            user=request.user,
            status__in=['pending_old', 'pending_new', 'completed']
        ).order_by('-created_at').first()
        
        if not active_request:
            return Response({
                'has_active_request': False,
                'detail': 'Нет активных запросов на смену email'
            })
        
        # Проверяем, можно ли отменить
        can_cancel = active_request.can_be_cancelled()
        
        return Response({
            'has_active_request': True,
            'request_id': active_request.id,
            'old_email': active_request.old_email,
            'new_email': active_request.new_email,
            'status': active_request.status,
            'old_email_confirmed': active_request.old_email_confirmed,
            'new_email_confirmed': active_request.new_email_confirmed,
            'created_at': active_request.created_at.isoformat(),
            'completed_at': active_request.completed_at.isoformat() if active_request.completed_at else None,
            'can_cancel': can_cancel,
            'can_cancel_until': active_request.can_cancel_until.isoformat() if can_cancel else None
        })
from django.core.mail import send_mail
from django.conf import settings
from django.utils.html import strip_tags
from django.utils import timezone


def get_client_ip(request):
    """
    Получает IP-адрес клиента из request
    
    Args:
        request: HTTP request объект
        
    Returns:
        str: IP-адрес клиента
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR', 'Unknown')
    return ip


def send_password_changed_email(user, request, compromised_token):
    """
    Отправляет email-уведомление о смене пароля с защищенной ссылкой
    
    Args:
        user: User объект
        request: HTTP request для получения IP и метаданных
        compromised_token: Токен для восстановления доступа при взломе
    """
    # Получаем IP-адрес
    ip_address = get_client_ip(request)
    
    # Получаем текущую дату и время
    change_datetime = timezone.now()
    formatted_datetime = change_datetime.strftime('%d.%m.%Y в %H:%M:%S UTC')
    
    # Формируем защищенную ссылку с токеном
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
    reset_link = f"{frontend_url}/account-compromised/{compromised_token}"
    
    # Получаем имя пользователя
    user_name = user.get_full_name() or user.email
    
    # HTML-шаблон письма
    subject = 'Пароль вашего аккаунта изменен - SM Market'
    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8f9fa; padding: 30px; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0;">Пароль вашего аккаунта изменен</h2>
            
            <p style="font-size: 16px; color: #555;">
                Здравствуйте, <strong>{user_name}</strong>!
            </p>
            
            <p style="font-size: 16px; color: #555;">
                Ваш пароль был успешно изменен.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 5px; margin: 25px 0; border-left: 4px solid #28a745;">
                <p style="margin: 5px 0; font-size: 15px;">
                    <strong>Дата и время:</strong> {formatted_datetime}
                </p>
                <p style="margin: 5px 0; font-size: 15px;">
                    <strong>IP-адрес:</strong> {ip_address}
                </p>
            </div>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 25px 0;">
                <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #856404;">
                    Если это были не вы:
                </p>
                <p style="margin: 0 0 15px 0; font-size: 15px; color: #856404;">
                    Немедленно восстановите доступ к аккаунту, нажав на кнопку ниже.
                    Мы автоматически отправим вам ссылку для сброса пароля.
                </p>
                <a href="{reset_link}" 
                   style="display: inline-block; padding: 14px 28px; background: #dc3545; 
                          color: white; text-decoration: none; border-radius: 5px; 
                          font-weight: bold; font-size: 15px;">
                    Восстановить доступ
                </a>
                <p style="margin: 15px 0 0 0; font-size: 13px; color: #856404;">
                    Эта ссылка действительна в течение 24 часов и может быть использована только один раз.
                </p>
            </div>
            
            <p style="margin-top: 25px; color: #666; font-size: 14px; line-height: 1.6;">
                Если вы изменили пароль самостоятельно, можете проигнорировать это письмо.
                Ваш аккаунт в безопасности.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
            
            <p style="color: #999; font-size: 13px; margin: 0;">
                С уважением,<br>
                Команда <strong>SM Market</strong>
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 15px;">
                Это автоматическое письмо. Пожалуйста, не отвечайте на него.
            </p>
        </div>
    </body>
    </html>
    """
    
    # Plain text версия (для клиентов без поддержки HTML)
    plain_message = strip_tags(html_message)
    
    # Отправляем email
    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_password_reset_link_email(user, reset_link):
    """
    Отправляет ссылку для сброса пароля после валидации токена взлома
    
    Args:
        user: User объект
        reset_link: Ссылка для сброса пароля
    """
    user_name = user.get_full_name() or user.email
    
    subject = 'Ссылка для сброса пароля - SM Market'
    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8f9fa; padding: 30px; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0;">Сброс пароля</h2>
            
            <p style="font-size: 16px; color: #555;">
                Здравствуйте, <strong>{user_name}</strong>!
            </p>
            
            <p style="font-size: 16px; color: #555;">
                Вы запросили восстановление доступа к аккаунту после несанкционированной смены пароля.
            </p>
            
            <p style="font-size: 16px; color: #555;">
                Для создания нового пароля перейдите по ссылке:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{reset_link}" 
                   style="display: inline-block; padding: 14px 28px; background: #007bff; 
                          color: white; text-decoration: none; border-radius: 5px; 
                          font-weight: bold; font-size: 15px;">
                    Создать новый пароль
                </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">
                Ссылка действительна в течение 24 часов.
            </p>
            
            <p style="font-size: 14px; color: #666;">
                Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
            
            <p style="color: #999; font-size: 13px; margin: 0;">
                С уважением,<br>
                Команда <strong>SM Market</strong>
            </p>
        </div>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_old_email_confirmation(user, email_change_request, token):
    """
    Отправляет письмо на старый email для подтверждения смены
    
    Args:
        user: User объект
        email_change_request: EmailChangeRequest объект
        token: Токен подтверждения
    """
    user_name = user.get_full_name() or user.email
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
    confirm_link = f"{frontend_url}/email-change/confirm-old/{token}"
    block_link = f"{frontend_url}/account-compromised/{token}"  # Используем существующий механизм
    
    formatted_datetime = email_change_request.created_at.strftime('%d.%m.%Y в %H:%M:%S UTC')
    
    subject = 'Подтверждение смены email - SM Market'
    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8f9fa; padding: 30px; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0;">Подтверждение смены email</h2>
            
            <p style="font-size: 16px; color: #555;">
                Здравствуйте, <strong>{user_name}</strong>!
            </p>
            
            <p style="font-size: 16px; color: #555;">
                Вы запросили смену email адреса с:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 5px; margin: 25px 0; border-left: 4px solid #007bff;">
                <p style="margin: 5px 0; font-size: 15px;">
                    <strong>Старый:</strong> {email_change_request.old_email}
                </p>
                <p style="margin: 5px 0; font-size: 15px;">
                    <strong>Новый:</strong> {email_change_request.new_email}
                </p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 5px; margin: 25px 0; border-left: 4px solid #28a745;">
                <p style="margin: 5px 0; font-size: 15px;">
                    <strong>Дата и время:</strong> {formatted_datetime}
                </p>
                <p style="margin: 5px 0; font-size: 15px;">
                    <strong>IP-адрес:</strong> {email_change_request.ip_address}
                </p>
            </div>
            
            <p style="font-size: 16px; color: #555;">
                Если это были вы, подтвердите, что вы действительно хотите сменить email адрес:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{confirm_link}"
                   style="display: inline-block; padding: 14px 28px; background: #007bff;
                          color: white; text-decoration: none; border-radius: 5px;
                          font-weight: bold; font-size: 15px;">
                    Да, подтверждаю смену email
                </a>
            </div>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 25px 0;">
                <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #856404;">
                    Если это были НЕ вы:
                </p>
                <p style="margin: 0 0 15px 0; font-size: 15px; color: #856404;">
                    Немедленно заблокируйте аккаунт и восстановите доступ:
                </p>
                <a href="{block_link}" 
                   style="display: inline-block; padding: 14px 28px; background: #dc3545; 
                          color: white; text-decoration: none; border-radius: 5px; 
                          font-weight: bold; font-size: 15px;">
                    Это был не я - заблокировать
                </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">
                Ссылка действительна в течение 24 часов.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
            
            <p style="color: #999; font-size: 13px; margin: 0;">
                С уважением,<br>
                Команда <strong>SM Market</strong>
            </p>
        </div>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [email_change_request.old_email],
        html_message=html_message,
        fail_silently=False,
    )


def send_new_email_confirmation(user, email_change_request, token):
    """
    Отправляет письмо на новый email для подтверждения владения
    
    Args:
        user: User объект
        email_change_request: EmailChangeRequest объект
        token: Токен подтверждения
    """
    user_name = user.get_full_name() or user.email
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
    confirm_link = f"{frontend_url}/email-change/confirm-new/{token}"
    
    subject = 'Подтвердите владение email - SM Market'
    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8f9fa; padding: 30px; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0;">Подтвердите владение email</h2>
            
            <p style="font-size: 16px; color: #555;">
                Здравствуйте!
            </p>
            
            <p style="font-size: 16px; color: #555;">
                Этот email привязывается к аккаунту <strong>{user_name}</strong> в SM Market.
            </p>
            
            <p style="font-size: 16px; color: #555;">
                Для завершения процесса подтвердите владение этим адресом:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{confirm_link}" 
                   style="display: inline-block; padding: 14px 28px; background: #28a745; 
                          color: white; text-decoration: none; border-radius: 5px; 
                          font-weight: bold; font-size: 15px;">
                    Подтвердить
                </a>
            </div>
            
            <p style="font-size: 14px; color: #666;">
                Если вы не запрашивали это, просто проигнорируйте письмо.
            </p>
            
            <p style="font-size: 14px; color: #666;">
                Ссылка действительна в течение 24 часов.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
            
            <p style="color: #999; font-size: 13px; margin: 0;">
                С уважением,<br>
                Команда <strong>SM Market</strong>
            </p>
        </div>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [email_change_request.new_email],
        html_message=html_message,
        fail_silently=False,
    )


def send_email_changed_notifications(user, email_change_request):
    """
    Отправляет уведомления на оба email после завершения смены
    
    Args:
        user: User объект
        email_change_request: EmailChangeRequest объект
    """
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
    
    # Письмо на НОВЫЙ email
    subject_new = 'Email успешно подтвержден - SM Market'
    html_message_new = f"""
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8f9fa; padding: 30px; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0;">Email успешно подтвержден</h2>
            
            <p style="font-size: 16px; color: #555;">
                Здравствуйте, <strong>{user_name}</strong>!
            </p>
            
            <p style="font-size: 16px; color: #555;">
                Теперь <strong>{email_change_request.new_email}</strong> привязан к вашему аккаунту в SM Market.
            </p>
            
            <div style="background: #d4edda; padding: 20px; border-radius: 5px; border-left: 4px solid #28a745; margin: 25px 0;">
                <p style="margin: 0; font-size: 15px; color: #155724;">
                    Все уведомления теперь будут приходить на этот адрес.
                </p>
            </div>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 25px 0;">
                <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #856404;">
                    Для безопасности:
                </p>
                <p style="margin: 0; font-size: 15px; color: #856404;">
                    Все активные сессии завершены. Войдите заново с новым email.
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
    
    # Отправляем оба письма
    plain_message_old = strip_tags(html_message_old)
    plain_message_new = strip_tags(html_message_new)
    
    send_mail(
        subject_old,
        plain_message_old,
        settings.DEFAULT_FROM_EMAIL,
        [email_change_request.old_email],
        html_message=html_message_old,
        fail_silently=False,
    )
    
    send_mail(
        subject_new,
        plain_message_new,
        settings.DEFAULT_FROM_EMAIL,
        [email_change_request.new_email],
        html_message=html_message_new,
        fail_silently=False,
    )
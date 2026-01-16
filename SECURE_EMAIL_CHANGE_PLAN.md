# План безопасной смены Email

## 🎯 Цель
Реализовать безопасный процесс смены email с двойным подтверждением и возможностью отката в течение 48 часов.

## 📊 Текущее состояние

### Проблемы текущей реализации:
- ❌ Email меняется мгновенно без подтверждения
- ❌ Нет проверки владения новым email
- ❌ Нет уведомлений на старый email
- ❌ Невозможно отменить смену
- ❌ Нет защиты от частых смен

### Текущий код (ChangeEmailView):
```python
def post(self, request):
    serializer = ChangeEmailSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    
    # Обновляем email СРАЗУ - это небезопасно!
    request.user.email = serializer.validated_data['new_email']
    request.user.save()
    
    return Response({'detail': 'Email успешно изменен'})
```

## 🏗️ Архитектура решения

### 1. Модели данных

#### EmailChangeRequest
Хранит запросы на смену email с периодом отката:

```python
class EmailChangeRequest(models.Model):
    user = ForeignKey(User)
    old_email = EmailField()  # Старый email (для отката)
    new_email = EmailField()  # Новый email
    
    # Статусы подтверждения
    old_email_confirmed = BooleanField(default=False)
    old_email_confirmed_at = DateTimeField(null=True)
    new_email_confirmed = BooleanField(default=False)
    new_email_confirmed_at = DateTimeField(null=True)
    
    # Временные метки
    created_at = DateTimeField(auto_now_add=True)
    completed_at = DateTimeField(null=True)  # Когда смена завершена
    can_cancel_until = DateTimeField()  # До какого времени можно отменить (48ч)
    
    # Статус запроса
    status = CharField(choices=[
        ('pending_old', 'Ожидает подтверждения старого email'),
        ('pending_new', 'Ожидает подтверждения нового email'),
        ('completed', 'Завершено'),
        ('cancelled', 'Отменено'),
        ('expired', 'Истекло')
    ])
    
    # Метаданные безопасности
    ip_address = GenericIPAddressField()
    user_agent = TextField()
    
    # Токены для отмены
    cancel_token = CharField(max_length=100, unique=True)
```

#### EmailConfirmationToken
Токены для подтверждения email (старого и нового):

```python
class EmailConfirmationToken(models.Model):
    email_change_request = ForeignKey(EmailChangeRequest)
    token = CharField(max_length=100, unique=True)
    email_type = CharField(choices=[
        ('old', 'Старый email'),
        ('new', 'Новый email')
    ])
    email = EmailField()  # Email, для которого создан токен
    
    created_at = DateTimeField(auto_now_add=True)
    expires_at = DateTimeField()  # 24 часа
    is_used = BooleanField(default=False)
    used_at = DateTimeField(null=True)
```

### 2. API Endpoints

#### POST /api/users/email-change/request/
Инициирует процесс смены email:
- **Input**: `{new_email, password}`
- **Действия**:
  1. Проверить пароль
  2. Проверить, что new_email не занят
  3. Проверить, нет ли активного запроса на смену (блокировка на 7 дней)
  4. Создать EmailChangeRequest
  5. Создать 2 токена (для старого и нового email)
  6. Отправить письмо на СТАРЫЙ email
- **Output**: `{detail, request_id}`

#### POST /api/users/email-change/confirm-old/
Подтверждает старый email:
- **Input**: `{token}`
- **Действия**:
  1. Валидировать токен
  2. Пометить old_email_confirmed = True
  3. Отправить письмо на НОВЫЙ email
- **Output**: `{detail, next_step: 'confirm_new'}`

#### POST /api/users/email-change/confirm-new/
Подтверждает новый email и завершает смену:
- **Input**: `{token}`
- **Действия**:
  1. Валидировать токен
  2. Пометить new_email_confirmed = True
  3. **ИЗМЕНИТЬ EMAIL ПОЛЬЗОВАТЕЛЯ**
  4. Установить can_cancel_until = now + 48h
  5. Отправить уведомления на ОБА email
  6. Завершить все активные сессии (logout)
- **Output**: `{detail, can_cancel_until}`

#### POST /api/users/email-change/cancel/
Отменяет смену email (в течение 48ч):
- **Input**: `{cancel_token}`
- **Действия**:
  1. Валидировать токен и срок
  2. Откатить email на старый
  3. Заблокировать аккаунт
  4. Принудительно сбросить пароль
  5. Отправить ссылку восстановления на СТАРЫЙ email
- **Output**: `{detail, reset_link_sent: true}`

#### GET /api/users/email-change/status/
Получить статус текущего запроса на смену:
- **Output**: `{status, old_email_confirmed, new_email_confirmed, can_cancel_until}`

### 3. User Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Пользователь запрашивает смену email                     │
│    POST /email-change/request/                              │
│    Input: {new_email, password}                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Отправка письма на СТАРЫЙ email                          │
│    Тема: "Подтвердите смену email"                          │
│    Содержание:                                              │
│    - Вы запросили смену на new@mail.com                     │
│    - Дата/время, IP-адрес                                   │
│    - [Подтвердить смену] [Это был не я]                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Пользователь подтверждает СТАРЫЙ email                   │
│    POST /email-change/confirm-old/                          │
│    Input: {token}                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Отправка письма на НОВЫЙ email                           │
│    Тема: "Подтвердите владение email"                       │
│    Содержание:                                              │
│    - Этот email привязывается к аккаунту                    │
│    - [Подтвердить владение]                                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Пользователь подтверждает НОВЫЙ email                    │
│    POST /email-change/confirm-new/                          │
│    Input: {token}                                           │
│    ✅ EMAIL ИЗМЕНЕН!                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Уведомления на ОБА email                                 │
│                                                             │
│ На СТАРЫЙ email:                                            │
│ - "Email изменен с old@mail.com на new@mail.com"           │
│ - "Это последнее письмо на этот адрес"                     │
│ - [Отменить смену] (действует 48ч)                         │
│                                                             │
│ На НОВЫЙ email:                                             │
│ - "Email успешно подтвержден"                               │
│ - "Теперь все уведомления будут приходить сюда"            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Период отката (48 часов)                                 │
│    - Старый email сохранен в БД                             │
│    - Можно отменить по ссылке из письма                     │
│    - После 48ч старый email удаляется                       │
└─────────────────────────────────────────────────────────────┘
```

### 4. Email-уведомления

#### 4.1. Письмо на СТАРЫЙ email (шаг 2)
```
Тема: Подтвердите смену email - SM Market

Здравствуйте, {user_name}!

Вы запросили смену email с:
old@mail.com → new@mail.com

Детали запроса:
📅 Дата: 16.01.2026 14:30
🌐 IP: 192.168.1.1

Если это были вы, подтвердите смену:
[Подтвердить смену]

⚠️ Если это были НЕ вы:
[Это был не я - заблокировать аккаунт]

Ссылка действительна 24 часа.
```

#### 4.2. Письмо на НОВЫЙ email (шаг 4)
```
Тема: Подтвердите владение email - SM Market

Здравствуйте!

Этот email привязывается к аккаунту SM Market.

Для завершения процесса подтвердите владение:
[Подтвердить владение]

Если вы не запрашивали это, проигнорируйте письмо.

Ссылка действительна 24 часа.
```

#### 4.3. Уведомление на СТАРЫЙ email (шаг 6)
```
Тема: Email вашего аккаунта изменен - SM Market

Ваш email успешно изменен:
old@mail.com → new@mail.com

Детали:
📅 Дата: 16.01.2026 14:35
🌐 IP: 192.168.1.1

⚠️ ЭТО ПОСЛЕДНЕЕ ПИСЬМО НА ЭТОТ АДРЕС

Если это были НЕ вы, у вас есть 48 часов для отмены:
[Отменить смену и восстановить доступ]

После 16.01.2026 14:35 отмена будет невозможна.
```

#### 4.4. Уведомление на НОВЫЙ email (шаг 6)
```
Тема: Email успешно подтвержден - SM Market

Здравствуйте, {user_name}!

Теперь new@mail.com привязан к вашему аккаунту.

Все уведомления будут приходить на этот адрес.

Для безопасности все активные сессии завершены.
Войдите заново с новым email.
```

### 5. Правила безопасности

#### 5.1. Валидация
- ✅ Требовать текущий пароль
- ✅ Проверять, не занят ли новый email
- ✅ Блокировать повторную смену на 7 дней после завершения
- ✅ Блокировать смену, если есть активный запрос
- ✅ Проверять формат email

#### 5.2. Ограничения
- Максимум 1 активный запрос на смену
- Блокировка повторной смены: 7 дней
- Срок действия токенов: 24 часа
- Период отката: 48 часов
- Максимум 3 попытки смены в месяц

#### 5.3. Действия при отмене
1. Заблокировать аккаунт (is_active = False)
2. Откатить email на старый
3. Принудительно сбросить пароль
4. Завершить все сессии
5. Отправить ссылку восстановления на СТАРЫЙ email
6. Создать запись в логе безопасности

### 6. Модели состояний

#### EmailChangeRequest.status
- `pending_old` → Ожидает подтверждения старого email
- `pending_new` → Ожидает подтверждения нового email
- `completed` → Смена завершена (период отката активен)
- `cancelled` → Отменено пользователем
- `expired` → Истек срок действия токенов

#### Переходы состояний
```
pending_old → pending_new (после подтверждения старого)
pending_new → completed (после подтверждения нового)
* → cancelled (при отмене)
* → expired (при истечении срока)
```

## 📋 План реализации

### Этап 1: Backend - Модели и миграции
- [ ] Создать модель EmailChangeRequest
- [ ] Создать модель EmailConfirmationToken
- [ ] Создать миграции
- [ ] Добавить индексы для производительности
- [ ] Зарегистрировать в admin.py

### Этап 2: Backend - Утилиты
- [ ] Создать функции отправки email:
  - `send_old_email_confirmation()`
  - `send_new_email_confirmation()`
  - `send_email_changed_notifications()`
  - `send_cancellation_notification()`
- [ ] Создать функцию проверки ограничений
- [ ] Создать функцию отката email

### Этап 3: Backend - API Views
- [ ] EmailChangeRequestView (POST /email-change/request/)
- [ ] ConfirmOldEmailView (POST /email-change/confirm-old/)
- [ ] ConfirmNewEmailView (POST /email-change/confirm-new/)
- [ ] CancelEmailChangeView (POST /email-change/cancel/)
- [ ] EmailChangeStatusView (GET /email-change/status/)

### Этап 4: Backend - Serializers
- [ ] EmailChangeRequestSerializer
- [ ] EmailConfirmationSerializer
- [ ] EmailCancellationSerializer

### Этап 5: Backend - URLs
- [ ] Добавить все новые endpoints в urls.py

### Этап 6: Frontend - API методы
- [ ] requestEmailChange()
- [ ] confirmOldEmail()
- [ ] confirmNewEmail()
- [ ] cancelEmailChange()
- [ ] getEmailChangeStatus()

### Этап 7: Frontend - UI компоненты
- [ ] Обновить форму смены email в ProfilePage
- [ ] Создать EmailChangeStatusModal (показывает статус)
- [ ] Создать ConfirmOldEmailPage
- [ ] Создать ConfirmNewEmailPage
- [ ] Создать CancelEmailChangePage

### Этап 8: Frontend - Роутинг
- [ ] /email-change/confirm-old/:token
- [ ] /email-change/confirm-new/:token
- [ ] /email-change/cancel/:token

### Этап 9: Тестирование
- [ ] Тест полного флоу смены email
- [ ] Тест отмены смены
- [ ] Тест истечения токенов
- [ ] Тест ограничений (повторная смена)
- [ ] Тест безопасности (чужой токен)

### Этап 10: Документация
- [ ] Обновить API документацию
- [ ] Создать руководство для пользователей
- [ ] Создать инструкцию для тестирования

## 🔒 Критические моменты безопасности

1. **Двойное подтверждение обязательно** - нельзя менять email без подтверждения обоих адресов
2. **Период отката критичен** - 48 часов дают время обнаружить взлом
3. **Блокировка при отмене** - если пользователь отменяет смену, значит аккаунт скомпрометирован
4. **Завершение сессий** - после смены email все сессии должны быть завершены
5. **Ограничение частоты** - нельзя менять email слишком часто

## 📊 Метрики успеха

- ✅ 100% смен email проходят двойное подтверждение
- ✅ 0 случаев смены без подтверждения владения
- ✅ Возможность отката в течение 48 часов
- ✅ Автоматическая блокировка при подозрительной активности
- ✅ Все действия логируются для аудита

## 🎯 Следующие шаги

1. Получить одобрение плана от пользователя
2. Начать реализацию с Этапа 1 (Backend - Модели)
3. Последовательно пройти все этапы
4. Провести тщательное тестирование
5. Задеплоить в production

---

**Важно**: Этот план обеспечивает максимальную безопасность при смене email, которая является критической операцией для аккаунта пользователя.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User, PasswordResetToken, AccountCompromisedToken, EmailChangeRequest, EmailConfirmationToken


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'get_full_name', 'phone', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_active', 'date_joined')
    search_fields = ('email', 'phone', 'first_name', 'last_name')
    ordering = ('-date_joined',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'middle_name', 'phone')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'phone', 'first_name', 'last_name', 'password1', 'password2', 'is_staff', 'is_active'),
        }),
    )

    readonly_fields = ('date_joined', 'last_login')
    
    def get_full_name(self, obj):
        return obj.get_full_name()
    get_full_name.short_description = 'ФИО'


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token_preview', 'created_at', 'expires_at', 'is_used', 'is_valid_status')
    list_filter = ('is_used', 'created_at', 'expires_at')
    search_fields = ('user__email', 'token')
    readonly_fields = ('token', 'created_at', 'expires_at')
    ordering = ('-created_at',)
    
    def token_preview(self, obj):
        return f"{obj.token[:20]}..." if len(obj.token) > 20 else obj.token
    token_preview.short_description = 'Токен'
    
    def is_valid_status(self, obj):
        return obj.is_valid()
    is_valid_status.boolean = True
    is_valid_status.short_description = 'Действителен'


@admin.register(AccountCompromisedToken)
class AccountCompromisedTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token_preview', 'ip_address', 'created_at', 'expires_at', 'is_used', 'is_valid_status')
    list_filter = ('is_used', 'created_at', 'expires_at')
    search_fields = ('user__email', 'token', 'ip_address')
    readonly_fields = ('token', 'created_at', 'expires_at', 'ip_address')
    ordering = ('-created_at',)
    
    def token_preview(self, obj):
        return f"{obj.token[:20]}..." if len(obj.token) > 20 else obj.token
    token_preview.short_description = 'Токен'
    
    def is_valid_status(self, obj):
        return obj.is_valid()
    is_valid_status.boolean = True
    is_valid_status.short_description = 'Действителен'



@admin.register(EmailChangeRequest)
class EmailChangeRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'old_email', 'new_email', 'status', 'created_at', 'can_cancel_until', 'can_cancel_status')
    list_filter = ('status', 'old_email_confirmed', 'new_email_confirmed', 'created_at')
    search_fields = ('user__email', 'old_email', 'new_email', 'ip_address')
    readonly_fields = ('cancel_token', 'created_at', 'completed_at', 'old_email_confirmed_at', 'new_email_confirmed_at', 'ip_address', 'user_agent')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('user', 'old_email', 'new_email', 'status')
        }),
        ('Подтверждения', {
            'fields': ('old_email_confirmed', 'old_email_confirmed_at', 'new_email_confirmed', 'new_email_confirmed_at')
        }),
        ('Временные метки', {
            'fields': ('created_at', 'completed_at', 'can_cancel_until')
        }),
        ('Безопасность', {
            'fields': ('cancel_token', 'ip_address', 'user_agent')
        }),
    )
    
    def can_cancel_status(self, obj):
        return obj.can_be_cancelled()
    can_cancel_status.boolean = True
    can_cancel_status.short_description = 'Можно отменить'


@admin.register(EmailConfirmationToken)
class EmailConfirmationTokenAdmin(admin.ModelAdmin):
    list_display = ('email', 'email_type', 'token_preview', 'created_at', 'expires_at', 'is_used', 'is_valid_status')
    list_filter = ('email_type', 'is_used', 'created_at', 'expires_at')
    search_fields = ('email', 'token', 'email_change_request__user__email')
    readonly_fields = ('token', 'created_at', 'expires_at', 'used_at')
    ordering = ('-created_at',)
    
    def token_preview(self, obj):
        return f"{obj.token[:20]}..." if len(obj.token) > 20 else obj.token
    token_preview.short_description = 'Токен'
    
    def is_valid_status(self, obj):
        return obj.is_valid()
    is_valid_status.boolean = True
    is_valid_status.short_description = 'Действителен'

from django.urls import path

from .views import (
    RegisterView, LoginView, RefreshView, LogoutView, UserProfileView,
    UserUpdateView, ChangeEmailView, ChangePasswordView,
    PasswordResetRequestView, PasswordResetConfirmView
)

urlpatterns = [
    # Authentication
    path("register/", RegisterView.as_view(), name='register'),
    path("login/", LoginView.as_view(), name='login'),
    path("refresh/", RefreshView.as_view(), name='refresh'),
    path("logout/", LogoutView.as_view(), name='logout'),
    
    # Profile
    path("me/", UserProfileView.as_view(), name='user-profile'),
    path("profile/update/", UserUpdateView.as_view(), name='user-update'),
    path("profile/change-email/", ChangeEmailView.as_view(), name='change-email'),
    path("profile/change-password/", ChangePasswordView.as_view(), name='change-password'),
    
    # Password Reset
    path("password-reset/", PasswordResetRequestView.as_view(), name='password-reset-request'),
    path("password-reset/confirm/", PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]

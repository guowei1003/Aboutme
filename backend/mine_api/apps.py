import os

from django.apps import AppConfig


class MineApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "mine_api"

    def ready(self):
        # 从环境变量同步后台管理员 Django User（供 JWT 登录）
        username = os.getenv("ADMIN_USERNAME", "").strip()
        password = os.getenv("ADMIN_PASSWORD", "").strip()
        if not username or not password:
            return
        from django.contrib.auth import get_user_model

        User = get_user_model()
        user, _ = User.objects.get_or_create(
            username=username,
            defaults={"is_staff": True, "is_superuser": True},
        )
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()

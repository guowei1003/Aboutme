# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="WorkshopItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=100, verbose_name="名称")),
                ("description", models.TextField(blank=True, default="", verbose_name="描述")),
                ("url", models.URLField(max_length=500, verbose_name="链接")),
                ("icon_url", models.CharField(blank=True, default="", max_length=500, verbose_name="图标 URL")),
                ("category", models.CharField(default="通用", max_length=50, verbose_name="分类")),
                ("sort_order", models.IntegerField(default=0, verbose_name="排序")),
                ("is_active", models.BooleanField(default=True, verbose_name="是否展示")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="创建时间")),
            ],
            options={
                "ordering": ["sort_order", "-id"],
            },
        ),
    ]

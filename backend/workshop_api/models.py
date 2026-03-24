from django.db import models


class WorkshopItem(models.Model):
    """工坊导航：小工具外链展示。"""

    name = models.CharField(max_length=100, verbose_name="名称")
    description = models.TextField(blank=True, default="", verbose_name="描述")
    url = models.URLField(max_length=500, verbose_name="链接")
    icon_url = models.CharField(max_length=500, blank=True, default="", verbose_name="图标 URL")
    category = models.CharField(max_length=50, default="通用", verbose_name="分类")
    sort_order = models.IntegerField(default=0, verbose_name="排序")
    is_active = models.BooleanField(default=True, verbose_name="是否展示")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        ordering = ["sort_order", "-id"]

    def __str__(self):
        return self.name

from django.contrib import admin

from .models import WorkshopItem


@admin.register(WorkshopItem)
class WorkshopItemAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "sort_order", "is_active", "created_at")
    list_filter = ("is_active", "category")

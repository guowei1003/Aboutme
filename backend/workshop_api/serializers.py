from rest_framework import serializers

from .models import WorkshopItem


class WorkshopItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkshopItem
        fields = [
            "id",
            "name",
            "description",
            "url",
            "icon_url",
            "category",
            "sort_order",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

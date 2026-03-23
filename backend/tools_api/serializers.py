from rest_framework import serializers
from .models import Tool, ToolsClass


class ToolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tool
        fields = "__all__"


class ToolsClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToolsClass
        fields = "__all__"

from rest_framework import serializers
from .models import Site, SiteClass


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = "__all__"


class SiteClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteClass
        fields = "__all__"

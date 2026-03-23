from rest_framework import serializers
from .models import Article, Tags


class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = ["id", "tag", "describe"]


class ArticleListSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="author.author_nickname", read_only=True)
    tag_list = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "cornerite",
            "article_class",
            "article_lead",
            "author",
            "publish_time",
            "article_reads",
            "article_likes",
            "tag_list",
        ]

    def get_tag_list(self, obj):
        return list(obj.article_tags.values_list("tag", flat=True))


class ArticleCreateSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(child=serializers.CharField(), required=False, allow_empty=True)

    class Meta:
        model = Article
        fields = ["title", "location", "quote", "article_class", "article_lead", "cornerite", "tags"]


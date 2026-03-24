from django.db.models import F
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from .models import Article, Author, Tags
from .serializers import (
    ArticleCreateSerializer,
    ArticleDetailSerializer,
    ArticleListSerializer,
    ArticleUpdateSerializer,
    TagsSerializer,
)


@api_view(["GET"])
@permission_classes([AllowAny])
def article_list(request):
    before_id = request.GET.get("before_id")
    queryset = Article.objects.filter(is_avtive=True).order_by("-create_time")
    if before_id:
        queryset = queryset.filter(id__lt=before_id)
    serializer = ArticleListSerializer(queryset[:10], many=True)
    return Response({"results": serializer.data})


@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([AllowAny])
def article_detail(request, pk):
    if request.method == "GET":
        try:
            article = Article.objects.get(pk=pk, is_avtive=True)
        except Article.DoesNotExist:
            return Response({"detail": "not found"}, status=status.HTTP_404_NOT_FOUND)
        Article.objects.filter(pk=pk).update(article_reads=F("article_reads") + 1)
        article.refresh_from_db()
        return Response(ArticleDetailSerializer(article).data)

    if not (request.user and request.user.is_authenticated and request.user.is_staff):
        return Response({"detail": "forbidden"}, status=status.HTTP_403_FORBIDDEN)

    try:
        article = Article.objects.get(pk=pk)
    except Article.DoesNotExist:
        return Response({"detail": "not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "DELETE":
        article.is_avtive = False
        article.save(update_fields=["is_avtive"])
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = ArticleUpdateSerializer(article, data=request.data, partial=request.method == "PATCH")
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data
    tags = data.pop("tags", None)
    for key, value in data.items():
        setattr(article, key, value)
    article.save()
    if tags is not None:
        article.article_tags.clear()
        for tag_name in tags:
            tag, _ = Tags.objects.get_or_create(tag=tag_name)
            article.article_tags.add(tag)
    article.refresh_from_db()
    return Response(ArticleDetailSerializer(article).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def article_search(request):
    article_class = request.GET.get("class")
    tag = request.GET.get("tag")
    query_date = request.GET.get("date")
    queryset = Article.objects.filter(is_avtive=True)
    if article_class:
        queryset = queryset.filter(article_class=article_class)
    if tag:
        queryset = queryset.filter(article_tags__tag=tag)
    if query_date:
        parts = query_date.split("-")
        if len(parts) == 3:
            queryset = queryset.filter(
                create_time__year=parts[0],
                create_time__month=parts[1],
                create_time__day=parts[2],
            )
    serializer = ArticleListSerializer(queryset.order_by("-create_time")[:50], many=True)
    return Response({"results": serializer.data})


@api_view(["GET"])
@permission_classes([AllowAny])
def tags_list(request):
    tags = Tags.objects.all().order_by("tag")
    return Response(TagsSerializer(tags, many=True).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def tags_detail(request, name):
    try:
        tag = Tags.objects.get(tag=name)
    except Tags.DoesNotExist:
        return Response({"data": "无数据"}, status=status.HTTP_404_NOT_FOUND)
    return Response({"data": tag.describe or "木有介绍哇:("})


@api_view(["POST"])
@permission_classes([AllowAny])
def article_like(request, pk):
    updated = Article.objects.filter(pk=pk).update(article_likes=F("article_likes") + 1)
    if not updated:
        return Response({"detail": "not found"}, status=status.HTTP_404_NOT_FOUND)
    article = Article.objects.get(pk=pk)
    return Response({"likes": article.article_likes})


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdminUser])
def article_create(request):
    serializer = ArticleCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    author, _ = Author.objects.get_or_create(
        author_name=request.user.username,
        defaults={
            "author_nickname": request.user.username,
            "password": "",
            "permissions": Author.PermissionChoices.ADMIN,
        },
    )
    data = serializer.validated_data
    tags = data.pop("tags", [])
    article = Article.objects.create(
        title=data["title"],
        author=author,
        location=data.get("location", "北京"),
        quote=data.get("quote", "原创"),
        article_class=data.get("article_class", "python"),
        article_lead=data["article_lead"],
        article_body=data.get("article_body", ""),
        cornerite=data.get("cornerite", ""),
    )
    for tag_name in tags:
        tag, _ = Tags.objects.get_or_create(tag=tag_name)
        article.article_tags.add(tag)
    return Response(ArticleDetailSerializer(article).data, status=status.HTTP_201_CREATED)

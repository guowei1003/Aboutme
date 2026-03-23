from django.db.models import F
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import Article, Author, Tags
from .serializers import ArticleCreateSerializer, ArticleListSerializer, TagsSerializer


@api_view(["GET"])
@permission_classes([AllowAny])
def article_list(request):
    before_id = request.GET.get("before_id")
    queryset = Article.objects.filter(is_avtive=True).order_by("-create_time")
    if before_id:
        queryset = queryset.filter(id__lt=before_id)
    serializer = ArticleListSerializer(queryset[:10], many=True)
    return Response({"results": serializer.data})


@api_view(["GET"])
@permission_classes([AllowAny])
def article_detail(request, pk):
    try:
        article = Article.objects.get(pk=pk, is_avtive=True)
    except Article.DoesNotExist:
        return Response({"detail": "not found"}, status=status.HTTP_404_NOT_FOUND)
    Article.objects.filter(pk=pk).update(article_reads=F("article_reads") + 1)
    article.refresh_from_db()
    return Response(ArticleListSerializer(article).data)


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
            queryset = queryset.filter(create_time__year=parts[0], create_time__month=parts[1], create_time__day=parts[2])
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
    article = Article.objects.create(
        title=serializer.validated_data["title"],
        author=author,
        location=serializer.validated_data.get("location", "北京"),
        quote=serializer.validated_data.get("quote", "原创"),
        article_class=serializer.validated_data.get("article_class", "python"),
        article_lead=serializer.validated_data["article_lead"],
        cornerite=serializer.validated_data.get("cornerite", ""),
    )
    for tag_name in serializer.validated_data.get("tags", []):
        tag, _ = Tags.objects.get_or_create(tag=tag_name)
        article.article_tags.add(tag)
    return Response(ArticleListSerializer(article).data, status=status.HTTP_201_CREATED)

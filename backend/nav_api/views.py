from django.db.models import F
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Site, SiteClass
from .serializers import SiteSerializer

MENU_LIST = ["news", "videos", "shopping", "cars", "finance", "develop", "live", "cool", "relax"]


@api_view(["GET"])
@permission_classes([AllowAny])
def nav_home(request):
    site_list = Site.objects.filter(is_onhome=True)[:100]
    other_sites = Site.objects.filter(is_onhome=False)
    return Response(
        {
            "site_list": SiteSerializer(site_list, many=True).data,
            "champion_reads": SiteSerializer(other_sites.order_by("-url_reads")[:100], many=True).data,
            "champion_likes": SiteSerializer(other_sites.order_by("-url_likes")[:100], many=True).data,
            "champion_collects": SiteSerializer(other_sites.order_by("-url_collects")[:100], many=True).data,
        }
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def nav_class(request, keyword):
    if keyword not in MENU_LIST:
        return Response({"detail": "invalid keyword"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        class_site = SiteClass.objects.get(class_name=keyword)
    except SiteClass.DoesNotExist:
        return Response({"detail": "not found"}, status=status.HTTP_404_NOT_FOUND)
    site_list = Site.objects.filter(url_class=class_site)
    return Response({"title": class_site.class_name_cn, "results": SiteSerializer(site_list, many=True).data})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def nav_add(request):
    serializer = SiteSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def nav_stats(request, pk):
    field = request.data.get("field")
    if field not in {"url_reads", "url_likes", "url_collects"}:
        return Response({"detail": "invalid field"}, status=status.HTTP_400_BAD_REQUEST)
    updated = Site.objects.filter(pk=pk).update(**{field: F(field) + 1})
    if not updated:
        return Response({"detail": "not found"}, status=status.HTTP_404_NOT_FOUND)
    return Response({"data": "0"})

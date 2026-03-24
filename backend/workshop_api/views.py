from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from .models import WorkshopItem
from .serializers import WorkshopItemSerializer


@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def workshop_item_list(request):
    if request.method == "GET":
        qs = WorkshopItem.objects.filter(is_active=True)
        return Response({"results": WorkshopItemSerializer(qs, many=True).data})

    if not (request.user and request.user.is_authenticated and request.user.is_staff):
        return Response({"detail": "forbidden"}, status=status.HTTP_403_FORBIDDEN)
    serializer = WorkshopItemSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([AllowAny])
def workshop_item_detail(request, pk):
    try:
        item = WorkshopItem.objects.get(pk=pk)
    except WorkshopItem.DoesNotExist:
        return Response({"detail": "not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        if not item.is_active:
            return Response({"detail": "not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(WorkshopItemSerializer(item).data)

    if not (request.user and request.user.is_authenticated and request.user.is_staff):
        return Response({"detail": "forbidden"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "DELETE":
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = WorkshopItemSerializer(item, data=request.data, partial=request.method == "PATCH")
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminUser])
def workshop_item_list_admin(request):
    """后台管理：含已下线条目。"""
    qs = WorkshopItem.objects.all().order_by("sort_order", "-id")
    return Response({"results": WorkshopItemSerializer(qs, many=True).data})

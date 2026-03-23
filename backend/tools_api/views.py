import os
from django.db.models import F
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from .models import AccessRecord, Tool, ToolsClass
from .serializers import ToolSerializer


@api_view(["GET"])
@permission_classes([AllowAny])
def home(request):
    return Response(
        {
            "new_tool_list": ToolSerializer(Tool.objects.order_by("-create_time")[:10], many=True).data,
            "like_most_list": ToolSerializer(Tool.objects.order_by("-like_count")[:10], many=True).data,
            "use_most_list": ToolSerializer(Tool.objects.order_by("-usage_count")[:10], many=True).data,
            "classes": list(ToolsClass.objects.values("tool_class", "tool_class_ename")),
        }
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def class_detail(request, menu):
    tools = Tool.objects.filter(tool_class=menu).order_by("tool_ename")
    return Response({"results": ToolSerializer(tools, many=True).data})


@api_view(["GET"])
@permission_classes([AllowAny])
def tool_detail(request, tool_ename):
    try:
        tool = Tool.objects.get(tool_ename=tool_ename)
    except Tool.DoesNotExist:
        return Response({"detail": "not found"}, status=status.HTTP_404_NOT_FOUND)
    Tool.objects.filter(pk=tool.pk).update(usage_count=F("usage_count") + 1)
    access_ip = request.META.get("HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", "")).split(",")[0].strip()
    AccessRecord.objects.create(
        access_user=request.user.username if request.user.is_authenticated else "匿名用户",
        sec_key="",
        ip=access_ip if access_ip else None,
        url=tool_ename,
        location="",
    )
    tool.refresh_from_db()
    return Response(ToolSerializer(tool).data)


@api_view(["POST"])
@permission_classes([AllowAny])
def tool_like(request, pk):
    updated = Tool.objects.filter(pk=pk).update(like_count=F("like_count") + 1)
    if not updated:
        return Response({"detail": "not found"}, status=status.HTTP_404_NOT_FOUND)
    tool = Tool.objects.get(pk=pk)
    return Response({"data": tool.like_count})


@api_view(["POST"])
@permission_classes([IsAdminUser])
def geo_backfill(request):
    api_key = os.getenv("BAIDU_IP_API_KEY", "")
    if not api_key:
        return Response({"detail": "BAIDU_IP_API_KEY 未配置"}, status=status.HTTP_400_BAD_REQUEST)
    count = AccessRecord.objects.filter(location="").exclude(ip__isnull=True).count()
    return Response({"status": "0", "count": count, "note": "可在此接入异步地理位置补全任务"})

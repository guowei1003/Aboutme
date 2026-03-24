import os
import uuid

from django.core.files.storage import default_storage
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdminUser])
def upload_image(request):
    image = request.FILES.get("image")
    if not image:
        return Response({"detail": "missing image"}, status=status.HTTP_400_BAD_REQUEST)
    if not image.content_type or not image.content_type.startswith("image/"):
        return Response({"detail": "invalid type"}, status=status.HTTP_400_BAD_REQUEST)
    if image.size > 5 * 1024 * 1024:
        return Response({"detail": "file too large"}, status=status.HTTP_400_BAD_REQUEST)

    ext = os.path.splitext(image.name)[1] or ".png"
    safe_name = f"{uuid.uuid4().hex}{ext}"
    file_path = default_storage.save(f"uploads/{safe_name}", image)
    url = request.build_absolute_uri(f"/media/{file_path}")
    return Response({"url": url}, status=status.HTTP_201_CREATED)

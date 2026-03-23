from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_image(request):
    image = request.FILES.get("image")
    if not image:
        return Response({"detail": "missing image"}, status=status.HTTP_400_BAD_REQUEST)
    if not image.content_type.startswith("image/"):
        return Response({"detail": "invalid type"}, status=status.HTTP_400_BAD_REQUEST)
    if image.size > 5 * 1024 * 1024:
        return Response({"detail": "file too large"}, status=status.HTTP_400_BAD_REQUEST)
    from django.core.files.storage import default_storage

    file_path = default_storage.save(f"uploads/{image.name}", image)
    url = request.build_absolute_uri(f"/media/{file_path}")
    return Response({"url": url})

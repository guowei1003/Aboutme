from django.urls import path
from . import views

urlpatterns = [
    path("home/", views.home),
    path("classes/<str:menu>/", views.class_detail),
    path("access-records/geo-backfill/", views.geo_backfill),
    path("<str:tool_ename>/", views.tool_detail),
    path("<int:pk>/like/", views.tool_like),
]

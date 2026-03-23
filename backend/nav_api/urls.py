from django.urls import path
from . import views

urlpatterns = [
    path("sites/home/", views.nav_home),
    path("sites/class/<str:keyword>/", views.nav_class),
    path("sites/", views.nav_add),
    path("sites/<int:pk>/stats/", views.nav_stats),
]

from django.urls import path

from . import views

urlpatterns = [
    path("items/", views.workshop_item_list),
    path("items/admin/", views.workshop_item_list_admin),
    path("items/<int:pk>/", views.workshop_item_detail),
]

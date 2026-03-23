from django.urls import path
from . import views

urlpatterns = [
    path("articles/", views.article_list),
    path("articles/search/", views.article_search),
    path("articles/create/", views.article_create),
    path("articles/<int:pk>/", views.article_detail),
    path("articles/<int:pk>/like/", views.article_like),
    path("tags/", views.tags_list),
    path("tags/<str:name>/detail/", views.tags_detail),
]

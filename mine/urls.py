#coding:utf-8
from django.conf.urls import patterns, url


urlpatterns = patterns('',
    url(r'^$', 'mine.views.blog', name='blog'),
    url(r'^article/(?P<id>\d{1,5})$', 'mine.views.blog_article', name='blog_article'),
    url(r'^addarticle$', 'mine.views.add_article', name='add_article'),
    url(r'^search/$', 'mine.views.blog_search', name='blog_search'),

    url(r'^updatelikes/$', 'mine.views.updatelikes', name='updatelikes'),

    url(r"^tags/$","mine.views.tags",name='tags'),
    url(r'^tags/tags_detail/$', 'mine.views.tags_detail', name='tags_detail'),

    # url(r'^tools/$', 'mine.views.tools', name='tags_detail'),
)

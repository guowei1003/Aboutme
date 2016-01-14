#coding:utf-8
from django.conf.urls import patterns, url


urlpatterns = patterns('',

    url(r'^$','nav.views.navsite', name='navsite'),
    url(r'^navsite/(?P<keywords>\w{1,10})$','nav.views.navsite_class', name='navsite_class'),
    url(r'^navsite_update/(?P<keywords>\w{1,20})/$','nav.views.navsite_update', name='update_navsite'),
    url(r'^navsite_addsiteinfos/$','nav.views.navsite_add', name='add_navsite'),

)

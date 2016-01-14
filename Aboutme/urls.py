#coding:utf-8
from django.conf.urls import patterns, include, url
from django.conf import settings
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()
from Aboutme.settings import BASE_URL

urlpatterns = patterns('',
    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$',"tools.views.toolsHome",name="toolsHome"),
    url(r'^aboutme/$', 'mine.views.aboutme', name='aboutme'),
    url(r'^space/(?P<author>\w{1,10})$', 'mine.views.space', name='space'),
    url(r'^blog/',include('mine.urls')),
    url(r'^tools/',include('tools.urls')),
    url(r'^nav/',include('nav.urls')),
)

urlpatterns +=patterns('',
                        url(r'^static/(?P<path>.*)$','django.views.static.serve',{'document_root':settings.STATIC_ROOT}),
                        # url(r'^static/<?P<path>.*>$','django.views.static.serve',{'document_root':settings.MEDIA_ROOT}),
                       )
#下面是富文本编辑器需要的数据
urlpatterns += patterns("",
    url(r'ueEditorControler','mine.controller.handler'),
    ( r'^UE/(?P<path>.*)$', 'django.views.static.serve',
            { 'document_root': (BASE_URL+"/UE").replace('\\','/') }
    ),
    ( r'^upload/(?P<path>.*)$', 'django.views.static.serve',
            { 'document_root': (BASE_URL+"/upload").replace('\\','/') }
    ),

)
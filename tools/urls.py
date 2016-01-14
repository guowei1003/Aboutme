#coding:utf-8
from django.conf.urls import patterns, url
from Aboutme.settings import BASE_URL

urlpatterns = patterns('',
    url(r'^$', 'tools.views.toolsHome', name='toolshome'),
    url(r'^toolclass/$', 'tools.views.toolClass', name='toolclass'),
    url(r'^tooldetail/(?P<t_ename>\w{1,50})/$', 'tools.views.toolDetail', name='tooldetail'),

    url(r'^updatelikes/$', 'tools.views.updatelikes', name='updatelikes'),
    url(r'^scan_ipadd/$', 'tools.views.scan_ipadd', name='scan_ipadd'),
)
#下面是富文本编辑器需要的数据
# urlpatterns += patterns("",
#     url(r'ueEditorControler','mine.controller.handler'),
#     ( r'^UE/(?P<path>.*)$', 'django.views.static.serve',
#             { 'document_root': (BASE_URL+"/UE").replace('\\','/') }
#     ),
#     ( r'^upload/(?P<path>.*)$', 'django.views.static.serve',
#             { 'document_root': (BASE_URL+"/upload").replace('\\','/') }
#     ),

# )
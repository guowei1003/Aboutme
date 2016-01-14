#coding:utf-8

from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

class site_class(models.Model):
    class_name =  models.CharField(max_length=50, verbose_name=u"类名",unique=True)
    class_name_cn =  models.CharField(max_length=50, verbose_name=u"类中文名",unique=True)
    class_code = models.IntegerField(max_length=5, verbose_name=u"类代码" ,unique=True)
    create_time = models.DateTimeField(default=datetime.now, verbose_name=u'创建时间')
    def  __unicode__(self):
        return self.class_name
class site_group(models.Model):
    group_name =  models.CharField(max_length=50, verbose_name=u"组" ,unique=True)
    group_code = models.IntegerField(max_length=5, verbose_name=u"组代码" ,unique=True)
    create_time = models.DateTimeField(default=datetime.now, verbose_name=u'创建时间')
    def  __unicode__(self):
        return self.group_name
class site(models.Model):

    name =  models.CharField(max_length=50, verbose_name=u"名称")
    url = models.CharField(max_length=500, verbose_name=u"URL地址")
    url_class = models.ForeignKey(site_class, to_field="class_name", verbose_name=u"主分类",)
    url_group = models.ForeignKey(site_group, to_field="group_name", verbose_name=u"分组")
    url_reads = models.IntegerField(max_length=5, verbose_name=u"点击量" ,default=0)
    url_likes = models.IntegerField(max_length=5, verbose_name=u"喜欢数" ,default=0)
    url_collects = models.IntegerField(max_length=5, verbose_name=u"收藏数" ,default=0)
    is_onhome = models.BooleanField(default=True, verbose_name=u'是否显示在主页')
    describe = models.TextField(max_length=1000, verbose_name=u"描述", blank=True)
    create_time = models.DateTimeField(default=datetime.now, verbose_name=u'创建时间')
    def __unicode__(self):
        return self.name
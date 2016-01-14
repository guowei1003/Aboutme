#coding:utf-8
from django.db import models
from datetime import datetime

# 工具站数据库设计
# 需要有统计系统 Access_record：用户，密钥，ip，url，位置，浏览器，时间

class Access_record(models.Model):
    """访问记录"""
    access_user = models.CharField(max_length=50, blank=True , verbose_name='访问用户')
    sec_key = models.CharField(max_length=50, blank=True , verbose_name='访问密钥')
    ip = models.IPAddressField(blank=True, verbose_name='IP地址')
    url =  models.CharField(max_length=100, blank=True , verbose_name='访问URL')
    location = models.CharField(max_length=100, blank=True , verbose_name='访问地理位置')
    create_time = models.DateTimeField(default=datetime.now, verbose_name=u'创建时间')

    def __unicode__(self):
        return self.access_user

class Tools(models.Model):
    """工具信息"""
    tool_name = models.CharField(max_length=50, verbose_name='工具名称')
    tool_ename = models.CharField(max_length=50, verbose_name='工具英文名称')
    tool_code = models.CharField(max_length=10, verbose_name='工具代码')
    tool_class = models.CharField(max_length=20, verbose_name='工具分类')
    tool_api = models.CharField(max_length=100, verbose_name='工具接口',blank=True)
    tool_dec = models.TextField(verbose_name='工具描述',blank=True)
    usage_count = models.IntegerField(default=0, verbose_name="使用次数")
    like_count = models.IntegerField(default=0, verbose_name="喜欢的人")
    create_time = models.DateTimeField(default=datetime.now, verbose_name=u'创建时间')
    last_time = models.DateTimeField(default=datetime.now, verbose_name=u'最后一次调用时间')

    def __unicode__(self):
        return  self.tool_name

class Tools_class(models.Model):
    """工具类别"""
    tool_class = models.CharField(max_length=50, verbose_name='工具类别')
    tool_class_ename = models.CharField(max_length=50, verbose_name='工具分类英文名称')
    tool_class_count = models.IntegerField(default=0, verbose_name="使用次数")
    create_time = models.DateTimeField(default=datetime.now, verbose_name=u'创建时间')

    def __unicode__(self):
        return  self.tool_class
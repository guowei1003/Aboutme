#coding:utf-8

from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from django.utils.translation import ugettext_lazy as _

class Tags(models.Model):
    """标签库"""
    tag = models.CharField(max_length=50, default="python", unique=True, verbose_name=u"标签")
    describe = models.TextField(max_length=1000, default="无描述",  verbose_name=u"描述")
    def  __unicode__(self):
        return self.tag

class Author(models.Model):
    PERMISSIONS_CHOICES = (
        (u'0', u'管理员'),
        (u'1', u'普通用户'),
    )
    author_name = models.CharField(max_length=50, verbose_name=u"作者名")
    author_nickname = models.CharField(max_length=50, verbose_name=u"作者昵称")
    password = models.CharField(max_length=50, verbose_name=u"密码")
    permissions = models.CharField(max_length=10, choices=PERMISSIONS_CHOICES, verbose_name="权限", blank=False)
    create_time = models.DateTimeField(default=datetime.now, verbose_name=u'创建时间')
    def  __unicode__(self):
        return self.author_nickname

class Article(models.Model):
    """文章库"""
    CORNERITE_CHOICES = (
        (u'J', u'推荐'),
        (u'H', u'热门'),
        (u'C', u'原创'),
    )
    title = models.CharField(max_length=50, verbose_name=u"标题")
    author = models.ForeignKey(Author, related_name='author_article', verbose_name=u"作者")
    location = models.CharField(max_length=10, verbose_name=u"创建地点")
    quote = models.CharField(max_length=50, default="原创", verbose_name=u"引用")
    article_class = models.CharField(max_length=50, default="python", verbose_name=u"分类")
    article_lead = models.TextField(verbose_name=u"文章内容")
    article_tags = models.ManyToManyField(Tags, verbose_name=u'标签', blank=True, default="博文")
    article_reads = models.IntegerField(max_length=5, verbose_name=u"阅读人数")
    article_likes = models.IntegerField(max_length=5, verbose_name=u"喜欢人数")
    article_collects = models.IntegerField(max_length=5, verbose_name=u"收藏人数")
    cornerite = models.CharField(max_length=10, choices=CORNERITE_CHOICES, verbose_name="左包角", blank=True)
    create_time = models.DateTimeField(default=datetime.now, verbose_name=u'创建时间')
    publish_time = models.DateTimeField(default=datetime.now, verbose_name=u'发布时间')
    is_avtive = models.BooleanField(default=True, verbose_name=u'是否可用')
    remarks = models.TextField(max_length=100, verbose_name=u"备注", blank=True)

    class Meta:
        verbose_name = _('article')
        verbose_name_plural = _('articles')

    def  __unicode__(self):
        return self.title


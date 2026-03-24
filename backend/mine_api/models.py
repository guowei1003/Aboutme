from django.db import models
from django.utils.translation import gettext_lazy as _


class Tags(models.Model):
    tag = models.CharField(max_length=50, default="python", unique=True, verbose_name="标签")
    describe = models.TextField(max_length=1000, default="无描述", verbose_name="描述")

    def __str__(self):
        return self.tag


class Author(models.Model):
    class PermissionChoices(models.TextChoices):
        ADMIN = "0", "管理员"
        USER = "1", "普通用户"

    author_name = models.CharField(max_length=50, verbose_name="作者名")
    author_nickname = models.CharField(max_length=50, verbose_name="作者昵称")
    password = models.CharField(max_length=128, verbose_name="密码")
    permissions = models.CharField(max_length=10, choices=PermissionChoices.choices, verbose_name="权限")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    def __str__(self):
        return self.author_nickname


class Article(models.Model):
    class CorneriteChoices(models.TextChoices):
        RECOMMEND = "J", "推荐"
        HOT = "H", "热门"
        ORIGINAL = "C", "原创"

    title = models.CharField(max_length=50, verbose_name="标题")
    author = models.ForeignKey(Author, related_name="author_article", on_delete=models.PROTECT, verbose_name="作者")
    location = models.CharField(max_length=10, verbose_name="创建地点")
    quote = models.CharField(max_length=200, default="原创", verbose_name="引用")
    article_class = models.CharField(max_length=50, default="python", verbose_name="分类")
    article_lead = models.TextField(verbose_name="摘要/导语")
    article_body = models.TextField(blank=True, default="", verbose_name="正文 HTML")
    cover_image = models.CharField(max_length=500, blank=True, default="", verbose_name="封面图 URL")
    read_time = models.IntegerField(default=5, verbose_name="阅读时长(分钟)")
    article_tags = models.ManyToManyField(Tags, verbose_name="标签", blank=True)
    article_reads = models.IntegerField(default=0, verbose_name="阅读人数")
    article_likes = models.IntegerField(default=0, verbose_name="喜欢人数")
    article_collects = models.IntegerField(default=0, verbose_name="收藏人数")
    cornerite = models.CharField(max_length=10, choices=CorneriteChoices.choices, blank=True, verbose_name="左包角")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    publish_time = models.DateTimeField(auto_now_add=True, verbose_name="发布时间")
    is_avtive = models.BooleanField(default=True, verbose_name="是否可用")
    remarks = models.TextField(max_length=100, verbose_name="备注", blank=True)

    class Meta:
        verbose_name = _("article")
        verbose_name_plural = _("articles")

    def __str__(self):
        return self.title

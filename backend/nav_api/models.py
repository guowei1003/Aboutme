from django.db import models


class SiteClass(models.Model):
    class_name = models.CharField(max_length=50, verbose_name="类名", unique=True)
    class_name_cn = models.CharField(max_length=50, verbose_name="类中文名", unique=True)
    class_code = models.IntegerField(verbose_name="类代码", unique=True)
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    def __str__(self):
        return self.class_name


class SiteGroup(models.Model):
    group_name = models.CharField(max_length=50, verbose_name="组", unique=True)
    group_code = models.IntegerField(verbose_name="组代码", unique=True)
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    def __str__(self):
        return self.group_name


class Site(models.Model):
    name = models.CharField(max_length=50, verbose_name="名称")
    url = models.CharField(max_length=500, verbose_name="URL地址")
    url_class = models.ForeignKey(SiteClass, to_field="class_name", on_delete=models.PROTECT, verbose_name="主分类")
    url_group = models.ForeignKey(SiteGroup, to_field="group_name", on_delete=models.PROTECT, verbose_name="分组")
    url_reads = models.IntegerField(verbose_name="点击量", default=0)
    url_likes = models.IntegerField(verbose_name="喜欢数", default=0)
    url_collects = models.IntegerField(verbose_name="收藏数", default=0)
    is_onhome = models.BooleanField(default=True, verbose_name="是否显示在主页")
    describe = models.TextField(max_length=1000, verbose_name="描述", blank=True)
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    def __str__(self):
        return self.name

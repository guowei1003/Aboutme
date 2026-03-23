from django.db import models


class AccessRecord(models.Model):
    access_user = models.CharField(max_length=50, blank=True, verbose_name="访问用户")
    sec_key = models.CharField(max_length=50, blank=True, verbose_name="访问密钥")
    ip = models.GenericIPAddressField(blank=True, null=True, verbose_name="IP地址")
    url = models.CharField(max_length=100, blank=True, verbose_name="访问URL")
    location = models.CharField(max_length=100, blank=True, verbose_name="访问地理位置")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    def __str__(self):
        return self.access_user or "anonymous"


class ToolsClass(models.Model):
    tool_class = models.CharField(max_length=50, verbose_name="工具类别")
    tool_class_ename = models.CharField(max_length=50, verbose_name="工具分类英文名称", unique=True)
    tool_class_count = models.IntegerField(default=0, verbose_name="使用次数")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    def __str__(self):
        return self.tool_class


class Tool(models.Model):
    tool_name = models.CharField(max_length=50, verbose_name="工具名称")
    tool_ename = models.CharField(max_length=50, verbose_name="工具英文名称", unique=True)
    tool_code = models.CharField(max_length=10, verbose_name="工具代码")
    tool_class = models.CharField(max_length=20, verbose_name="工具分类")
    tool_api = models.CharField(max_length=100, verbose_name="工具接口", blank=True)
    tool_dec = models.TextField(verbose_name="工具描述", blank=True)
    usage_count = models.IntegerField(default=0, verbose_name="使用次数")
    like_count = models.IntegerField(default=0, verbose_name="喜欢的人")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    last_time = models.DateTimeField(auto_now=True, verbose_name="最后一次调用时间")

    def __str__(self):
        return self.tool_name

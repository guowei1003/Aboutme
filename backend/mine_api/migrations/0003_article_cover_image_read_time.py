from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("mine_api", "0002_article_article_body"),
    ]

    operations = [
        migrations.AddField(
            model_name="article",
            name="cover_image",
            field=models.CharField(blank=True, default="", max_length=500, verbose_name="封面图 URL"),
        ),
        migrations.AddField(
            model_name="article",
            name="read_time",
            field=models.IntegerField(default=5, verbose_name="阅读时长(分钟)"),
        ),
    ]

# Generated manually for article_body

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("mine_api", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="article",
            name="article_body",
            field=models.TextField(blank=True, default="", verbose_name="正文 HTML"),
        ),
        migrations.AlterField(
            model_name="article",
            name="article_lead",
            field=models.TextField(verbose_name="摘要/导语"),
        ),
    ]

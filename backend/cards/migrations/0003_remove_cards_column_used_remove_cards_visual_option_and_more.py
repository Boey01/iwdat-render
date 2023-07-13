# Generated by Django 4.2 on 2023-07-13 10:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cards', '0002_alter_cards_height_alter_cards_width'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cards',
            name='column_used',
        ),
        migrations.RemoveField(
            model_name='cards',
            name='visual_option',
        ),
        migrations.AddField(
            model_name='cards',
            name='chart_type',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='cards',
            name='visual_config',
            field=models.JSONField(null=True),
        ),
    ]
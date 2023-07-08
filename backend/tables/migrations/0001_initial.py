# Generated by Django 4.2 on 2023-07-06 12:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='TableData',
            fields=[
                ('table_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('table_name', models.CharField(max_length=255)),
                ('position_x', models.IntegerField()),
                ('position_y', models.IntegerField()),
                ('hidden', models.BooleanField()),
                ('data', models.JSONField()),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
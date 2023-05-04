from django.db import models

# Create your models here.


class Source(models.Model):
    name = models.TextField()
    type = models.TextField()
    link = models.TextField() 
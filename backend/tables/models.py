from django.db import models
from accounts.models import UserAccount

# Create your models here.

class TableData(models.Model):
    table_id = models.BigAutoField(primary_key=True)
    user_id = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    table_name = models.CharField(max_length=255)
    position_x = models.IntegerField()
    position_y = models.IntegerField()
    hidden = models.BooleanField()
    data = models.JSONField()

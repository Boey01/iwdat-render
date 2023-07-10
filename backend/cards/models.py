from django.db import models
from accounts.models import UserAccount
from tables.models import TableData
# Create your models here.

 
class Cards(models.Model):
    card_id = models.BigAutoField(primary_key=True)
    user_id = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    table_id = models.ForeignKey(TableData, on_delete=models.SET_NULL, null=True)
    visualized = models.BooleanField()
    visual_option = models.CharField(max_length=255,  null=True)
    column_used = models.CharField(max_length=255, null=True)
    position_x = models.IntegerField()
    position_y = models.IntegerField()
    width = models.IntegerField()
    height = models.IntegerField()

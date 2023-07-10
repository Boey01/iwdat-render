from rest_framework import serializers
from .models import TableData

class ReadingTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableData
        exclude = ('user_id',)

class ModifyTableSerializer(serializers.ModelSerializer):
    user_id = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = TableData
        fields = '__all__'

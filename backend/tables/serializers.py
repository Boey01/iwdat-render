from rest_framework import serializers
from .models import TableData

class ReadingTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableData
        fields = ['table_id', 'table_name', 'position_x', 'position_y', 'hidden', 'data']

class ModifyTableSerializer(serializers.ModelSerializer):
    user_id = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = TableData
        fields = '__all__'

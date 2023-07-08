from rest_framework import serializers
from .models import TableData

class ReadingTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableData
        fields = ['table_id', 'table_name', 'position_x', 'position_y', 'hidden', 'data']

# class CreateTableSerializer(serializers.ModelSerializer):
#     table_name = serializers.CharField(max_length=255)
#     position_x = serializers.IntegerField()
#     position_y = serializers.IntegerField()
#     hidden = serializers.BooleanField()
#     data = serializers.JSONField()

#     def create(self, validated_data):
#         user_id = self.context['request'].user.id
#         return TableData.objects.create(user_id=user_id, **validated_data)


class ModifyTableSerializer(serializers.ModelSerializer):
    user_id = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = TableData
        fields = '__all__'

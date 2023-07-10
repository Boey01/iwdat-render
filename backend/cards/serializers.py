from rest_framework import serializers
from .models import Cards

class ReadingCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cards
        exclude = ('user_id',   )

class ModifyCardSerializer(serializers.ModelSerializer):
    user_id = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Cards
        fields = '__all__'
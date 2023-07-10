from django.shortcuts import render
from .serializers import ReadingCardSerializer, ModifyCardSerializer
from .models import Cards
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCards(request):
    user = request.user
    card = user.cards_set.all()
    serializer = ReadingCardSerializer(card, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createCard(request):
    serializer = ModifyCardSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


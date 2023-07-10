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



@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteCard(request, card_id):
    try:
        card = Cards.objects.get(card_id=card_id)
    except Cards.DoesNotExist:
        return Response({'error': 'Card not found'}, status=404)

    # Check if the authenticated user is the author of the card
    if card.user_id_id == request.user.user_id:
        card.delete()
        return Response({'success': 'Card deleted'}, status=204)
    else:
        return Response({'error': 'Unauthorized'}, status=403)
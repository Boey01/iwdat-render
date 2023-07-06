from django.shortcuts import render
from django.http import JsonResponse
from .serializers import TableSerializer,CreateTableSerializer
from .models import TableData
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import permissions
# Create your views here.


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTables(request):
    user_id = request.user.id
    tables = TableData.objects.filter(user_id=user_id)
    serializer = TableSerializer(tables, many=True)
    return Response(serializer.data)


# @api_view(['POST'])
# # @permission_classes([IsAuthenticated])
# def createTable(request):
#     serializer = CreateTableSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save(user_id=request.user)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TestViewSet(viewsets.ModelViewSet):
    serializer_class = CreateTableSerializer

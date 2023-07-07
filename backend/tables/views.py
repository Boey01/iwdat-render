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

class createTable(viewsets.ModelViewSet):
    serializer_class = CreateTableSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        table_name = request.data.get('table_name')
        position_x = request.data.get('position_x')
        position_y = request.data.get('position_y')
        hidden = request.data.get('hidden')
        data = request.data.get('data')
        user_id = request.user.id
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        table_id = serializer.instance.table_id  # Get the generated 

        headers = self.get_success_headers(serializer.data)
        return Response({'table_id': table_id, **serializer.data}, headers=headers)


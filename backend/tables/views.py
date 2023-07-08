from django.shortcuts import render
from django.http import JsonResponse
from .serializers import ReadingTableSerializer,ModifyTableSerializer
from .models import TableData
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets
# Create your views here.


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTables(request):
    user = request.user
    tables = user.tabledata_set.all()
    serializer = ReadingTableSerializer(tables, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createTable(request):
    serializer = ModifyTableSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteTable(request, table_id):
    try:
        table = TableData.objects.get(table_id=table_id)
    except TableData.DoesNotExist:
        return Response({'error': 'Table not found'}, status=404)

    # Check if the authenticated user is the author of the table
    if table.user_id_id == request.user.user_id:
        table.delete()
        return Response({'success': 'Table deleted'}, status=204)
    else:
        return Response({'error': 'Unauthorized'}, status=403)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateTableVisibility(request):
    hidden_tables = request.data
    for key, value in hidden_tables.items():
        try:
            table = TableData.objects.get(table_id=key)
            table.hidden = value
            table.save()
        except TableData.DoesNotExist:
            print("table not found")
            pass

    return Response(status=204)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def updateTablePosition(request):
    moved_tables = request.data
    for key, value in moved_tables.items():
        try:
            table = TableData.objects.get(table_id=key)
            positions = value.split(',')
            print(int(positions[0]))
            print(int(positions[1]))
            table.position_x = int(positions[0])
            table.position_y = int(positions[1])
            table.save()
        except TableData.DoesNotExist:
            print("table not found")
            pass

    return Response(status=204)

# @api_view(['POST'])
# # @permission_classes([IsAuthenticated])
# def createTable(request):
#     serializer = CreateTableSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save(user_id=request.user)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class createTable(viewsets.ModelViewSet):
#     serializer_class = ModifyTableSerializer
#     permission_classes = [IsAuthenticated]

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)

#         headers = self.get_success_headers(serializer.data)
#         return Response({**serializer.data}, headers=headers)

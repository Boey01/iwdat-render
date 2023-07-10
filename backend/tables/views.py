from django.shortcuts import render
from .serializers import ReadingTableSerializer,ModifyTableSerializer
from .models import TableData
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
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


@api_view(['PUT'])
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


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateTablePosition(request):
    moved_tables = request.data
    for key, value in moved_tables.items():
        try:
            table = TableData.objects.get(table_id=key)
            positions = value.split(',')
            table.position_x = int(positions[0])
            table.position_y = int(positions[1])
            table.save()
        except TableData.DoesNotExist:
            print("table not found")
            pass

    return Response(status=204)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateTableData(request):
    edited_table = request.data
    for key, value in edited_table.items():
        try:
            table = TableData.objects.get(table_id=key)
        except TableData.DoesNotExist:
            return Response({'error': 'Table not found'}, status=404)

        # Check if the authenticated user is the author of the table
        if table.user_id_id == request.user.user_id:
            table.data = value
            table.save()
            return Response({'success': 'Table edited'}, status=204)
        else:
            return Response({'error': 'Unauthorized'}, status=403)


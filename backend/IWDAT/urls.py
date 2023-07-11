"""
URL configuration for IWDAT project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from tables import views as table_views 
from cards import views as card_views   

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    # Table api
    path('tables/retrieve/', table_views .getTables, name='get_tables'),
    path('tables/create/', table_views .createTable, name='create_table'),
    path('tables/delete/<int:table_id>/', table_views .deleteTable, name='delete_table'),
    path('tables/update/visible/', table_views .updateTableVisibility, name='update_table_visible'),
    path('tables/update/position/', table_views .updateTablePosition, name='update_table_position'),
    path('tables/update/data/', table_views .updateTableData, name='update_table_data'),
    # Card api
    path('cards/create/', card_views.createCard, name='create_card'),
    path('cards/retrieve/', card_views.getCards, name='get_cards'),
    path('cards/delete/<int:card_id>/', card_views.deleteCard, name='delete_cards'),
    path('cards/update/position/', card_views.updateCardPosition, name='update_card_position'),
    path('cards/update/size/', card_views.updateCardSize, name='update_card_size'),

]

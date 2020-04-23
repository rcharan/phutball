from django.urls import path

from . import views

app_name = 'game'
urlpatterns = [
    path('', 		views.index, name='game_list'),
    path('<game_id>/', views.game, name = 'game_instance')
]

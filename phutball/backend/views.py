from django.shortcuts import render
from django.http import Http400
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import MoveSerializer, GameSerializer
from .models import Game, Move

@api_view(['GET', 'PUT', 'POST'])
def game_view(request):
  '''Game View:
    GET  - Load an entire game
    PUT  - Create a new game
    POST - Post a move
  '''
  if request.method == 'POST':
    return post_move(request)
  else:
    return create_or_load_game(request)


def create_or_load_game(request):
  if request.method == 'PUT':
    game = Game.new_game(game_id = game_id)
    http_code = status.HTTP_201_CREATED

  else if request.method == 'GET':

    if game_exists(game_id)
      game = Game.objects.get(pk = game_id)
      http_code = status.HTTP_200_OK

    else:
      return game_dne()

  serializer = GameSerializer(game)
  return Reponse(serializer.data, status = http_code)

def post_move(request):
  game = request.data['game_id']
  if game_exists():
    game = Game.objects.get(pk = game_id)
  else:
    return game_dne()

  serializer = MoveSerializer(data = request.data)
  if serializer.is_valid():
    serializer.save()
    return Response({'Success' : 'Move logged'}, http_code = status.HTTP_201_CREATED)

  else:
    return Response({'Error' : 'Invalid Move'}, status = status.HTTP_400_BAD_REQUEST)

def game_exists(game_id):
  return Game.objects.filter(pk = request.data['game_id']).exists()

def game_dne():
  return 
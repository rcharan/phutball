from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import MoveSerializer, GameSerializer
from .models import Game, Move

@api_view(['GET', 'PUT', 'POST'])
def game_view(request, pk = None):
  '''Game View:
    GET  - Load an entire game
    PUT  - Create a new game
    POST - Post a move
  '''
  if request.method == 'POST':
    return post_move(request)
  else:
    return create_or_load_game(request, pk)


def create_or_load_game(request, game_id):
  if request.method == 'PUT':
    game = Game.new_game(game_id = game_id)
    http_code = status.HTTP_201_CREATED

  elif request.method == 'GET':

    if game_exists(game_id):
      game = Game.objects.get(pk = game_id)
      http_code = status.HTTP_200_OK

    else:
      return game_dne()

  serializer = GameSerializer(game)
  return Response(serializer.data, status = http_code)

def post_move(request):
  game_id = request.data['game_id']
  if game_exists(game_id):
    game = Game.objects.get(pk = game_id)
  else:
    return game_dne()

  serializer = MoveSerializer(data = request.data)
  if serializer.is_valid():
    serializer.save()
    return Response({'Success' : 'Move logged'}, status = status.HTTP_201_CREATED)

  else:
    return Response({'Error' : 'Invalid Move'}, status = status.HTTP_400_BAD_REQUEST)

def game_exists(game_id):
  return Game.objects.filter(pk = game_id).exists()

def game_dne():
  return 
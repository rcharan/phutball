from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import MoveSerializer, GameSerializer
from .models import Game, Move

@api_view(['GET', 'POST'])
def game_view(request, pk):
  '''Game View:
    GET  - Load an entire game
    PUT  - Create a new game
    POST - Post a move
  '''
  if request.method == 'POST':
    return post_move(request)

  elif request.method == 'GET':
    return load_game(request, pk)

@api_view(['PUT'])
def create_game(request):
  # print(f'Recieved a {request.method} request with data {request.data}')
  game_params = {}
  for param in ['ai_player', 'player_0_name', 'player_1_name', 'ai_player_num']:
    if param not in request.data or not request.data[param]:
      pass
    else:
      game_params[param] = request.data[param]

  game = Game.new_game(**game_params)
  return Response({'game_id' : game.game_id}, status = status.HTTP_201_CREATED)

def load_game(request, game_id):
  try:
    game = Game.objects.get(pk = game_id)
  except Game.DoesNotExist:
    return game_dne()


  serializer = GameSerializer(game)
  return Response(serializer.data, status = status.HTTP_200_OK)


def post_move(request):
  game_id = request.data['game_id']

  try:
    game = Game.objects.get(pk = game_id)
  except game.DoesNotExist:
    return game_dne()

  serializer = MoveSerializer(data = request.data)

  if serializer.is_valid():
    serializer.save()
    return Response({'Success' : 'Move Logged'}, status = status.HTTP_201_CREATED)

  else:
    return Response({'Error' : 'Invalid Move'},  status = status.HTTP_400_BAD_REQUEST)

def game_dne():
  return Response({'Error' : 'Game Does Not Exist'}, status = status.HTTP_404_NOT_FOUND)
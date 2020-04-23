from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import Board

def index(request):
	return render(request, 'game/index.html', {'boards' : Board.objects.all()})

def game(request, game_id):
	board = get_object_or_404(Board, pk=game_id)
	return render(request, 'game/game.html', {'board' : board})

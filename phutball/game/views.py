from django.shortcuts import render, get_object_or_404, reverse
from django.http import HttpResponse, HttpResponseRedirect
from .models import Board

def index(request):
  if request.method == 'GET':
    return _index_get(request)
  elif request.method == 'POST':
    try:
      action = request.POST['action']
    except KeyError:
      # Redisplay the question voting form.
      return _index_get(get_request)
    else:
      board = Board(Board.new_id())
      board.save()
      return HttpResponseRedirect(reverse('game:game_instance', args=(board.game_id,)))

def _index_get(get_request):
  return render(get_request, 'game/index.html', {'boards' : Board.objects.all()})

def game(request, game_id):
  board = get_object_or_404(Board, pk=game_id)
  error_message = ''
  if request.method == 'POST':
    try:
      if 'place' in request.POST.keys():
        new_state = board.game_state.place(request.POST['place'])
      elif 'jump' in request.POST.keys():
        new_state = board.game_state.jump(request.POST['jump'])
      else:
        raise ValueError('Unrecognized move')
    except (ValueError, TypeError) as e:
      error_message = e.args[0]
    else:
      board.board_state  = new_state.char_array
      board.current_turn = not board.current_turn
      board.save()
      return HttpResponseRedirect(reverse('game:game_instance', args=(board.game_id,)))

  return render(request, 'game/game.html', {'board' : board, 'error_message' : error_message})


# TO DO: Really want Game States (Histories) not Board States

from django.db import models
from django.db.models import Model

from .game_logic.config     import board_rows, board_cols
from .game_logic.game_state import initial_state

from random import choices
import string

id_len = 6
 # Longest possible jump string, approximately (comfortable upper bound)
max_move_str_length = (board_rows * board_cols) * 2

class Game(Model):
  game_id       = models.CharField(max_length = id_len, unique = True, primary_key = True)	
  date_created  = models.DateTimeField(auto_now_add=True)
  player_0_name = models.CharField(max_length = 30, default = 'Player 1')
  player_1_name = models.CharField(max_length = 30, default = 'Player 2')
  ai_player     = models.CharField(max_length = 30, default = None, null = True, )
  ai_player_num = models.BooleanField(default = False)

  def get_history(self):
    # Get the most recent move at each move_number
    history = (self.move_set
               .order_by('move_num', '-date_created')
               .distinct('move_num')
               .values('pk')
    )

    latest_move_per_num  = self.move_set.filter(pk__in = history)
    latest_move_num      = latest_move_per_num.latest('date_created').move_num

    history = (latest_move_per_num
               .filter(move_num__lte = latest_move_num)
               .order_by('move_num')
    )

    return history

  @classmethod
  def new_game(self,
               player_0_name = 'Player 1',
               player_1_name = 'Player 2',
               ai_player     = None,
               ai_player_num = False,
               game_id       = None):

    if game_id is None:
      game_id = self.new_id()
    game    = self.objects.create(game_id       = game_id,
                                  player_0_name = player_0_name,
                                  player_1_name = player_1_name,
                                  ai_player     = ai_player,
                                  ai_player_num = ai_player_num)

    initial_state = Move.objects.create(game_id = game)

    return game

  @classmethod
  def new_id(self, recursion = 0):
    if recursion > 10:
      raise RuntimeError('Unable to generate a new game ID at random')
    char_set = string.ascii_uppercase + string.digits
    to_try = ''.join(choices(char_set, k = id_len))
    if self.objects.filter(game_id = to_try).exists():
      return self.new_id(recursion = recursion + 1)
    else:
      return to_try


  def __repr__(self):
    return f'{self.game_id}'

class Move(Model):
  date_created    = models.DateTimeField(auto_now_add=True)
  board_state     = models.CharField(max_length = board_rows * board_cols, default = initial_state)
  move_num        = models.PositiveSmallIntegerField(default = 0)
  move_str        = models.CharField(max_length = max_move_str_length, default = 'Reset')
  game_id         = models.ForeignKey('Game', on_delete = models.CASCADE)
  ball_loc_letter_index = models.SmallIntegerField(default = 7)
  ball_loc_number_index = models.SmallIntegerField(default = 9)

  def __repr__(self):
    return f'{self.game_id.game_id} - Move {self.move_num} : {self.move_str}'



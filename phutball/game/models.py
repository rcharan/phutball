from django.db import models
from .game_logic.config     import board_rows, board_cols
from .game_logic.game_state import initial_state, GameState

from random import choices
import string
id_len = 6

class Board(models.Model):
  game_id       = models.CharField(max_length = id_len, unique = True, primary_key = True)
  date_created  = models.DateTimeField(auto_now_add=True)
  date_updated  = models.DateTimeField(auto_now=True)
  board_state   = models.CharField(max_length = board_rows * board_cols, default = initial_state)
  player_0_name = models.CharField(max_length = 30, default = 'Player 1')
  player_1_name = models.CharField(max_length = 30, default = 'Player 2')
  current_turn  = models.BooleanField(default = False)


  @property
  def game_state(self):
    if hasattr(self, '_game_state'):
      return self._game_state
    else:
      self._game_state = GameState(self.board_state)
      return self._game_state

  @classmethod
  def new_id(cls, recursion = 0):
    if recursion > 10:
      raise RuntimeError('Unable to generate a new game ID at random')
    char_set = string.ascii_uppercase + string.digits
    to_try = ''.join(choices(char_set, k = id_len))
    if cls.objects.filter(game_id = to_try).exists():
      return cls.new_id(recursion = recursion + 1)
    else:
      return to_try

  def __repr__(self):
    return f'{self.game_id}'

from django.db import models
import re

class Board(models.Model):
	game_id       = models.CharField(max_length = 6, unique = True, primary_key = True)
	date_created  = models.DateTimeField(auto_now_add=True)
    date_updated  = models.DateTimeField(auto_now=True)
    board_state   = models.CharField(max_length = 19 * 15)
    player_0_name = models.CharField(max_length = 30)
    player_1_name = models.CharField(max_length = 30)
    current_turn  = models.BooleanField()


class _Board:
  '''Board, representing the state of the game.
  
  '''
  
  def __init__(self):
    # (0,0) is the bottom left
    self._state = [
      [empty for _ in range(15)]
      for _ in range(19)
    ]
    self['H10']   = ball
    self.ball_loc = Location('H10')

  @property
  def victory(self):
    return self.ball_loc.goalline
    
  def move_ball(self, loc):
    self[self.ball_loc] = empty
    self.ball_loc  = loc
    if self.ball_loc.on_board:
      self[self.ball_loc] = ball
    elif not self.ball_loc.goalline:
      raise ValueError('Ball moved to illegal location')
        
  def copy(self):
    out = _Board()
    out.ball_loc = self.ball_loc
    out._state   = self._state.copy()
    return out

  def __getitem__(self, loc):
    loc = Location(loc)
    if not loc.on_board:
      raise ValueError('Location not on board')
    return self._state[loc.number_index][loc.letter_index]
  
  def __setitem__(self, loc, value):
    loc = Location(loc)
    self._state[loc.number_index][loc.letter_index] = value

  def __repr__(self):
    lines = [str(i+1).rjust(2) + ' ' + '-'.join(str(space) for space in row)
             for i, row in enumerate(self._state)
    ][::-1]
    sep_line = '\n' + '   ' + ' '.join('|'*15) + '\n'
    
    col_labels = '   ' + ' '.join(Location.board_letters)
    return '\n'.join([col_labels, sep_line.join(lines), col_labels])
  
  def place(self, loc):
    if not self.is_legal_place(loc):
      raise ValueError('Illegal Move')
    else:
      self[loc] = player
    return self
  
  def is_legal_place(self, loc):
    return self[loc] is empty
  
  def get_legal_jumps(self):
    '''Returns a list of allowed jumps. Each list of type
    ([Direction], Board) with the directions jumps must be taken in
    and the new state obtained
    '''
    directions = [Direction(n) for n in [1,2,3,4,6,7,8,9]]
    return sum((self._get_legal_jumps(direction) for direction in directions), [])
  
  def _get_legal_jumps(self, direction, mid_jump = False):
    # If a jump has already been started, either:
    #  - keep jumping if encountering a player; or
    #  - finish the jump
    if direction.delta_x == 0 and \
       direction.delta_y == 0:
        raise ValueError(f'Illegal (non-)jump {direction}')
    if mid_jump:
      target_loc = self.ball_loc + direction
      # Case 1: Victory
      if not target_loc.on_board and target_loc.goalline:
        new_state = self.copy()
        new_state.move_ball(target_loc)
        return [([direction], new_state)]
      # Case 2: failed jump
      elif not target_loc.on_board:
        return []
      else:
        # Advance the piece
        new_state = self.copy()
        new_state.move_ball(target_loc)
        # Case 3: Jump must continue
        if self[target_loc] is player:
          return new_state._get_legal_jumps(direction, mid_jump = True)
        # Case 4: Can consider new jumps, or no jump at all
        elif self[target_loc] is empty:
          out = [([direction], new_state)]
          for directions, new_new_state in new_state.get_legal_jumps():
            out.append(
              ([direction] + directions, new_new_state)
            )
          return out
        else:
          raise ValueError('Bad internal state')
    else: # Starting a new jump
      target_loc = self.ball_loc + direction
      if not target_loc.on_board:
        return []
      elif self[target_loc] is empty:
        return []
      elif self[target_loc] is player:
        new_state = self.copy()
        new_state.move_ball(target_loc)
        return new_state._get_legal_jumps(direction, mid_jump = True)
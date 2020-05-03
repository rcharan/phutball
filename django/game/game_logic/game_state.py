from .location       import Location
from .location_state import empty, player, ball, LocationState
from .config         import board_rows, board_cols
from .jump           import Jump


# Initial state: ball is in the middle
_num_spots = board_rows * board_cols
initial_state  = [empty.value] * (_num_spots // 2)
initial_state += [ ball.value]
initial_state += [empty.value] * (_num_spots // 2)
initial_state = ''.join(initial_state)

class GameState:
  '''Board, representing the state of the game.

  To construct, pass a character array, the serialized
  representation of a game state in the database.

  Attributes/Properties
  ---------------------

  char_array      : serialized representation of the state
  game_over       : bool, whether the game is over
  winner          : None (if game is not over) or bool: False for the
                    player defending the bottom winning; True vice versa
  place           : place a new player on the board (one of two legal move types)
  remove          : for undoing actions
  get_legal_jumps : A list of allowed jump strings
  jump             : Make a jump represented by an allowed jump string
  undo_jump       : for undoing actions
  '''
  
  def __init__(self, char_array = None):
    '''Accepts either blank (giving a blank construction) 
    or a sequence of board_rows * board_cols characters, each
    either 'X', 'O', or ' ' (as defined in the LocationState 
    enumeration). Character array starts at the bottom left
    and is rows-first.
    '''
    if char_array is not None:
      self.space_array = list(map(LocationState, char_array))
      try:
        self.ball_loc   = char_array.index(ball.value)
      except ValueError:
        pass
      else:
        self.ball_loc   = Location(self.ball_loc)

  def __getitem__(self, loc):
    return self.space_array[loc.flat_index]

  def __setitem__(self, loc, value):
    self.space_array[loc.flat_index] = value

  def copy(self):
    out = GameState()
    out.ball_loc     = self.ball_loc
    out.space_array  = self.space_array.copy()
    return out

  @property
  def char_array(self):
    return ''.join(map(lambda loc_state : loc_state.value, self.space_array))

  @property
  def game_over(self):
    return self.ball_loc.on_goal_line

  @property
  def winner(self):
    if not self.game_over:
      return None
    return self.ball_loc.number <= 1

  def _validate_user_input(self, loc):
    '''Returns a Location object on success
    (a location on the board),
    raises on failure'''
    if not isinstance(loc, str):
      raise TypeError('Please input a string')

    # Will raise on malformed input
    return Location(loc)

  def place(self, loc):
    loc = self._validate_user_input(loc)

    if self[loc] is not empty:
      raise ValueError('Illegal Move')

    out = self.copy()

    out[loc] = player
    return out
  
  def remove(self, loc):
    loc = self._validate_user_input(loc)
    if self[loc] is not player:
      raise ValueError("Can't undo a move that didnt' happen?")

    self[loc] = empty
    return self


  def _move_ball(self, loc):
    self[self.ball_loc]   = empty
    self.ball_loc         = loc
    if self.ball_loc.on_board:
      self[self.ball_loc] = ball
        
  def get_legal_jumps(self):
    return [str(jump) for jump in Jump.get_legal_jumps(self)]


  def jump(self, jump_str):
    allowed_jumps = Jump.get_legal_jumps(self)
    if jump_str not in allowed_jumps:
      raise ValueError('Jump not allowed')
    else:
      jump = allowed_jumps[allowed_jumps.index(jump_str)]
      return jump.new_state

  def undo_jump(self, jump_str):
    raise NotImplementedError('Not implemented yet')

  def _iterable(self, process_item = None):
    '''Returns and iterable of iterables.
    Outer loop goes by row, inner loop by
    columns

    Parameters
    ----------

    process_row: None or callable. If callable, it is passed
    a Location object as well as the datum in question.

    '''
    char_array = self.char_array
    out = []
    for _ in range(board_rows):
      row = char_array[-board_cols:]
      if process_item is not None:
        flat_indices = range(len(char_array) - board_cols, len(char_array))
        flat_indices = map(Location, flat_indices)
        row = [process_item(loc, datum) for loc, datum in zip(flat_indices, row)]
      out.append(row)
      char_array = char_array[:-board_cols]
    return iter(out)

  def __iter__(self):
    processor = lambda loc, datum : (str(loc), datum)
    return self._iterable(processor)

  def __repr__(self):
    return '\n'.join(self._iterable())

from .location       import Location
from .location_state import empty, player, ball, LocationState
from .direction      import directions
from .config         import board_rows, board_cols


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
  make_jump       : Make a jump represented by an allowed jump string
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
    return self.space_array(loc.flat_index)

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

  def _validate_user_input(loc):
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

    self[loc] = player
    return self
  
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
    return [jump_str for jump_str, _ in self._get_legal_jumps()]

  def make_jump(self, jump_str):
    for allowed_str, new_state in self._get_legal_jumps():
      if jump_str == allowed_str:
        return new_state
    raise ValueError('Jump not allowe')

  def undo_jump(self, jump_str):
    raise NotImplementedError('Not implemented yet')

  def _get_legal_jumps(self):
    '''Returns a list of allowed jumps. Each list of type
    ([jump_destination], GameState) with the locations the ball traverses
    and the new state obtained
    '''
    legal_jumps = (self._get_legal_jumps_from_rest(direction) for direction in directions)
    legal_jumps = sum(legal_jumps, [])
    legal_jumps = [(
      '-'.join(map(str, jump_seq)),
      new_state
    ) for jump_seq, new_state in legal_jumps]
    return legal_jumps
  
  def _get_legal_jumps_from_rest(self, direction):
    target_loc = self.ball_loc + direction
    if not target_loc.on_board:
      return []
    elif self[target_loc] is empty:
      return []
    elif self[target_loc] is player:
      new_state = self.copy()
      new_state.move_ball(target_loc)
      return new_state._get_legal_jumps_from_motion(direction)

  def _get_legal_jumps_from_motion(self, direction, mid_jump = False):
    target_loc = self.ball_loc + direction

    # Case 1: Victory by jumping off the board
    if not target_loc.on_board and target_loc.on_goal_line:
      new_state = self.copy()
      new_state.move_ball(target_loc)
      return [([target_loc], new_state)]

    # Case 2: failed jump
    elif not target_loc.on_board:
      return []

    # Otherwise, proceed with the jump
    else:

      # Advance the piece
      new_state = self.copy()
      new_state.move_ball(target_loc)

      # Case 3: Jump must continue
      if self[target_loc] is player:
        return new_state._get_legal_jumps_from_motion(direction)

      # Case 4: Can consider new jumps, or no jump at all
      elif self[target_loc] is empty:

        out = [([target_loc], new_state)]

        for future_locations, future_state in new_state.get_legal_jumps():
          out.append(
            ([target_loc] + future_locations, future_state)
          )
        return out

  def __iter__(self):
    '''Returns and iterable of iterables.
    Outer loop goes by row, inner loop by
    columns'''
    char_array = self.char_array
    out = []
    for _ in range(board_rows):
      out.append(char_array[-board_cols:])
      char_array = char_array[:-board_cols]
    return iter(out)

  def __repr__(self):
    return '\n'.join(iter(self))

from .direction      import directions
from .location_state import empty, player, ball

class Jump:
  '''Class to represent and calculate jumps'''

  def __init__(self, path, end_state):
    '''Instantiate with a singleton or list of intermediate/final
    locations for the ball, and the resulting the state'''
    self._path      = path
    self.new_state  = end_state

  @property
  def path(self):
    if isinstance(self._path, list):
      return self._path
    else:
      return [self._path]
  
  def __repr__(self):
    loc_strings = map(str, self.path)
    return '-'.join(loc_strings)

  def __eq__(self, jump):
    if isinstance(jump, str):
      return str(self) == jump
    else:
      return str(self) == str(jump)

  def __add__(self, other):
    '''Add two jumps, with the temporally/causally
    earlier jump on the *right*'''

    new_path  = self.path + other.path
    new_state = other.new_state
    return Jump(new_path, new_state)

  @classmethod
  def get_legal_jumps(self, board):
    '''Returns a list of allowed jumps'''
    legal_jumps = (self._get_legal_jumps_from_rest(board, direction) for direction in directions)
    return sum(legal_jumps, [])
  
  @classmethod
  def _get_legal_jumps_from_rest(self, board, direction):
    target_loc = board.ball_loc + direction

    # Case 1: Illegal destination
    if not target_loc or not target_loc.on_board:
      return []

    # Case 2: Nothing to jump over
    elif board[target_loc] is empty:
      return []

    # Case 3: Something to jump over
    elif board[target_loc] is player:
      new_state = board.copy()
      new_state._move_ball(target_loc)
      return self._get_legal_jumps_from_motion(new_state, direction)

  @classmethod
  def _get_legal_jumps_from_motion(self, board, direction):
    target_loc = board.ball_loc + direction

    # Case 1: Tried to jump to nowhere
    if not target_loc:
      return []

    # Advance the piece
    previous_occupant = board[target_loc]
    new_state = board.copy()
    new_state._move_ball(target_loc)

    # Case 2: Target is occupied: Jump must continue
    if previous_occupant is player:
      return self._get_legal_jumps_from_motion(new_state, direction)

    # Case 3: Finish the jump.
    elif previous_occupant is empty:
      jump = Jump(target_loc, new_state)
      out  = [jump]
      for future_jump in self.get_legal_jumps(new_state):
        out.append(jump + future_jump)
      return out


class Board:
  '''Board, representing the state of the game.'''
  
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
    out = Board()
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




class LocationState:
  
  def __init__(self, char = None):
    if not char:
      self.state = 'empty'
      self.char  = ' '
    elif char == 'X':
      self.state = 'player'
      self.char  = 'X'
    elif char == 'O':
      self.state = 'ball'
      self.char  = 'O'
    else:
      raise ValueError('Unknown location state')
      
  def __repr__(self):
    return self.state
  
  def __str__(self):
    return self.char
  
  def __eq__(self, other):
    return self.state == other.state
  
empty  = LocationState()
player = LocationState('X')
ball   = LocationState('O')

class Direction:
  '''Abstracts directions. Numeric coding is as on a standard number pad
  with 5 going nowhere.
  
  '''
  
  def __init__(self, num):
    if isinstance(num, int):
      self.delta_x = self.delta_y = 0
      if not (1 <= num <= 9):
        raise ValueError('Unknown direction code')

      # Delta x 
      if num in [1,4,7]:
        self.delta_x = -1
      elif num in [3,6,9]:
        self.delta_x = +1

      # Delta y
      if num in [1,2,3]:
        self.delta_y = -1
      elif num in [7,8,9]:
        self.delta_y = +1
        
      self.num = num
        
    elif isinstance(num, tuple):
      if not (
        len(num) == 2 and
        isinstance(num[0], int) and
        isinstance(num[1], int)
      ):
        raise ValueError('Unknown delta x/y')
      self.delta_x, self.delta_y = num
    else:
      raise TypeError
      
  def __add__(self, obj):
    if isinstance(obj, Direction):
      return Direction(
        (self.delta_x + obj.delta_x,
         self.delta_y + obj.delta_y
        )
      )
    elif isinstance(obj, Location):
      try:
        return Location(
          (self.delta_x + obj.letter_index,
           self.delta_y + obj.number
          )
        )
      except ValueError: # Location does not exist
        return None
    
  def __radd__(self, obj):
    return self.__add__(obj)
  
  def __repr__(self):
    if hasattr(self, 'num'):
      return '↙↓↘←.→↖↑↗'[self.num-1]
    else:
      return f'Direction: x{self.delta_x:+d},y{self.delta_y:+d}'

class Location:
  '''Abstracts a location on the board
  
  Attributes
  ----------
  
  number:       the number of the location (0-20 inclusive)
  numer_index:  number - 1 (0-indexed board positions)
  letter:       the letter index (A-H, J–P) as a character
  letter_index: the numeric index of the space (0-14 inclusive)
  
  Properties
  ----------
  
  on_board : bool
  goal_line: bool
  
  
  '''
  
  board_letters = 'ABCDEFGHJKLMNOP'
  
  def __init__(self, loc):
    '''Construct a location:
    
    Parameters
    ----------
    
    loc: either a string of the form A19 etc., or a 
         tuple of (letter_index, number).
    
    '''
    if isinstance(loc, str):
      match = re.match('([A-Z])\s*(\d+)$', loc, re.IGNORECASE)
      if not match:
        raise ValueError(f'Unknown location {loc}')
      
      letter, number = match.groups()
      self._number = int(number)
      self._letter = letter
      if self.letter not in self.board_letters:
        raise ValueError('Location does not exist')
      
    elif isinstance(loc, tuple):
      if len(loc) != 2:
        raise TypeError(f'Unable to construct location from tuple of length {len(loc)}')
      if not (isinstance(loc[0], int) and isinstance(loc[0], int)):
        raise TypeError(f'Invalid types for {loc}')
      self._letter_index, self._number = loc
      if not (0 <= self.letter_index <= 14):
        raise ValueError('Location does not exist')
        
    elif isinstance(loc, Location):
      self._number = loc.number
      self._letter = loc.letter
      
    else:
      raise TypeError(f'Unable to construct location from {loc}')
      
    if not (0 <= self.number <= 20):
      raise ValueError('Location does not exist')
      
  @property
  def number(self):
    return self._number
  
  @property
  def number_index(self):
    return self._number - 1
  
  @property
  def letter(self):
    if hasattr(self, '_letter'):
      return self._letter
    else:
      return self.board_letters[self._letter_index]
    
  @property
  def letter_index(self):
    if hasattr(self, '_letter_index'):
      return self._letter_index
    else:
      return self.board_letters.index(self._letter)
    
  @property
  def on_board(self):
    return 1 <= self.number <= 19
  
  @property
  def goal_line(self):
    return not (2 <= self.number <= 18)
  
  def __repr__(self):
    return f'{self.letter}{self.number}'
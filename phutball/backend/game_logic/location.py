from .config import board_rows, board_cols, board_letters

import re

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
  
  on_board    : bool
  on_goal_line: bool
  
  
  '''
  
  
  def __init__(self, *args):
    '''Construct a location:
    
    Parameters
    ----------
    
    args: either a string of the form A19 etc., or
          a pair of integers: letter_index, number
    
    '''
    if len(args) == 1 and isinstance(args[0], Location):
      self._copy_from_loc(loc)
    elif len(args) == 1 and isinstance(args[0], int):
      self._construct_from_flat_index(*args)
    elif len(args) == 1 and isinstance(args[0], str):
      self._construct_from_string(*args)
    elif len(args) == 2:
      self._construct_from_vector(*args)

  def _construct_from_string(self, loc):
    '''Accepts a string for example of the form H10.
    Meant to accept user input. Location must be on the board.
    To construct off-board locations, use the vector form

    '''

    # Parse the user input
    match = re.match(r'([A-Z])\s*(\d+)$', loc, re.IGNORECASE)
    if not match:
      raise ValueError(f'Unable to parse location {loc}')
    
    letter, number = match.groups()
    try:
      self._number = int(number)
    except: #Users are sneaky, watch out
      raise ValueError(f'Unable to parse location {loc}')
    self._letter = letter

    # Validate the input:
    if ((len(self.letter) != 1)               or # letter
        (self.letter not in board_letters)    or # letter
        (not self.on_board)):                    # number
      raise ValueError('Location not on the board')

  def _construct_from_vector(self, letter_index, number):
    '''Accepts x,y coordinates with (0,1) being the bottom
    left corner of the board. Coordinates one row above and
    below the board are accepted because they are legal end
    positions for the ball'''
      
    self._letter_index = letter_index
    self._number       = number

    # Validate input
    if ((not (0 <= self.letter_index <= board_cols - 1))  or 
        (not (0 <= self.number       <= board_cols + 1))):
      raise ValueError('Location does not exist')

  def _copy_from_loc(self, loc):
    self._number = loc.number
    self._letter = loc.letter

  def _construct_from_flat_index(self, index):
    '''Construct a location from its index in a flat array
    of size n = board_rows * board_cols and shape (n, ).

    Location must be on the board.
    '''
    if not (0 <= index <= board_rows * board_cols - 1):
      raise ValueError('Location not on board')

    self._letter_index = index %  board_cols
    self._number_index = index // board_cols

  @property
  def flat_index(self):
    '''Inverts the constructor from flat_index'''
    return self.letter_index + board_cols * self.number_index
      
  @property
  def number(self):
    if hasattr(self, '_number'):
      return self._number
    else:
      return self.number_index + 1
  
  @property
  def number_index(self):
    if hasattr(self, '_number_index'):
      return self._number_index
    else:
      return self.number - 1
  
  @property
  def letter(self):
    if hasattr(self, '_letter'):
      return self._letter
    else:
      return board_letters[self._letter_index]
    
  @property
  def letter_index(self):
    if hasattr(self, '_letter_index'):
      return self._letter_index
    else:
      return board_letters.index(self._letter)
    
  @property
  def on_board(self):
    return 1 <= self.number <= board_rows
  
  @property
  def on_goal_line(self):
    return not (2 <= self.number <= board_rows - 1)
  
  def __repr__(self):
    return f'{self.letter}{self.number}'
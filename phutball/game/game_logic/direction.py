from .location import Location

class Direction:
  '''Abstracts directions. Numeric coding is as on a standard number pad
  with 5 going nowhere.'''
  
  def __init__(self, num):
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
        
  def __add__(self, obj):
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
    return '↙↓↘←.→↖↑↗'[self.num-1]

directions  = [Direction(n) for n in [1,2,3,4,6,7,8,9]]

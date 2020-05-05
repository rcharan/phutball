from enum import Enum

class LocationState(Enum):
  EMPTY  = ' '
  PLAYER = '.'
  BALL   = 'O'
  
empty  = LocationState.EMPTY
player = LocationState.PLAYER
ball   = LocationState.BALL

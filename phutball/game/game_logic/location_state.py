from enum import Enum

class LocationState(Enum):
  EMPTY  = ' '
  PLAYER = 'X'
  BALL   = 'O'
  
empty  = LocationState.EMPTY
player = LocationState.PLAYER
ball   = LocationState.BALL

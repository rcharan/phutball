'''Base calculations for the geometry of the board and helper function
to build a new state

'''

from collections import namedtuple
from ..utilities import (
	config,
	PLAYER_CHANNEL,
	BALL_CHANNEL,
	NUM_CHANNELS,
	cartesian_product,
	lmap,
	join
)

import numpy as np

Index      = namedtuple('Index', ['row', 'col'])
MotionInfo = namedtuple('MotionInfo', ['index', 'direction'])

###############################################################################
#
# Jump Calculations 1 - the Direction abstraction
#
###############################################################################

# Return value for Direction.add
outInfo = namedtuple('OutInfo', ['index', 'isLegal', 'onBoard', 'direction'])

class Direction:
  '''Represents one of the 8 directions (horizontal, vertical,
  or 4 diagonals) based on the standard numpad 1-9. e.g.
  1 is down-left; 5 is stay pat; 8 is straight up.
  
  Coordinates are in index-coordinates (0-14 for the rows,
  and 0-18 for the columns). Compare board coordinates
  (1-15 and 1-19 respectively).
  
  Index col coordinates -1 and 19 are legal but not 
  on the board.
  
  Non-performant; will be wrapped in a cache.
  '''
  def __init__(self, direction):
    self.deltaX = 0
    self.deltaY = 0
    self.direction   = direction
    
    if direction in [1,4,7]:
      self.deltaX = -1
    elif direction in [3,6,9]:
      self.deltaX = +1
      
    # Note that the the y direction
    #  is reversed because the 0-index
    #  is at the top
    if direction in [1,2,3]:
      self.deltaY = +1 
    elif direction in [7,8,9]:
      self.deltaY = -1
      
  def add(self, index):
    
    outX = index.col + self.deltaX
    outY = index.row + self.deltaY
    
    if -1 <= outX <= config.cols + 1 and \
        0 <= outY < config.rows:
      legalPosition = True
    else:
      legalPosition = False
    
    if legalPosition and 0 <= outX < config.cols:
      onBoard = True
    else:
      onBoard = False
      
    return outInfo(Index(outY, outX), legalPosition, onBoard, self.direction)

###############################################################################
#
# Jump Calculations 2 - Computations from Rest
#
###############################################################################

def _get_dests_from_rest(currPos):
  '''Given the ball is at rest, find legal adjacent cells that
  it can attemt to start a jump in the direction of.

  Input
  -----

  currPos: a Position of form (row, col) with each an index
  (row is in range(config.rows), col in range(config.cols)

  Output
  ------

  Tuple of a Position and a direction, so of the form
  ((row, col), direction) with row and col as in the input.
  '''

  # 5 is not a direction. In order of the best to worst directions
  #  since we may later need to prioritize them.
  directions = map(Direction, [1,4,7,2,8,3,6,9][::-1])

  dests =  map  (lambda direction :                direction.add(currPos) , directions)
  dests = filter(lambda dest      :                dest.onBoard           , dests)
  dests = lmap  (lambda dest      : MotionInfo(dest.index, dest.direction), dests)
  return dests

# Cache the computations
get_dests_from_rest = {}
for currPos in cartesian_product(range(config.rows), range(config.cols)):
  get_dests_from_rest[currPos] = _get_dests_from_rest(Index(*currPos))


###############################################################################
#
# Jump Calculations 3 - Computations from Motion
#
###############################################################################


def _get_dest_from_motion(data):
  '''Get the next potential location of the ball
  given that it has already started a jump in the 
  direction determined by the data.

  Input
  -----

  data: tuple of the form (loc, direction) with loc a location-tuple
        (row_index, col_index) and direction an integer representation
        as per the Direction class

  Output
  ------

  Either an empty list (if the destination location is illegal) or 
  a singleton list (if it is legal). The contents of the list are 
  a location tuple (row_index, col_index) BUT the row_index can
  be -1 or config.cols (=19) since the ball can jump off the board.
  '''
  loc, direction = data
  
  direction = Direction(direction)
  new_loc   = direction.add(loc)
  if new_loc.isLegal:
    return new_loc.index
  else:
    return None

# Wrap in a cache
get_dest_from_motion = {}
for val in join(get_dests_from_rest.values()):
  get_dest_from_motion[val] = _get_dest_from_motion(val)

###############################################################################
#
# Jump Calculations 4 - Utility to build a new state
#
###############################################################################

def build_new_state(curr_state, dest_list, new_ball_loc):
  '''Create a new numpy array representing the new new state
  
  Input
  -----
  
  curr_state: current_state a shape (numChannels, config.rows, config.cols) 
              numpy array
              
  dest_list: a list of the initial and intermediate locations of the ball
             (but not the final location, which may not be on the board)

  new_ball_loc: the final location of the ball, which should be none
                if it is not on the board
                
  Output
  ------
  
  A new numpy array of same shape as curr_state that represents the new state
  '''
  
  delta = np.zeros((NUM_CHANNELS, config.rows, config.cols))
  
  initial_ball_loc = dest_list[0]
  players_removed  = dest_list[1:]
  
  delta[BALL_CHANNEL  ][initial_ball_loc]             = -1
  delta[PLAYER_CHANNEL][tuple(zip(*players_removed))] = -1
  if new_ball_loc is not None:
    delta[BALL_CHANNEL][new_ball_loc]               = +1
    
  return (curr_state + delta).astype(bool)


def reverse_move_str(move_str):
  if isinstance(move_str, list):
    return [Index(t[0], config.cols - 1 - t[1]) for t in move_str]
  else:
    return move_str[0] + str(20 - int(move_str[1:]))

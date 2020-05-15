'''Compute the next possible states given the current state

Exports: create_placement_getter, get_jumps

State representations are tensor of the shape (num_channels, num_rows, num_cols)
with dtype torch.bool. The last two dimensions represent the spacial configuration
of the board. The first dimension represents the channels:
  - Channel 0: Whether a player is located there
  - Channel 1: Whether the ball is located there
  - Channel 2: Whether a player located there is jumpable. (not implemented)
    
For simplicty, the case where the ball is off the board need not be considered.
If a state can be off the board **to the right only** (part of the winning condition),
a special return value will be given by get_jumps indicating this.

The bot will always be assumed to be playing to the **right**.
'''


import torch
import numpy as np

from collections import namedtuple
from .utilities import (
  BOARD_SHAPE,
  NUM_CHANNELS,
  PLAYER_CHANNEL,
  BALL_CHANNEL,
  config,
  product,
  get_flat_index,
  lmap,
  cartesian_product,
  join
)

END_LOC = -1
COL     = 1
CHAIN   = 1


###############################################################################
#
# Placement Calculation
#
###############################################################################

def create_placements(device):
  '''Creates a function that gets possible placements, doing computation
  on-device. A static tenors placements of all possible additions needed
  to create a placement is made, then, on function invocation,
  filtered and added to the current state'''

  # Create an array of all possible player additions, even the illegal ones
  #  Static: only has to be computed once. Performance not a concern.
  placements = np.zeros(
    (product(BOARD_SHAPE), NUM_CHANNELS, *BOARD_SHAPE)
  )

  for row in range(config.rows):
    for col in range(config.cols):
      flat_index = get_flat_index(row, col)
      
      placements[flat_index][PLAYER_CHANNEL][row][col] = 1
      
  placements = torch.tensor(
    placements,
    dtype = torch.bool,
    device = device,
    requires_grad = False
  )

  return placements

placements_static = dict()

def get_placements(curr_state, device):
  '''Given a state curr_state, compute legal next states due to placing
  a piece
  
  Input: a (channels, config.rows, config.cols) bool tensor representing
         the board state
  
  Output: a (branchNum, channels, config.rows, config.cols) bool tensor
          with dim=0 indexing the possible next states and brancNum
          the number of legal moves.
  
  '''

  # Consider only the ball and player layers and sum them and invert get legal positions
  players = curr_state.select(0, PLAYER_CHANNEL) # view
  ball    = curr_state.select(0, BALL_CHANNEL)   # view
  legal   = torch.bitwise_or(players, ball).bitwise_not_() # new tensor

  legal_indices = legal.flatten().nonzero(as_tuple=True)[0]

  if device not in placements_static:
    placements_static[device] = create_placements(device)
  
  placements = placements_static[device]

  new_placements = placements.index_select(0, legal_indices)
  new_states     = new_placements + curr_state
  
  return new_states


###############################################################################
#
# Jump Calculations 1 - the Direction abstraction
#
###############################################################################


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
    self.code   = direction
    
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
      
  def add(self, y, x):
    outInfo = namedtuple('OutInfo', ['index', 'isLegal', 'onBoard', 'code'])
    
    outX = x + self.deltaX
    outY = y + self.deltaY
    
    if -1 <= outX <= config.cols + 1 and \
        0 <= outY < config.rows:
      legalPosition = True
    else:
      legalPosition = False
    
    if legalPosition and 0 <= outX < config.cols:
      onBoard = True
    else:
      onBoard = False
      
    return outInfo((outY, outX), legalPosition, onBoard, self.code)

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
  directions = map(Direction, [1,4,7,2,8,3,6,9])

  dests =  map  (lambda direction : direction.add(*currPos), directions)
  dests = filter(lambda dest      : dest.onBoard           , dests)
  dests = lmap  (lambda dest      : (dest.index, dest.code), dests)
  return dests

# Cache the computations
get_dests_from_rest = {}
for currPos in cartesian_product(range(config.rows), range(config.cols)):
  get_dests_from_rest[currPos] = _get_dests_from_rest(currPos)


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
  new_loc   = direction.add(*loc)
  if new_loc.isLegal:
    return [new_loc.index]
  else:
    return []

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


###############################################################################
#
# Jump Calculations 5 - The actual computation
#
###############################################################################


def get_jumps(curr_state, max_jumps = None):
  '''Compute all possible changes giving new states

  Input
  -----

  curr_state: State tensor of shape (num_channels, config.rows, config.cols)
  
  Outputs
  -------

  Array of jump data each of the form (new_state_array, jump_chain) where
  new_state_array is a numpy array and a jump chain is a list of (row, col)
  tuples of intermediate and final locations of the ball along the jump
  (but excluding the initial location). In the case where it is possible
  to win, the return is a singleton array, which should be checked for the
  win condition.
  '''

  # Move computations to the cpu
  state    = curr_state.cpu().numpy()

  ball_loc = tuple(np.argwhere(state[BALL_CHANNEL])[0])

  # Queue of states to attempt to jump from, with data:
  #  (state_array, ball_loc, jump_chain).
  to_compute_from_rest   = [(state, ball_loc, [])]
  
  # Return list of jump data
  jumps                  = []

  while to_compute_from_rest:

    if len(jumps) > 1000000:
      raise RuntimeError('Excessive Number of Jumps')

    # Unpack the first item in the queue
    state, ball_loc, preceding_chain  = to_compute_from_rest.pop()
    
    # Compute the adjacent locations the ball may be able to jump to
    dests, directions = zip(*get_dests_from_rest[ball_loc])

    # Compute whether there is a player in each of those directions
    player_occupied   = state[PLAYER_CHANNEL][tuple(zip(*dests))]

    # For each potential jump
    for dest, direction, player_occupied in zip(dests, directions, player_occupied):
      
      # Jump is illegal if no player is there
      if not player_occupied:
        continue

      # Set up the list of initial/intermediate locations
      #  of the ball
      dest_list = [ball_loc, dest]

      # Loop while the jump hasn't failed or terminated
      while True:
        dest = get_dest_from_motion[(dest, direction)]

        # Don't jump off the board
        if not dest:
          break
        else:
          dest = dest[0]

        # The bot always moves to the right
        #  Never jump off the left
        if dest[COL] == -1:
          break

        # If the bot can jump off the right then the
        #  game is over. Raise that value up as there
        #  is no further inference step for the bot.
        #  i.e. hard-code winning
        if dest[COL] == config.cols:
          new_state = build_new_state(state, dest_list, new_ball_loc = None)
          jump_data = (new_state, preceding_chain + [dest])
          return [jump_data]

        # See whether there is a player in the new location
        player_occupied = state[PLAYER_CHANNEL, dest[0], dest[1]]
        
        # If there is, the ball can go there and keep moving
        #  so continue the loop
        if player_occupied:
          dest_list.append(dest)

        # If not, the jump terminates
        elif not player_occupied:
          new_state = build_new_state(state, dest_list, new_ball_loc = dest)
          jump_data = (new_state, preceding_chain + [dest])

          # If the jump is a winning jump,
          #  just return it as a (winning)
          #  singleton array
          if dest[0] == config.cols - 1:
            return [jump_data]
          
          # Queue the new state for potential chaining
          to_compute_from_rest.append((new_state, dest, preceding_chain + [dest]))

          # Only put the jump_data in the list of 
          #  jumps to evaluate if it doesn't make you lose
          if dest[COL] != 0:
            jumps.append(jump_data)
            
          break
            
  if max_jumps is not None and len(jumps) > max_jumps:
    return prioritize_jumps(jumps, max_jumps)
  else:
    return jumps

###############################################################################
#
# Jump Calculations 6 - Truncation/prioritization
#
###############################################################################


def count_col_endings(jump_chains):
  # Possible cols are 0 through 18
  #  (19 is a win condition). Also 0 isn't
  #  possible but this keeps it simple.
  value_counts = [0] * (config.cols - 1)
  for jump_chain in jump_chains:
    end_col = jump_chain[END_LOC][COL]
    try:
      value_counts[end_col] += 1
    except Exception as e:
      msg = f'end_col: {end_col}\n' + \
            f'jump_chain: {jump_chain}\n' + \
            f'value_counts: {value_counts}\n'

  return value_counts

def get_cutoff(col_counts, max_jumps = 300):
  '''Get the cutoff for where the jump ends
  
  Returns (col_num, num_of_that_col_to_take)
  '''
  cum = 0
  for col_num in range(17, -1, -1):
    cum += col_counts[col_num]
    if cum > max_jumps:
      return col_num, max_jumps - cum + col_counts[col_num]

def filter_jumps(jumps, cutoff_col, num_of_cutoff_to_take):
  left_to_take = num_of_cutoff_to_take
  out = []
  
  for jump in jumps:
    if jump[1][END_LOC][COL] > cutoff_col:
      out.append(jump)
    elif jump[1][END_LOC][COL] == cutoff_col:
      if left_to_take > 0:
        left_to_take -= 1
        out.append(jump)

  return out

def prioritize_jumps(jumps, max_jumps):
  '''Returns the best max_jumps jumps using heuristics

  The heuristics are: 
   - Jumps that end close to the goalline are better
   - Jumps that are computer earlier (meaning they went left,
      if at all, earlier - based on the tree search order) are
      better
  '''
  # Pull out the jump chain data
  jump_chains = [jump[1] for jump in jumps]


  col_ending_counts = count_col_endings(jump_chains)

  cutoff_col, num_of_cutoff_to_take = get_cutoff(col_ending_counts)

  return filter_jumps(jumps, cutoff_col, num_of_cutoff_to_take)
  

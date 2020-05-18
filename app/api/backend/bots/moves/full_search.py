'''This module exports get_jumps which finds *all* the possible
jumps and then returns the MAX_JUMPs (default 300) that get the
bot closest to the right.
'''

from .abstractions import (
  get_dests_from_rest,
  get_dest_from_motion,
  build_new_state,
  MotionInfo,
  Index
)

from ..utilities import (
  BALL_CHANNEL,
  PLAYER_CHANNEL,
  config
)

import numpy as np

END_LOC = -1
CHAIN   = 1

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

  ball_loc = Index(*np.argwhere(state[BALL_CHANNEL])[0])

  # Queue of states to attempt to jump from, with data:
  #  (state_array, ball_loc, jump_chain).
  to_compute_from_rest   = [(state, ball_loc, [])]
  
  # The list of jump data
  jumps                  = []

  while to_compute_from_rest:

    if len(jumps) > max_jumps * 10:
      break

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
        dest = get_dest_from_motion[MotionInfo(dest, direction)]

        # Don't jump off the board
        if dest is None:
          break

        # The bot always moves to the right
        #  Never jump off the left
        if dest.col == -1:
          break

        # If the bot can jump off the right then the
        #  game is over. Raise that value up as there
        #  is no further inference step for the bot.
        #  i.e. hard-code winning
        if dest.col == config.cols:
          new_state = build_new_state(state, dest_list, new_ball_loc = None)
          jump_data = (new_state, preceding_chain + [dest])
          return [jump_data]

        # See whether there is a player in the new location
        player_occupied = state[PLAYER_CHANNEL, dest.row, dest.col]
        
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
          if dest.col == config.cols - 1:
            return [jump_data]
          
          # Queue the new state for potential chaining
          to_compute_from_rest.append((new_state, dest, preceding_chain + [dest]))

          # Only put the jump_data in the list of 
          #  jumps to evaluate if it doesn't make you lose
          if dest.col != 0:
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
    end_col = jump_chain[END_LOC].col
    value_counts[end_col] += 1

  return value_counts

def get_cutoff(col_counts, max_jumps = 300):
  '''Get the cutoff for where the jump ends
  
  Returns (col_num, num_of_that_col_to_take)
  '''
  cum = 0
  for col_num in range(config.cols-2, -1, -1):
    cum += col_counts[col_num]
    if cum > max_jumps:
      return col_num, max_jumps - cum + col_counts[col_num]

def filter_jumps(jump_data, cutoff_col, num_of_cutoff_to_take):
  left_to_take = num_of_cutoff_to_take
  out = []
  
  for jump_datum in jump_data:
    if jump_datum[1][END_LOC].col > cutoff_col:
      out.append(jump_datum)
    elif jump_datum[1][END_LOC].col == cutoff_col:
      if left_to_take > 0:
        left_to_take -= 1
        out.append(jump_datum)

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
  

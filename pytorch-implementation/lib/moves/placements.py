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
from ..utilities import (
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



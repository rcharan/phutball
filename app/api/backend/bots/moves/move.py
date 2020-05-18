import torch
from .placements import get_placements
from .full_search import get_jumps, END_LOC, CHAIN
from ..utilities import config

MAX_JUMPS = 300

def get_move_options(curr_state, xIsNext):
  '''Given the current state, determine the move options

  Inputs
  ------

  curr_state: state tensor of shape (num_channels, rows, cols)

  device: a torch.device where the output will be mapped

  Outputs
  -------

  force_game_over: Boolean; whether the game can be ended in one
                   move. If so, this move is forced.

  final_states   : a list of final states

  move_strs      : a list of either move strings or jump-chains
  '''

  if not xIsNext:
    curr_state = torch.flip(curr_state, [-1])

  # Compute the placements
  placements, move_strs = get_placements(curr_state, device)

  # Compute the jumps
  jumps = get_jumps(curr_state, MAX_JUMPS)

  # Deal with special cases/win condition for the jump
  
  # No jumps to worry about
  if len(jumps) == 0:
    moves = placements
  
  # Win condition
  elif (
    len(jumps) == 1 and
    jumps[0][CHAIN][END_LOC].col in [config.cols, config.cols-1]):
    return [jumps[0][0]], [jumps[0][CHAIN]]
  
  # Regular jump evaluation
  else:
    # Retain only the final state
    jumps = [jump_data[0] for jump_data in jumps]
    jumps = torch.tensor(jumps, dtype = torch.bool, device = device)
    moves = torch.cat([placements, jumps])
    
  # Turn the board around to represent the opponent's view
  moves = torch.flip(moves, [-1])

  return False, moves, move_strs + [jump_data[CHAIN] for jump_data in jumps]
  

def batch_eval(model, data, batch_size):
   # Batch the moves
  batches = torch.split(moves, batch_size)
  
  # We only need to differentiate the best score
  #  track which one that is.
  best_score = None
  best_index = None
  curr_index = 0

  for batch in batches:
    
    # Run the model
    score, index = model(batch)

    # Update running tally of best score
    #  Old best scores should have their graphs
    #  destroyed

    if best_score is None or score < best_score:
      best_score = score
      best_index = curr_index + index

    # Keep track of how many indices we've traversed to 
    #  get best_index correct
    curr_index += batch.shape[0]
    
    
  return best_score, best_index
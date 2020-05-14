import torch
from .moves import get_placements, get_jumps, END_LOC, COL, CHAIN
from .utilities import config

MAX_JUMPS = 300

def get_move_options(curr_state, device):
  '''Given the current state, determine the move options

  Inputs
  ------

  curr_state: state tensor of shape (num_channels, rows, cols)

  device: a torch.device where the output will be mapped

  Outputs
  -------

  force_game_over: Boolean; whether the game can be ended in one
                   move. If so, this move is forced.

  data           : depends on force_game_over. If force_game_over
                   is true, a jump chain representing the jump.
                   If force_game_over is false, a tensor of move
                   options of shape (num_options, num_channels,
                   rows, cols) representing the resulting states
                   of each move option AFTER the board has been
                   turned around.
  '''

  # Compute the placements
  placements = get_placements(curr_state, device)

  # Compute the jumps
  jumps = get_jumps(curr_state, MAX_JUMPS)

  # Deal with special cases/win condition for the jump
  
  # No jumps to worry about
  if len(jumps) == 0:
    moves = placements
  
  # Win condition
  elif (
    len(jumps) == 1 and
    jumps[0][CHAIN][END_LOC][COL] in [config.cols, config.cols-1]):
    return True, jumps[0]
  
  # Regular jump evaluation
  else:
    # Retain only the final state
    jumps = [jump_data[0] for jump_data in jumps]
    jumps = torch.tensor(jumps, dtype = torch.bool, device = device)
    moves = torch.cat([placements, jumps])
    
  # Turn the board around to represent the opponent's view
  moves = torch.flip(moves, [-1])

  return False, moves
  

def get_next_move_training(curr_state, model, device, off_policy = lambda _ : None, batch_size = None):
  '''Get the next move for the bot
  
  Gets the next move for the bot with computations and
  return value suitable for training only
  (i.e. gradients are taken)
  
  If off_policy is not None, the off_policy move is
  selected instead.
  
  Gradients with respect to the value-function applied
  at the best move are accumlated and availabe to the caller
  
  Inputs
  ------
  
  curr_state: binary tensor of shape (channels, rows, cols)
              reprenting the game state
              
  off_policy: callable with signature
              off_policy(num_available_moves: int) returning
              either None or the index of the move desired.
              If the return value is not None AND the bot 
              cannot otherwise win on that move, then that
              move is made.
              
  batch_size: either None (in which case no batch is done)
              or an int, in which case moves are evaluated
              in batches. (Decreased performance, improved
              memory usage).

  Outputs
  -------
  game_over  : boolean. Whether the bot can (and does) win
             on this move. The bot *always* plays a
             win-in-one move when it is available, regardless
             of the off-policy argument.
             
  off_policy : boolean. Whether an off-policy move was made.
             OR: value is None if game is over
  
  new_state  : a binary tensor of same shape as curr_input
             representing the new state of the game after
             the bot moves AND the board is flipped around
             to present it from opponents view. OR: value
             is None if game is over.
               
  value      : value of the value-function applied to new_state.
             OR: value is None if the game is over.
  '''

  game_over, moves = get_move_options(curr_state, device)
  if game_over:
    return True, None, None, None # The game is over!

  # Either make an off policy move, or evaluate the value-function
  #  to determine the policy
  off_policy_move = off_policy(moves.shape[0])
  if off_policy_move is not None:
    move     = moves[off_policy_move].unsqueeze(0)
    score, _ = model(move)
    return False, True, move, score
      
  # Run the model
  if batch_size is None:
    score, index = model(moves)
  else:
    score, index = batch_eval(model, data, batch_size)

  # Return
  return False, False, moves[index], score


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
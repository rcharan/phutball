# Tensorflow solely for the Progress Bar (totally worth it)
from .utilities import ProgressBar

from .testing_utilities import create_state, random_board
from .move_selection import get_next_move_training


def training_loop(model, optimizer, num_games, device, off_policy = lambda _ : None, verbose = 1, initial = None):
  
  bar = ProgressBar(num_games, expandable = False)

  if initial is None:
    initial_state = create_state('H10').to(device)
  else:
    initial_state = random_board(initial)

  for i in range(num_games):
    if verbose >= 2:
      print(f'\nPlaying game {i+1} of {num_games}:')
    elif verbose >= 1:
      bar.step()
      
    game_loop(initial_state, model, optimizer, device, off_policy, verbose)

def game_loop(initial_state, model, optimizer, device, off_policy, verbose = 2):
  '''Training loop that plays one game'''
  # Just in case
  optimizer.zero_grad()
  
  # Initialization
  state    = initial_state
  score, _ = model(state.unsqueeze(0))
  v_t      = optimizer.restart(score)
  
  # Progress Bar
  if verbose >= 2:
    bar      = ProgressBar(100)
  
  while True:

    # Determine the next move
    game_over, moved_off_policy, new_state, score = \
      get_next_move_training(state, model, device, off_policy = off_policy)
    
    if game_over:      
      delta = 1 - v_t
      optimizer.step(delta, update_trace = False)
      
      if verbose >= 2:
        # Terminate the progress bar
        bar.terminate()

      break
    
    elif moved_off_policy:
      # Equivalent to starting a new game
      v_t = optimizer.restart(score)
      
    else:
      score.backward()
      delta = (1 - score) - v_t
      optimizer.step(delta)
      optimizer.zero_grad()
      
      v_t   = score.item()
      state = new_state
      
    if verbose >= 2:
      # Progress bar
      bar.step()
    



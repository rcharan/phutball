# Tensorflow solely for the Progress Bar (totally worth it)
from tensorflow.keras.utils import Progbar as ProgressBar

from .testing_utilities import create_state
from .move_selection import get_next_move_training

def training_loop(model, optimizer, num_games, device, off_policy = lambda _ : None):
  
  initial_state = create_state('H10').to(device)
  for i in range(num_games):
    print(f'\nPlaying game {i+1} of {num_games}:')
    game_loop(initial_state, model, optimizer, device, off_policy)

def game_loop(initial_state, model, optimizer, device, off_policy):
  '''Training loop that plays one game'''
  # Just in case
  optimizer.zero_grad()
  
  # Initialization
  state    = initial_state
  score, _ = model(state.unsqueeze(0))
  v_t      = optimizer.restart(score)
  
  # Progress Bar
  bar      = ProgressBar(284)
  move_num = 1
  
  while True:
    # Determine the next move
    game_over, moved_off_policy, new_state, score = \
      get_next_move_training(state, model, device, off_policy = off_policy)
    
    if game_over:      
      delta = 1 - v_t
      optimizer.step(delta, update_trace = False)
      
      # Terminate the progress bar
      bar.target = move_num
      bar.update(move_num)

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
      
    # Progress bar
    move_num += 1
    if move_num >= bar.target * 0.9:
      bar.target += bar.target // 10 + 1
    
    bar.update(move_num)
    



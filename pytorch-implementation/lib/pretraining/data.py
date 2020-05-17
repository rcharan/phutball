import numpy as np
import torch
from lib.utilities import config

def random_board_batch(min_density, max_density, batch_size, device):
  '''Creates random boards
  
  Each board has players assigned to each position with probability p
  where p is chosen uniformly at random from [min_density, max_density]
  once for each board.
  
  The ball is placed randomly in a position where the game is not over,
  and no player can be in that location.
  
  Inputs
  ------
  
  min_density: minimum value for p
  max_density: maximum value for p
  batch_size : number of boards generated
  device     : a torch.device to map the output to
  
  Returns
  -------
  
  boards     : a tensor of shape (batch_size, NUM_CHANNELS, rows, cols)
  ball_cols  : the column index where the ball is located, a tensor of
               shape (batch_size,)
  
  '''
  densities    = np.random.uniform(min_density, max_density, (batch_size, 1, 1))
  player_layer = np.random.uniform(0, 1, (batch_size, config.rows, config.cols))
  player_layer = player_layer > densities

  ball_layer = np.zeros((batch_size,config.rows,config.cols))

  row_indices = np.random.randint(   config.rows,     size = batch_size)
  col_indices = np.random.randint(1, config.cols - 1, size = batch_size)

  ball_layer[range(batch_size), row_indices, col_indices] = 1

  player_layer = player_layer * (1 - ball_layer)

  boards = np.stack([player_layer, ball_layer], axis = 1).astype(bool)
  return (torch.tensor(boards     , dtype = torch.bool , device = device), 
          torch.tensor(col_indices, dtype = torch.float, device = device))
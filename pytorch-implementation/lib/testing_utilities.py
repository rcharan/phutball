import matplotlib.pyplot as plt
import math
import numpy as np
import re
import torch
import seaborn as sns
from   more_itertools import unique_everseen
from .utilities import (
  config,
  BOARD_SHAPE,
  product
)
from .training import create_state

plt.ioff()
sns.set()

class InvalidConfiguration(Exception):
  pass


def parseLocation(locStr):
  '''Turn a string like H10 into a location tuple''' 
  try:
    match = re.match(f'([{config.letters}])(\\d+)', locStr)
  except Exception as e:
    raise ValueError(f'Bad Location {locStr}') from e
  if not match:
    raise ValueError(f'Bad location {locStr}')

  row, col = match.groups()
  row = config.letters.index(row)
  col = int(col) - 1
  
  return row, col


def visualize_state(tensor):
  plt.close() # save memory
  
  data = tensor.cpu().numpy()
  players = (data[0], 'black')
  ball    = (data[1], 'red')
  
  if (players[0] + ball[0]).max() > 1:
    raise InvalidConfiguration('Play and Ball collocated')
  elif ball[0].sum() != 1:
    raise InvalidConfiguration('Wrong number of balls')
  
  fig, ax = plt.subplots()
  ax.set_xlim([0.5  , 19.5])
  ax.set_ylim([-15.5, -0.5])
  ax.grid(True)
  ax.set_xticks(list(range(1,20)))
  ax.set_yticks(list(range(-15, 0)));
  ax.set_yticklabels('ABCDEFGHJKLMNOP'[::-1])

  for (array, color) in [players, ball]:
    for row in range(15):
      for col in range(19):
        if array[row][col]:
          ax.add_patch(plt.Circle((col+1, -(row+1)), 0.3, color=color))

  return fig


def genLoc(n, *exclude, depth = 0):
  '''Generate n random locations not overlapping exclude'''
  
  if depth > 10:
    raise RecursionError('Unable to generate enough examples by choosing at random with replacement')
  letter_choices = list(iter(config.letters))
  
  # Create a few extra to account for exclusions
  letters = np.random.choice(letter_choices, math.floor(n * 2)).tolist()
  nums    = np.random.randint(1, 20, n + 3).tolist()
  
  locs = map(lambda tup : tup[0] + str(tup[1]), zip(letters, nums))
  locs = filter(lambda loc : loc not in exclude, locs)
  locs = list(unique_everseen(locs))
  
  if len(locs) < n:
    return genLoc(n, *exclude, depth = depth + 1)
  else:
    return locs[:n]

# 50 boards of varying sizes
np.random.seed(42)
boards = [create_state('H10', *genLoc(i, 'H10')) for i in range(50)]

# Some special configurations
test_locs = []
for let in 'ABCDEF':
  test_locs.append(f'{let}{11}')
  test_locs.append(f'{let}{9}')
for num in range(1,18):
  test_locs.append(f'G{num}')

winnable_locs = test_locs + ['G18']
winnable_locs_2 = [f'H{n}' for n in range(11,20)]

test_1           = create_state('H10', *test_locs)
winnable_state   = create_state('H10', *winnable_locs) #misnomer
winnable_state_2 = create_state('H10', *winnable_locs_2)

###############################################################################
#
# Model Parameter Counting
#
###############################################################################


def get_num_params(model, printIt = True):
  out = sum(product(p.shape) for p in model.parameters())
  print(f'{out:,d} parameters')

def get_param_num_details(model):
  for n, p in model.named_parameters():
    print(f'{product(p.shape):7,d}', n)
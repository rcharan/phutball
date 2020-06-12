from collections import namedtuple
from functools import reduce
from itertools import product as cartesian_product
from itertools import chain
from tensorflow.keras.utils import Progbar

###############################################################################
#
# Configuration
#
###############################################################################

# Configuration variables
NUM_CHANNELS   = 2
Config = namedtuple('Config', ['rows', 'cols', 'letters', 'num_channels'])
config = Config(15, 19, 'ABCDEFGHJKLMNOP', NUM_CHANNELS)
BOARD_SHAPE    = (config.rows, config.cols)
PLAYER_CHANNEL = 0
BALL_CHANNEL   = 1

###############################################################################
#
# Game specific computations
#
###############################################################################

# Indexing goes according to the torch.flatten
#  logic, with earlier dimensions (here: row)
def get_flat_index(row, col):
  return row * config.cols + col

###############################################################################
#
# Functional programming
#
###############################################################################

# Exists in the math module in python 3.8+
def product(iterable, start = 1):
  return reduce(lambda x, y : x * y, iterable, start)

def lmap(func, iterable): return list(map(func, iterable))
def lfilter(predicate, iterable): return list(filter(predicate, iterable))

# List are monads
# "A monad is just a monoid in the category of endofunctors, what's the problem?"
join = chain.from_iterable


class ProgressBar:
  '''Wrapper for tf.keras.progbar that accounts for unknown length of game

  For simplicity, the interface is slightly changed and not all features are
  supported.

  Methods
  -------

  step: increment the bar by one step. Will extend the target length if
        the bar is more than 90% of the way done.

  terminate: step the bar AND cause it to end

  Attributes
  ----------

  move_num: number of moves made so far

  '''

  def __init__(self, estimated_length, verbose = True, expandable = True):
    self._bar     = Progbar(estimated_length)
    self._move_num = 0
    self.verbose = verbose
    self.expandable = expandable

  @property
  def move_num(self):
    return self._move_num

  def step(self):
    self._move_num += 1

    curr_target = self._bar.target
    if self._move_num >= curr_target * 0.9 and self.expandable:
      self._bar.target += curr_target // 10 + 1
    
    if self.verbose:
      self._bar.update(self._move_num)

  def terminate(self):
    self._move_num += 1
    self._bar.target = self._move_num

    if self.verbose:
      self._bar.update(self._move_num)

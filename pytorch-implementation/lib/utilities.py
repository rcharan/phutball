from collections import namedtuple
from functools import reduce
from itertools import product as cartesian_product
from itertools import chain

###############################################################################
#
# Configuration
#
###############################################################################

# Configuration variables
Config = namedtuple('Config', ['rows', 'cols', 'letters'])
config = Config(15, 19, 'ABCDEFGHJKLMNOP')
BOARD_SHAPE    = (config.rows, config.cols)
NUM_CHANNELS   = 2
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


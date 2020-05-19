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


###############################################################################
#
# Board Arithmetic
#
###############################################################################


def flat_index(str_rep):
  return config.letters.index(str_rep[0]) * config.cols + int(str_rep[1:]) - 1

def index(flat_index):
  return (flat_index // config.cols, flat_index % config.cols)

def str_rep(flat_index):
  return config.letters[flat_index // config.cols] + str(flat_index % config.cols + 1)

def str_assign(old_str, index, char):
  return old_str[:index] + char + old_str[index+1:]

def place(piece, str_rep, board):
  return str_assign(board, flat_index(str_rep), piece.value)

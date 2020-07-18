'''Implements temperature to choose from top k moves'''
import torch.nn.functional as F
from torch.distributions.categorical import Categorical

def stochastic_move(move_vals, temp):
  probs = F.softmax(move_vals / temp, dim = -1)
  dist  = Categorical(probs = probs)
  index = dist.sample()
  return move_vals[index], index

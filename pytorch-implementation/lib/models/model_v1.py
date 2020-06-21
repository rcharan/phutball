import torch
from lib.utilities import config, product

from torch.nn import (
	Module,
	ModuleList,
	Conv2d,
	SELU,
	MaxPool2d,
	Sequential,
	Linear,
	Flatten,
	Dropout,
	Sigmoid,
)

import torch.nn.functional as F

from .components import ResidualConvStack

class TDConway(Module):
  
  def __init__(self, config, dropout = 0.2):
    super(TDConway, self).__init__()
    
    self.stack_1 = ModuleList([
      ResidualConvStack(3, 64, layer_structure = [1,2,2], initial_depth = config.num_channels),
      ResidualConvStack(5, 64, layer_structure = [1,2,2], initial_depth = config.num_channels),
    ])
    
    self.stack_2 = ModuleList([
      ResidualConvStack(1, 64 * 2, layer_structure = [0, 2, 2]),
      ResidualConvStack(3, 64 * 2, layer_structure = [0, 2, 2]),
      ResidualConvStack(5, 64 * 2, layer_structure = [0, 2, 2]),
    ])
    
    
    self.fc = Sequential(
      Flatten(), 
      Linear(64 * 2 * 3 * config.rows * config.cols, 512),
      SELU(),
      Dropout(dropout),
      Linear(512, 2048),
      SELU(),
      Dropout(dropout),
      Linear(2048, 1),
      Sigmoid()
    )
    
  def forward(self, signal, get_all_values = False):
    signal = signal.float()
    
    signal = torch.cat(
      [conv_stack(signal) for conv_stack in self.stack_1],
      dim = 1
    )
    
    signal = torch.cat(
      [conv_stack(signal) for conv_stack in self.stack_2],
      dim = 1
    )
    
    signal = self.fc(signal)
    
    values = signal.squeeze()
        
    if get_all_values:
      return values
    else:
      (best_value, best_index) = torch.min(values, 0)
      return best_value, best_index
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

from .models.components import ConvStack
from .temperature       import stochastic_move

class TDConway(Module):
  
  def __init__(self, config, dropout = 0.2):
    super(TDConway, self).__init__()
    
    self.stack_1 = ConvStack(3, 64, num_layers = 2, initial_depth = config.num_channels)

    self.pool  = MaxPool2d(3, 3, (0,1)) # Downsample (15,19) -> (5, 7)

    # See PyTorch docs for torch.nn.MaxPool2d
    pooled_height = (config.rows + 2) // 3
    pooled_width  = (config.cols + 4) // 3
    
    self.stack_2 = ConvStack(3, 128, num_layers = 2, initial_depth = 64)
    
    
    self.fc = Sequential(
      Flatten(), 
      Linear(128 * pooled_height * pooled_width, 256),
      SELU(),
      Dropout(dropout),
      Linear(256, 2048),
      SELU(),
      Dropout(dropout),
      Linear(2048, 1),
      Sigmoid()
    )
    
  def forward(self, signal, get_all_values = False, temperature = None):
    signal = signal.float()
    

    signal = self.stack_1(signal)
    signal = self.pool(signal)
    signal = self.stack_2(signal)
    signal = self.fc(signal)
    
    values = signal.squeeze(dim = -1)
        
    if get_all_values:
      return values
    elif temperature is None or temperature == 0:
      (best_value, best_index) = torch.min(values, 0)
      return best_value, best_index
    else:
      return stochastic_move(values, temperature)

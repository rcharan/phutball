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

class ResidualConvStack(Module):

  def __init__(self, kernel_size, conv_depth, layer_structure = [1,2], initial_depth = None, activation = SELU):
    '''Convolution Stack with Residual Structure.
    
    Inputs
    ------
    
    kernel_size    : as in Conv2d
    conv_depth     : output depth
    layer_strucutre: list of ints. The first int represents the number of convolutions
                     to apply initially. After that, each int represents a number of
                     convolutions to apply before adding the residual from the previous
                     state. The default [1,2] does 1 convolution to output "x" and then 
                     does two convolutions and adds x
    initial_depth  : depth of the first input (defaults to conv_depth)
    activation     : class for activation
    
    '''
    super(ResidualConvStack, self).__init__()
    
    if initial_depth is None:
      initial_depth = conv_depth
    
    self.convs = ModuleList([])
    self.convs.append(Conv2d(initial_depth, conv_depth, kernel_size, padding = kernel_size // 2))
    
    for _ in range(sum(layer_structure) - 1):
      self.convs.append(Conv2d(conv_depth, conv_depth, kernel_size, padding = kernel_size // 2))
    
    self.layer_structure = layer_structure
    self.activation      = activation()
    
  def forward(self, signal):
    num_applied = 0
    for i, num_layers in enumerate(self.layer_structure):
      to_apply     = self.convs[num_applied : num_applied + num_layers]
      num_applied += num_layers
      
      resid_signal = signal
      
      for j, layer in enumerate(to_apply):
        signal = layer(signal)
        if j != num_layers - 1:
          signal = self.activation(signal)
        
      if i != 0:
        signal = resid_signal + signal
        
      signal = self.activation(signal)
      
    return signal

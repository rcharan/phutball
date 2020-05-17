from .data import random_board_batch
from tensorflow.keras.utils import Progbar
import torch.nn.functional as F
from torch.optim import SGD
import torch
from ..utilities import config


def pre_train(model, optimizer, loops = 10000, batch_size = 300, seed = None):
  '''Pre-train the model to learn an simpler value function

  The value function is computed by the random board generator
  and is the (normalized) column that the ball is in.

  Inputs
  ------
  model: a model to train that supports get_all_values=True
       when called on the forward pass in order to return
       the computed values (instead of the best move).

  loops: number of batches to do

  batch_size: number of randomly generated boards

  seed: None or int, a random seed for the board generator.
        If None, no seed is given.

  lr: the learning rate (or alpha)

  device: e.g. torch.device('cpu'), the device on which to
          do computations

  '''

  if seed is not None:
    np.random.seed(seed)

  device = next(model.parameters()).device

  min_density = 0
  max_density = 0.3

  bar = Progbar(loops)
  for _ in range(loops):
    boards, targets = random_board_batch(
        min_density, 
        max_density, 
        batch_size,
        device
    )

    targets.mul_(1/config.cols)

    predictions = model(boards, get_all_values = True)
    loss        = F.mse_loss(predictions, targets)

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    bar.add(1, values = ('loss', loss.item()))


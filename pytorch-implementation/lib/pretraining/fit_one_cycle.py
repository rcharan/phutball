from .pre_training import random_board_batch
from ..training import ProgressBar
import torch.nn.functional as F
from torch.optim import SGD
import torch
from ..utilities import config


def fit_one_cycle(model):

  optimizer = SGD(model.parameters(), lr = 0.01)
  device = next(model.parameters()).device

  min_density = 0
  max_density = 0.3


  data = []
  min_lr = 10.0 ** -5
  max_lr = 10.0 ** +1
  delta  = 1 + 10.0 ** -10

  lr = min_lr

  bar = ProgressBar(600)

  while lr < 10.0 ** 1:
    boards, targets = random_board_batch(
        min_density, 
        max_density, 
        batch_size,
        device
    )

    if (bar.move_num + 1) % 10 == 0:
      lr *= delta
      for param_group in optimizer.param_groups:
          param_group['lr'] = lr

    targets.mul_(1/config.cols)

    predictions = model(boards, get_all_values = True)
    loss        = F.mse_loss(predictions, targets)

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    bar.step()

    data.append((lr, loss))

  return data


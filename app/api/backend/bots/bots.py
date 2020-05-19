import torch
import numpy as np

from .models.model_v2 import TDConway
from .utilities import config
from .player import Player

# T.D. Conway
tdconway = TDConway(config)
version  = '0.2.2'
game_num = 20500

import os
dirname  = os.path.dirname(__file__)
filename = os.path.join(dirname, f'models/v{version}-{game_num}.pt')

sd = torch.load(filename, map_location = torch.device('cpu'))
tdconway.load_state_dict(sd['model'])
tdconway = Player(tdconway)

# Randotron
class RandoTron(Player):

	def __init__(self):
		super(RandoTron, self).__init__(None, None)

	def _pick_move_index(self, options):
		return np.random.randint(options.shape[0])

randotron = RandoTron()

# Exports
bots = {
	't.d. conway' : tdconway,
	'randotron'   : randotron
}
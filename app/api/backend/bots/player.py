import torch
import numpy as np
from .moves.move import get_move_options, batch_eval
from ..game_logic.location_state import empty, player, ball
from .utilities import (
	config,
	PLAYER_CHANNEL,
	BALL_CHANNEL,
)
from .moves.abstractions import reverse_move_str, Index


class Player:

	def __init__(self, model, batch_eval = 32):
		self.model = model
		self.batch_eval = batch_eval
		if hasattr(model, 'eval'):
			model.eval()

	def _pick_move_index(self, options):
		if len(options) == 1:
			best_index = 0
		else:
			with torch.no_grad():
				if self.batch_eval is None:
					_, best_index = self.model(options)
				else:
					_, best_index = batch_eval(self.model, options, self.batch_eval)

		return best_index

	def make_move(self, board, move_num, force_index = None):
		'''moveNum: number of the move to be made

		Force index is for testing purposes
		'''

		curr_state = space_array_to_tensor(board)

		# Determine whether play is to the right
		#  If not, turn the board around.
		xIsNext = move_num % 2 == 1

		options, move_strs = get_move_options(curr_state, xIsNext)

		best_index = self._pick_move_index(options)
		if force_index is not None:
			best_index = force_index

		state_tensor = options  [best_index]
		move_str     = move_strs[best_index]

		# If the bot is playing as X, the board has been flipped
		#  around. Turn it back
		if xIsNext:
			state_tensor = torch.flip(state_tensor, [-1])
		else:
			move_str     = reverse_move_str(move_str)

		space_array, ball_loc = tensor_to_space_array(state_tensor)

		if ball_loc is None:
			ball_loc = move_str[-1]

		# Turn jumps into jump strings
		if isinstance(move_str, list):
			move_str = '*' + '-'.join(
				map(index_to_str, move_str)
			)

		return space_array, ball_loc, move_str

def index_to_str(index):
	return f'{config.letters[index.row]}{index.col+1}'

def space_array_to_tensor(space_array):
	'''Given the game's representation of the board as a string, construct a tensor'''

	players = np.array([char==player.value for char in space_array])
	balls   = np.array([char==ball.value   for char in space_array])

	players = players.reshape(config.rows, config.cols)
	balls   = balls.reshape(config.rows, config.cols)

	state   = np.stack([players, balls])

	return torch.tensor(state, dtype = torch.bool)


def tensor_to_space_array(tensor):
	'''Given the tensor representation, serialize'''
	arr     = tensor.numpy()
	players = arr[PLAYER_CHANNEL]
	balls   = arr[BALL_CHANNEL]

	try:
		ball_loc = Index(*np.argwhere(balls)[0])
	except IndexError:
		ball_loc = None

	space_array = [' '] * (config.cols * config.rows)
	for i, player_bool, ball_bool in zip(range(config.cols * config.rows), players.flatten(), balls.flatten()):
		if player_bool:
			space_array[i] = player.value
		elif ball_bool:
			space_array[i] = ball.value

	return ''.join(space_array), ball_loc



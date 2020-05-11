from .location_state import empty, player, ball, LocationState
from .config         import board_rows, board_cols

# Initial state: ball is in the middle
_num_spots = board_rows * board_cols
initial_state  = [empty.value] * (_num_spots // 2)
initial_state += [ ball.value]
initial_state += [empty.value] * (_num_spots // 2)
initial_state = ''.join(initial_state)

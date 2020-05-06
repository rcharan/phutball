from django.test import TestCase

# Create your tests here.
from .models import Game, Move
from .serializers import GameSerializer, MoveSerializer, IntegrityError
from .game_logic.board_state import initial_state
from .game_logic.config import board_rows, board_cols
from .game_logic.location_state import player

class DataModelTests(TestCase):
  # def setUp(self):
    # game    = Game.new_game()
    # history = game.get_history()

  def test_create_new_game_and_check_history(self):
    game    = Game.new_game()
    history = game.get_history()

    self.assertIs(len(history), 1)

  def test_branching_move_history(self):
    '''Test resolution of two branches of a game'''
    game    = Game.new_game()

    # First Branch
    game.move_set.create(move_num = 1, move_str = '1:1')  
    game.move_set.create(move_num = 2, move_str = "1:2")  
    game.move_set.create(move_num = 3, move_str = "1:3")  
    game.move_set.create(move_num = 4, move_str = "1:4")  

    # Second Branch starts at move 2
    game.move_set.create(move_num = 2, move_str = "2:2")
    game.move_set.create(move_num = 3, move_str = "2:3")

    # Game should only return the latest updated branch
    resolved_moves = [move.move_str for move in game.get_history()]
    self.assertEqual(resolved_moves, ['Reset', '1:1', '2:2', '2:3'])


class GameSerializerTests(TestCase):

  def test_db_integrity_check(self):
    game = Game.new_game()
    game.move_set.create(move_num = 3)
    with self.assertRaises(IntegrityError):
      GameSerializer(game).data

  def test_serialize_game(self):

    game = Game.new_game()

    # Computations for the initial ball location
    ball_loc_flat_index   = initial_state.index('O')
    ball_loc_number_index = ball_loc_flat_index % config.cols
    ball_loc_letter_index = ball_loc_flat_index // config.cols

    initial_board = {
      'space_array' : initial_state,
      'ball_loc'    : {
        'number_index' : ball_loc_number_index,
        'letter_index' : ball_loc_letter_index
      }
    },  
    
    # Make a move
    next_state    = initial_state.copy()
    next_state[3] = player
    game.move_set.create(board_state = next_state, move_num = '1',
                         move_str = 'A4')

    next_board = {
      'space_array' : next_state,
      'ball_loc' : {
        'number_index' : ball_loc_number_index,
        'letter_index' : ball_loc_letter_index
      }
    }


    serializer = GameSerializer(game)
    data = serializer.data

    self.assertEqual(data, {
      'board' : next_board,
      'game_id' : game.game_id, 
      'player_0_name' : 'Player 1',
      'player_1_name' : 'Player 2',
      'ai_player'     : False,
      'ai_player_num' : False,
      'history'       : [{'moveStr' : 'Reset', 'board' : initial_board},
                         {'moveStr' : 'A4'   , 'board' : next_board}],
      'moveNum'       : 2,
      'jumpMouseOver' : None,
      'xIsNext'       : False
    })

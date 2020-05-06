from django.test import TestCase

# Create your tests here.
from .models import Game, Move
from .serializers import GameSerializer, MoveSerializer, IntegrityError
from .game_logic.game_state import initial_state
from .game_logic import config
from .game_logic.location_state import player
from django.db.models import Model

###############################################################################
#
# Equality Checking
#  - Recursive through data structures (Models, lists or dicts)
#  - Source: the output to be tested
#  - Target: the expected output, as a JSON-style dict
#
###############################################################################

def compare_structs(self, source, target):
  # Show long diffs on failure
  self.maxDiff = None

  # Entry point for Model-type sources
  if isinstance(source, Model):
    # If the Source is a Model, check for the fields defined
    self.assertTrue(isinstance(target, dict))
    source_as_dict = {}
    for key in target:
      source_as_dict[key] = source.__getattribute__(key)
    source = source_as_dict

  # Base case for atomic types
  elif not isinstance(source, dict):
    self.assertEqual(source, target)
    return

  # Unwrap the source from Django wrappers
  else:
    source = {k : v for k, v in source.items()}

  # Compare Datatypes
  self.assertEqual(type(source), type(target))

  # Check keys
  self.assertEqual(sorted(source.keys()), sorted(target.keys()))

  for key in source.keys():

    # Compare dictionaries recursively
    if isinstance(source[key], dict):
      compare_structs(self, source[key], target[key])

    # Compare lists element wise recursively
    elif isinstance(source[key], list):
      for s, t in zip(source[key], target[key]):
        compare_structs(self, s, t)

    # If the source has a model as a value,
    #  ask the model for the appropriate key again
    elif isinstance(source[key], Model):
      compare_structs(self, source[key].__getattribute__(key), target[key])

    # Otherwise, assert direct equality
    else:
      self.assertEqual(source[key], target[key])

###############################################################################
#
# Examples
#  - For use as inputs/expected outputs
#
###############################################################################

# Computations for the initial ball location
ball_loc_flat_index   = initial_state.index('O')
ball_loc_number_index = ball_loc_flat_index % config.board_cols
ball_loc_letter_index = ball_loc_flat_index // config.board_cols

# Data Structure for the Initial Position
initial_board = {
  'space_array' : initial_state,
  'ball_loc'    : {
    'number_index' : ball_loc_number_index,
    'letter_index' : ball_loc_letter_index
  }
}  


# Data for a possible first move (to A4)
next_state    = initial_state[:2] + player.value + initial_state[3:]
next_move_str = 'A4'
next_move_num = 1

next_board = {
  'space_array' : next_state,
  'ball_loc' : {
    'number_index' : ball_loc_number_index,
    'letter_index' : ball_loc_letter_index
  }
}


###############################################################################
#
# Test The Data Model
#
###############################################################################

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

###############################################################################
#
# Test Game Serializer
#
###############################################################################

class GameSerializerTests(TestCase):

  def test_db_integrity_check(self):
    game = Game.new_game()
    game.move_set.create(move_num = 3)
    with self.assertRaises(IntegrityError):
      GameSerializer(game).data


  def test_serialize_game(self):

    game = Game.new_game()
    
    # Make a move
    game.move_set.create(board_state = next_state, move_num = next_move_num,
                         move_str = next_move_str)

    # Output of serializer
    serializer = GameSerializer(game)
    data = serializer.data

    # Expected output (when serializer is a dict)
    target = {
      'board'         : next_board,
      'game_id'       : game.game_id, 
      'player_0_name' : 'Player 1',
      'player_1_name' : 'Player 2',
      'ai_player'     : False,
      'ai_player_num' : False,
      'history'       : [{'move_str' : 'Reset'      , 'board' : initial_board},
                         {'move_str' : next_move_str, 'board' : next_board   }],
      'moveNum'       : 2,
      'jumpMouseOver' : None,
      'xIsNext'       : False
    }

    # Compare
    compare_structs(self, data, target)

###############################################################################
#
# Test Move Serializer
#
###############################################################################

class MoveSerializerTests(TestCase):

  def test_read(self):
    game = Game.new_game()

    # Serialize the game's only move
    serializer = MoveSerializer(game.move_set.all()[0])
    data = serializer.data

    target = {
      'game_id'     : game.game_id,
      'move_str'    : 'Reset',
      'move_num'    : 0,
      'ball_loc'    : initial_board['ball_loc'],
      'space_array' : initial_board['space_array']
    }

    self.maxDiff = None
    compare_structs(self, data, target)

  def test_write(self):
    game = Game.new_game()

    new_move = {
      'game_id'     : game.game_id,
      'move_str'    : next_move_str,
      'move_num'    : next_move_num,
      'space_array' : next_board['space_array'],
      'ball_loc'    : next_board['ball_loc'],
    }

    serializer = MoveSerializer(data=new_move)
    serializer.is_valid()
    serializer.save()

    target = {
      'board_state' : next_state,
      'move_num'    : 1,
      'move_str'    : next_move_str,
      'game_id'     : game.game_id,
      'ball_loc_letter_index' : next_board['ball_loc']['letter_index'],
      'ball_loc_number_index' : next_board['ball_loc']['number_index']
    }

    source = game.move_set.filter(move_num = 1)[0]

    compare_structs(self, source, target)

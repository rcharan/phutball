from rest_framework.serializers import Serializer, ModelSerializer
from .models import Game, Move, id_len
from .game_logic import config

###########################################################################
#
# JS Data internal Structure:
#
# Game State, initial:
# - board         : initialBoard,
# - xIsNext       : true,
# - history       : [{moveStr : 'Reset', board : initialBoard}],
# - moveNum       : 1, // Number of move about to be made, 0 is start-of-game
# - jumpMouseOver : null, 
#
# Board state:
# - this.spaceArray = flatArray.slice();
# - this.ballLoc    = ballLoc
#
#
# For serialized data structure, see the tests file
#
###########################################################################


###########################################################################
#
# Utilities
#
###########################################################################


class IntegrityError(Exception):
  '''Database Integrity Error'''
  pass


def location(boardDict):
  return {
    'number_index' : boardDict['ball_loc_number_index'],
    'letter_index' : boardDict['ball_loc_letter_index']
  }


###########################################################################
#
# Move Serialize
#  - Read and Write for passing state changes to the frontend
#
###########################################################################

class MoveSerializer(ModelSerializer):
  class Meta:
    model  = Move
    fields = ['game_id', 'move_str', 'move_num', 'board_state', 'ball_loc_letter_index', 'ball_loc_number_index']

  def to_representation(self, instance):
    ret = super().to_representation(instance)

    ret['ball_loc']    = location(ret)
    ret['space_array'] = ret['board_state']
    del ret['ball_loc_letter_index'], ret['ball_loc_number_index'], ret['board_state']
    return ret

  def to_internal_value(self, data):
    out = {}
    out['game_id']     = data['game_id']
    out['move_str']    = data['move_str']
    out['move_num']    = int(data['move_num'])
    out['board_state'] = data['space_array']
    out['ball_loc_letter_index'] = data['ball_loc']['letter_index']
    out['ball_loc_number_index'] = data['ball_loc']['ball_loc_number_index']
    return out





###########################################################################
#
# Game Serializer
#  - Read only, for loading the server-side state. (Writes are by passing
#     single moves or creating a fresh game only).
#
###########################################################################

class BoardStateSerializer(ModelSerializer):
  '''Utility for Serializing Moves in the Read-only Game representation'''
  class Meta:
    model    = Move
    fields   = ['board_state', 'ball_loc_number_index', 'ball_loc_letter_index']
  
  def to_representation(self, instance):
    ret = super().to_representation(instance)
    
    out = {
      'space_array' : ret['board_state'],
      'ball_loc'    : location(ret)
    } 

    return out

class GameSerializer(ModelSerializer):
  '''Read Only to send Game State to the Frontend'''
  class Meta:
    model  = Game
    fields = ['game_id', 'player_0_name', 'player_1_name', 'ai_player', 'ai_player_num']

  def to_representation(self, instance):
    '''Add in move history, other associated data'''
    ret = super().to_representation(instance)

    move_history = instance.get_history()

    history_data = []

    for move_num, move in enumerate(move_history):
      history_data.append({'moveStr' : move.move_str, 'board' : BoardStateSerializer(move).data})
      if move_num != move.move_num:
        raise IntegrityError

    ret['history']       = history_data
    ret['board']         = history_data[-1]['board']
    ret['moveNum']       = move_num + 1
    ret['jumpMouseOver'] = None
    ret['xIsNext']       = (ret['moveNum'] % 2 == 1)

    return ret



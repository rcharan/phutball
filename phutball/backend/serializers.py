from rest_framework.serializers import Serializer, ModelSerializer
from .models import Game, Board, id_len

###########################################################################
#
# JS Data Structure:
#
# Game State, initial:
# - board         : initialBoard,
# - xIsNext       : true,
# - history       : [{moveStr : 'Reset', board : initialBoard}],
# - moveNum       : 1, // Number of move about to be made, 0 is start-of-game
# - jumpMouseOver : null, 
#
# - this.spaceArray = flatArray.slice();
# - this.ballLoc    = ballLoc
#
###########################################################################


# # Read and Write
# class BoardSerializer(serializers.ModelSerializer):
#   class Meta:
#     model  = Board
#     fields = ['game_id', 'move_str', 'move_num', 'board_state']


# class IntegrityError(Exception):
#   '''Database Integrity Error'''
#   pass

class BoardStateSerializer(Serializer):
  '''Utility for Serializing Board States in the Read-only Game representation'''
  class Meta:
    model            = Game
    read_only_fields = ['board_state', 'ball_loc_number_index', 'ball_loc_letter_index']
  
  def to_representation(self, instance):
    ret = super().to_representation(instance)
    
    out = {
      'spaceArray' : ret['board_state'],
      'ballLoc'    : {
          numberIndex : ret['ball_loc_number_index'],
          letterIndex : ret['ball_loc_letter_index']
      }
    } 

    return out

class GameSerializer(serializers.ModelSerializer):
  '''Read Only to send Game State to the Frontend'''
  class Meta:
    model  = Game
    read_only_fields = ['game_id', 'player_0_name', 'player_1_name', 'ai_player', 'ai_player_num']

  def to_representation(self, instance):
    '''Add in move history, other associated data'''
    ret = super().to_representation(instance)

    move_history = instance.get_history()

    history_data = []

    for move_num, move in enumerate(move_history):
      history_data.append({'moveStr' : move.move_str, 'board' : BoardStateSerializer(move).data})
      if move_num != move.move_num
        raise IntegrityError

    ret['board']         = history_data[-1]['board']
    ret['moveNum']       = move_num + 1
    ret['jumpMouseOver'] = None
    ret['xIsNext']       = (ret['moveNum'] % 2 == 1)

    return ret



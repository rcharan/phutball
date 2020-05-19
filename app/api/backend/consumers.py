import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Game, Move
from .serializers import MoveSerializer
from .bots.bots import bots

# Testable behaviours:
#  - reject connection for non-existent game
class LiveConsumer(WebsocketConsumer):
    def connect(self):
        self.game_id    = self.scope['url_route']['kwargs']['game_id']
        self.player_num = self.scope['url_route']['kwargs']['game_id'] # either X or O

        try:
            self.game = Game.objects.get(pk = self.game_id)
        except Game.DoesNotExist as e:
            raise channels.exceptions.DenyConnection from e

        # Join the group for the game
        # (enables message passing to other player)
        async_to_sync(self.channel_layer.group_add)(
            self.game_id,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave game group
        async_to_sync(self.channel_layer.group_discard)(
            self.game_id,
            self.channel_name
        )

    def receive(self, text_data):
        move_data = json.loads(text_data)

        #  write to the database
        serializer = MoveSerializer(data = move_data)

        if serializer.is_valid():
            serializer.save()

        else:
            self.send(text_data = json.dumps({
                'success' : False,
            }))
            return

        # Send message to game group
        async_to_sync(self.channel_layer.group_send)(
            self.game_id,
            {
                'type'      : 'move_message',
                'move_data' : move_data,
            }
        )

    # Receive message from game group
    def move_message(self, event):
        move_data = event['move_data']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'success'  : True,
            'move_data': move_data
        }))

class AIConsumer(WebsocketConsumer):
    def connect(self):
        self.game_id    = self.scope['url_route']['kwargs']['game_id']

        try:
            self.game = Game.objects.get(pk = self.game_id)
        except Game.DoesNotExist as e:
            raise channels.exceptions.DenyConnection from e

        bot_name = self.game.ai_player
        if bot_name not in bots:
            raise channels.exceptions.DenyConnection

        self.bot = bots[bot_name]

        self.accept()

        curr_move_num = len(self.game.get_history())
        o_is_next     = (curr_move_num % 2 == 0)

        if self.game.ai_player_num == o_is_next:
            self.do_bot_move()

    def do_bot_move(self, prev_move = None):
        if prev_move is None:
            prev_move = self.game.get_history()
            prev_move = prev_move[len(prev_move) - 1]
            prev_move = MoveSerializer(prev_move)

        move_num    = prev_move.data['move_num'] + 1
        board_state = prev_move.data['space_array']

        board_state, ball_loc, move_str = self.bot.make_move(board_state, move_num)

        move = Move.objects.create(
            board_state = board_state,
            move_num    = move_num,
            move_str    = move_str,
            game_id     = self.game,
            ball_loc_number_index = ball_loc.col,
            ball_loc_letter_index = ball_loc.row
        )
        move.save()

        serializer = MoveSerializer(move)
        move_data  = serializer.data

        self.send(text_data = json.dumps({
            'success'  : True,
            'move_type': 'ai',
            'move_data': move_data
        }))

    def receive(self, text_data):
        move_data = json.loads(text_data)

        # Handle the player move and write to the database
        serializer = MoveSerializer(data = move_data)

        if serializer.is_valid():
            serializer.save()
            self.send(text_data = json.dumps({
                'success'   : True,
                'move_type' : 'player',
                'move_data' : move_data
            }))

        else:
            self.send(text_data = json.dumps({
                'success'   : False,
                'move_type' : 'player'
            }))
            return

        self.do_bot_move(serializer)


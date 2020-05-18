import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Game
from .serializers import MoveSerializer

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
        print('Received a message')
        move_data = json.loads(text_data)
        print(move_data)

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
            self.game = Game.objects.get(pk = game_id)
        except game.DoesNotExist as e:
            raise channels.exceptions.DenyConnection from e

        # TO DO: Load the bot

        self.close() 
        self.accept()

    def receive(self, json_string):
        move_data = json.loads(move_data)

        # Handle the player move and write to the database
        serializer = MoveSerializer(data = move_data)

        if serializer.is_valid():
            serializer.save()
            self.send(text_data = json.dumps({
                'success'   : True,
                'move_type' : 'player'
            }))

        else:
            self.send(text_data = json.dumps({
                'success'   : False,
                'move_type' : 'player'
            }))
            return

        # TO DO: Get the Bot's Move


        self.send(text_data = json.dumps({
            'success'  : True,
            'move_type': 'ai',
            'move_data': move_data
        }))
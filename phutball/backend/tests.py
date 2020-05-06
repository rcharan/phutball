from django.test import TestCase

# Create your tests here.
from .models import Game, Move

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




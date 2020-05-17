from .move_selection    import get_move_options, batch_eval
from .testing_utilities import create_state
from .training          import ProgressBar
from .utilities         import lmap, join
from .timer import Timer
from statistics import mean
from math import sqrt

import numpy as np
import torch

class Draw(RuntimeError):
  pass

class Player:
  '''Wrapper for any form of a player (e.g. a model)
  
  Wrapped model should take as input a tensor of moves, each
  representing the state of the board after play AND after
  the board is turned around and return (_, move_index) of
  the desired move.
  
  This class enforces the game rules and win conditions.
  
  Parameters
  ----------
  
  model: a model, callable with input/output as described above
  
  batch_eval: None or an int. If none, no batching is done. If
              an int, the batch size is used. In batch eval, 
              model must return (score, move_index) where the
              move_index is the index *within* the batch and
              score will be used to compare across batches.
              The move with the LOWEST score will be selected.
  '''
  
  def __init__(self, model = None, batch_eval = None, name = None):
    '''Model may be None for subclasses not utilizing a model'''
    self.model      = model
    self.batch_eval = batch_eval
    self._name       = name

  def get_name(self, default_name):
    if self._name is None:
      return default_name
    else:
      return self._name
    
  def eval(self):
    if hasattr(self.model, 'eval'):
      self.model.eval()
    
  def _get_move(self, options):
    '''Return the index of the desired move.
    
    Override this for wrapped models not ducktyped
    as expected.
    '''
    if self.batch_eval is None:
      _, index = self.model(options)

    else:
      _, index = batch_eval(model, options, self.batch_eval)

    return index

  
  def play(self, state, device = torch.device('cpu')):
    '''Make a move!
    
    Inputs
    ------
    
    State: a (num_channels, rows, cols) tensor
    
    Outputs
    -------
    
    game_over: whether the player wins on the move
               Note: all players are automatically
               hardcoded by the wrapper and the 
               underlying game engine to win if
               they have a win-in-one move.
               
    new_state: selected move by the player with the
               board turned around to represent the 
               opponents view after the move. OR:
               None, if the game ends
    
    '''
    
    with torch.no_grad():
      game_over, options = get_move_options(state, device)
      if game_over:
        return True, None
      
      index = self._get_move(options)
        
      return False, options[index]


class RandoTron(Player):
  '''RandoTron! As featured in Season 4 of Rick and Morty.
  
  RandoTron always plays randomly, except when forced by
  the game engine to win-in-one. It can be a highly
  effective strategy, as evidenced by RandoTron's effective
  heists.
  '''
  
  def __init__(self, seed = None, name = None):
    if name is None:
      name = 'RandoTron'
    super(RandoTron, self).__init__(name = name)
    
    # Note: seed is shared globally.
    if seed is not None:
      np.random.seed(seed)
    
  def _get_move(self, options):
    num_options = options.shape[0]
    
    return np.random.randint(num_options)

class Battle:
  '''A faceoff between two bots!
  
  Constructor should receive two instances of 
  the Player class
  '''
  def __init__(self, player1, player2, verbose = 2):
    '''Verbosity:
     2  - print a progress bar for each game showing each move
     1  - print a progress bar showing number of games played
     0  - print only a summary at the end
     -1 - print nothing
    '''
    
    self.players = [player1, player2]
    self.order   = [0,1]
    
    self.reset_stats()
    self.verbose = verbose
    
  def reset_stats(self):
    self.win_counts   = [0, 0, 0] # Last one is a draw
    self.game_lengths = [[], []]

  def randomize_start_player(self):
    np.random.shuffle(self.order)
    
  def _assign_win(self, playerNum, turnsTaken):
    self.win_counts[playerNum] += 1
    self.game_lengths[playerNum].append(turnsTaken)
        
  def play_game(self, device = torch.device('cpu')):
    state = create_state('H10').to(device)
    bar = ProgressBar(150, self.verbose > 1)
        
    xIsNext = True
    
    while True:
      curr_player = self.players[self.order[xIsNext]]
      game_over, state = curr_player.play(state, device)
      
      if game_over:
        bar.terminate()
        self._assign_win(self.order[xIsNext], bar.move_num)
        break
      
      else:
        bar.step()
        xIsNext = not xIsNext
        
      if bar.move_num >= 1000:
        self.error_state = state
        raise RuntimeError('Game terminated in a forced draw because it is taking too long')
        
  def play_match(self, num_games, device = torch.device('cpu')):
    if self.verbose == 1:
      bar = ProgressBar(num_games, expandable = False)
    self.reset_stats()
    self.timer = Timer()
    
    for _ in range(num_games):
      self.randomize_start_player()
      try:
        self.play_game(device)
      except Draw:
        self.win_counts[-1] = 2

      if self.verbose == 1:
        bar.step()
        
    self.timer.stop()
    
    if self.verbose >= 0:
      self.summarize_results()
    
  def summarize_results(self, timer = None):
    games_played   = sum(self.win_counts)
    draws          = self.win_counts[-1]
    finished_games = self.win_counts[:2]
    isTie          = self.win_counts[0] == self.win_counts[1]
    victor         = self.win_counts[1] > self.win_counts[0]

    names          = lmap(lambda num : self.players[num].get_name(f'Player {num+1}'), [0,1])
    victorPct      = self.win_counts[victor] / sum(finished_games)

    if victorPct == 1.0:
      print(f'{names[victor]} won every game of {games_played} non-draw games.')
      print(f'Mean game length: {battle.play_match(900, device)}')
      print(f'Total time taken: {self.timer} at\n'
            f' - {self.timer/sum(finished_games)} per finished game.\n'
            f' - {self.timer/sum(join(self.game_lengths))} per move in a finished game')
    
    else: 
      mean_game_lens = lmap(mean, self.game_lengths)
      moe = sqrt(victorPct * (1-victorPct))/sqrt(sum(finished_games))
    
      print(f'{games_played} games were played between {names[0]} and {names[1]} with {draws} draws.')
    

      if isTie:
        print(f'Result was a statistically improbable tie!')
      else:
        print(f'The winner was {names[victor]} with a {victorPct*100:.1f}% win rate!')
      
      print(f'{names[0]} on average won in a game of length {mean_game_lens[0]:.1f}.\n'
            f'{names[1]} on average won in a game of length {mean_game_lens[1]:.1f}\n'
            f'Overall average length of game was {mean(join(self.game_lengths))}')
    
    if hasattr(self, 'timer'):
      print(f'Total time taken: {self.timer} at\n'
            f' - {self.timer/sum(finished_games)} per finished game.\n'
            f' - {self.timer/sum(join(self.game_lengths))} per move in a finished game')
    
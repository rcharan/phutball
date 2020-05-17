import torch
from torch.optim import Optimizer

class AlternatingTDLambda(Optimizer):
  '''Implements tracing and updates for the TD(λ) algorithm.
  
  For details see Sutton and Barto, Reinforcement Learning 2ed,
  Chaper 12 Section 2.
  
  Modifications:
    (1) the algorithm is modified to compute traces
        one step early (when the graph is available). Hence, trace must be
        initialized with update_trace before calling step.
        
    (2) Because the board switches sides each turn, eligibility trace updates
        must be of the form z_t+1 <-  -λz_t + 𝝯v
  
  You may find the following greeks a helpful reference:
  alpha : Learning Rate
  lambda: Exponential Decay parameter for the eligibility trace
          (which is essentially momentum but with different
           interpertation and is occasionally zeroed out).
  delta : Temporal difference (TD) i.e. the difference between the estimated
          value of a step and the realized value upon the best move (based
          on further estimation of course).
  '''
  def __init__(self, parameters, alpha, lamda):
    self.alpha = alpha
    self.lamda = lamda # Note alternate spelling (I didn't make it up!)
    defaults   = dict(alpha = alpha, lamda = lamda)

    super(AlternatingTDLambda, self).__init__(parameters, defaults)
    
  @torch.no_grad()
  def step(self, delta, update_trace = True):
    '''Performs a single optimization step updating the trace *afterwards*
    
    update_trace must be called before first step to initialize the trace.
    
    Arguments
    ---------
    
    delta: Difference between estimated value of move at time t and realized
           value after moving and going to time t+1
    '''
    
    for group in self.param_groups:
      alpha = group['alpha']
      
      for p in group['params']:
        if p.grad is None:
          continue
        
        state = self.state[p]
        
        if len(state) == 0 or 'trace' not in state:
          raise RuntimeError('Traces must be initialized before calling step')
          
        trace = state['trace']
        
        p.add_(alpha * delta * trace) # Note gradient *ascent* in reinforcement learning
    
    if update_trace:
      self._update_trace()

  @torch.no_grad()
  def _update_trace(self):
    '''Updates the trace based on the gradients.
    
    This also is the only way to initialize the traces.
    It must be called after evaluating the starting position
    and backprop at the beginning of the game, usually from
    the optimizers restart method.
    '''
    for group in self.param_groups:
      lamda = group['lamda']
      
      for p in group['params']:
        if p.grad is None:
          continue
        
        state = self.state[p]
        
        # Initialize to zero if necessary
        if len(state) == 0 or 'trace' not in state:
          state['trace'] = torch.zeros_like(p)
          
        trace = state['trace']
        trace.mul_(-lamda).add_(p.grad)
      
  @torch.no_grad()
  def _zero_trace(self):
    for group in self.param_groups:
      for p in group['params']:
        state = self.state['p']
        if 'trace' not in state:
          continue
          
        trace = state['trace']
        trace.zero_()
    
  def restart(self, score):
    '''Call to restart the trace
    
    Returns score.item() as a convenience
    '''
    self._zero_trace()
    score.backward()
    self._update_trace()
    self.zero_grad()
    return score.item()
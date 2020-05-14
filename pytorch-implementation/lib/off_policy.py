class EpsilonGreedy:
  
  def __init__(self, epsilon):
    self.epsilon = epsilon
  
  def __call__(self, num_options):
    if np.random.random() < self.epsilon:
      return np.random.randint(0, num_options)
    else:
      return None
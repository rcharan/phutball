'''Implements Monte Carlo Tree Search for Moves'''


class Tree:

  def __init__(self, state):

    self.children = []
    self.state    = state

  def register_child(self, child):
    self.children.append(child)
from datetime import datetime
from math import floor
from .utilities import product

class Timer:

  def __init__(self):
    self.start_time = datetime.now()

  def elapsed_time(self):
    return (datetime.now() - self.start_time)

  def __repr__(self):
    return self.pretty_print(self.elapsed_time())

  @staticmethod
  def pretty_print(timedelta):
    total_seconds = timedelta.total_seconds()
    multiples = [24, 60, 60, 1]
    formats   = [
      lambda days  : f'{days} days ',
      lambda hours : f'{hours}:',
      lambda mins  : f'{mins:02d}:',
      lambda secs  : f'{secs:02d}',
    ]
    force_zeros = False
    out = ''
    for formatter in formats:
      quot          = floor(total_seconds / product(multiples))
      total_seconds = total_seconds - quot * product(multiples)
      multiples = multiples[1:]
      if quot == 0 and not force_zeros:
        continue
      else:
        amt_to_append = formatter(quot)
        if not force_zeros and amt_to_append[0] == '0':
          amt_to_append = amt_to_append[1:]
        out += amt_to_append
        force_zeros = True
    
    if not force_zeros: # Display milliseconds only
      out += f'{total_seconds*1000:.0f}ms'
    elif timedelta.total_seconds() < 10:
      out += f'{total_seconds:.1f}s'[1:]
    elif timedelta.total_seconds() < 60:
      out += 's'
    
    return out
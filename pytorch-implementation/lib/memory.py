import torch.cuda as cutorch
import psutil
import gc

def format_bytes(num):
  for unit in 'BKMGTPEZ':
    if num < 1024:
        return f'{num:.2f}{unit}iB'
    num /= 1024.0
  return f'{num:.2f}YB'


# For Memory Inspection on GPU
def print_memory_usage_cuda():
    for i in range(cutorch.device_count()):
        print(f'GPU {i}     : ' + format_bytes(torch.cuda.memory_allocated(device=0)))

def print_max_memory_usage_cuda():
    for i in range(cutorch.device_count()):
        print(f'GPU {i} Peak: ' + format_bytes(torch.cuda.max_memory_allocated(device=0)))

def garbage_collect_cuda(verbose = False):
  if verbose:
    print_memory_usage_cuda()
    
  num_collected = gc.collect()
  torch.cuda.empty_cache()

  if verbose:
    print('Collecting Garbage...', num_collected)
    print_memory_usage_cuda()



# For Memory inspection on CPU
def print_memory_usage():
  print(format_bytes(process.memory_info().rss))

# Not really implemented on OS X without a full memory profile
#  There does seem to be a windows implementation
#  though (with .peak_wset)
def print_max_memory_usage():
  pass


def garbage_collect(verbose = False):
  if verbose:
    print_memory_usage()

  gc.collect()
  num_collected = gc.collect()

  if verbose:
    print('Collecting Garbage...', num_collected)
    print_memory_usage_cuda()

import torch


def to_cuda_if_available(obj):
  if torch.cuda.is_available():
    return obj.cuda()
  else:
    return obj

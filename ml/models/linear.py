import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np

from config import opt

class LinearBERT(nn.Module):
    def __init__(self, hidden_size, output_size):
        super(LinearBERT, self).__init__()
        self.fc = torch.nn.Linear(hidden_size, output_size)

    def forward(self, inp):
        return self.fc(inp)

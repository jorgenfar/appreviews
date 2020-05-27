import gc

import numpy as np
import torch
import torch.nn as nn
import transformers
from torch.optim import Adam
from tqdm import tqdm
from transformers import AdamW

from utils import to_cuda_if_available


class AverageMeter:
  def __init__(self):
    self.reset()

  def reset(self):
    self. val = 0
    self.avg = 0
    self.sum = 0
    self.count = 0

  def update(self, val, n=1):
    self.val = val
    self.sum += val * n
    self.count += n
    self.avg = self.sum / self.count


# Class to create datasets from numpy arrays
class ArrayDataset(torch.utils.data.Dataset):
  def __init__(self, *arrays):
    assert all(arrays[0].shape[0] == array.shape[0] for array in arrays)
    self.arrays = arrays

  def __getitem__(self, index):
    return tuple(torch.from_numpy(np.array(array[index])) for array in self.arrays)

  def __len__(self):
    return self.arrays[0].shape[0]


class CustomTransformer(nn.Module):
  def __init__(self):
    super(CustomTransformer, self).__init__()
    self.num_labels = 5
    self.roberta = transformers.XLMRobertaModel.from_pretrained("xlm-roberta-base", output_hidden_states=False,
                                                                num_labels=5)
    self.dropout = nn.Dropout(p=0.2)
    self.classifier = nn.Linear(768, self.num_labels)

  def forward(self,
              input_ids=None,
              attention_mask=None,
              position_ids=None,
              head_mask=None,
              inputs_embeds=None):
    input_ids = input_ids.long()
    _, o2 = self.roberta(input_ids,
                         attention_mask=attention_mask,
                         position_ids=position_ids,
                         head_mask=head_mask,
                         inputs_embeds=inputs_embeds)

    logits = self.classifier(o2)
    outputs = logits
    return outputs


def train_loop_fn(data_loader, model, loss_fn, optimizer):
  model.train()
  total_loss = 0
  length = 0
  for bi, d in enumerate(data_loader):
    length += 1
    ids, targets = d
    ids, targets = to_cuda_if_available(ids), to_cuda_if_available(targets)

    optimizer.zero_grad()
    outputs = model(ids)
    loss = loss_fn(outputs, targets)
    loss.backward()
    optimizer.step()

    total_loss += loss.item()
    del loss, ids, targets, outputs
    gc.collect()

  print("Average loss: ", total_loss / length)


def eval_loop_fn(data_loader, model):
  model.eval()

  r0 = 0
  r1 = 0
  r2 = 0
  size = 0

  for bi, d in enumerate(data_loader):
    ids, targets = d
    ids, targets = to_cuda_if_available(ids), to_cuda_if_available(targets)

    outputs = model(ids)
    logits = torch.nn.functional.log_softmax(outputs, dim=1)
    size += len(ids)
    r0 += ((torch.max(logits, 1)[1] - targets).abs() == 0).sum()
    r1 += ((torch.max(logits, 1)[1] - targets).abs() <= 1).sum()
    r2 += ((torch.max(logits, 1)[1] - targets).abs() <= 2).sum()

  r0 = 100.0 * r0 / size
  r1 = 100.0 * r1 / size
  r2 = 100.0 * r2 / size

  print("\n\n *** EVALUATION ***")
  print("R0: {}".format(r0))
  print("R1: {}".format(r1))
  print("R2: {}".format(r2))
  print("****")


def run():
  tokenized_path = './tokenized_data/'

  x_train = np.load(tokenized_path + 'x_train.npy', mmap_mode='r')
  y_train = np.load(tokenized_path + 'y_train.npy', mmap_mode='r')

  x_valid = np.load(tokenized_path + 'x_valid.npy', mmap_mode='r')
  y_valid = np.load(tokenized_path + 'y_valid.npy', mmap_mode='r')

  print(x_train.shape, x_valid.shape)

  train_dataset = ArrayDataset(x_train, y_train)
  valid_dataset = ArrayDataset(x_valid, y_valid)

  # Delete unused variables
  del x_train, x_valid
  gc.collect()

  train_batch_size = 8
  epochs = 10

  model = CustomTransformer()
  if torch.cuda.is_available():
    model = model.cuda()

  loss_fn = nn.CrossEntropyLoss()
  optimizer = Adam(model.parameters(), lr=1e-3)

  train_sampler = torch.utils.data.RandomSampler(train_dataset)
  train_data_loader = torch.utils.data.DataLoader(
      train_dataset,
      batch_size=train_batch_size,
      sampler=train_sampler,
      drop_last=True
  )

  valid_sampler = torch.utils.data.SequentialSampler(valid_dataset)
  valid_data_loader = torch.utils.data.DataLoader(
      valid_dataset,
      batch_size=4,
      sampler=valid_sampler,
      drop_last=False
  )

  for epoch in tqdm(range(epochs)):
    train_loop_fn(train_data_loader, model, loss_fn, optimizer)
    eval_loop_fn(valid_data_loader, model)


run()
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np

# from gensim.models.keyedvectors import KeyedVectors

from config import opt

class CNN(nn.Module):
    def __init__(self):
        super(CNN, self).__init__()

        self.BATCH_SIZE = 32
        self.MAX_SENT_LEN = opt.max_sentence_length
        self.WORD_DIM = 100
        self.VOCAB_SIZE = opt.vocab_size
        self.CLASS_SIZE = opt.num_classes
        self.FILTERS = opt.filter_sizes
        self.FILTER_NUM = opt.filter_numbers
        self.DROPOUT_EMBED_PROB = 0.3
        self.DROPOUT_MODEL_PROB = 0.3
        self.IN_CHANNEL = 1

        # one for UNK and one for zero padding
        self.NUM_EMBEDDINGS = self.VOCAB_SIZE + 2
        assert (len(self.FILTERS) == len(self.FILTER_NUM))

        self.init_model()

    def get_conv(self, i):
        return getattr(self, 'conv_{}'.format(i))

    def init_model(self):
        self.embed = nn.Embedding(
            self.NUM_EMBEDDINGS, self.WORD_DIM, padding_idx=self.VOCAB_SIZE)


        print("Copying weights to embedding layer")
        weights_matrix = np.zeros((self.VOCAB_SIZE, self.WORD_DIM))
        num_found = 0
        for i in range(self.VOCAB_SIZE):
            if i in opt.index_to_vector:
                weights_matrix[i] = opt.index_to_vector[i]
                num_found += 1
            else:
                weights_matrix[i] = np.random.normal(scale=0.6, size=(self.WORD_DIM, ))
        print("Copied weights to embedding layer")
        print("Found vectors for {}/{} words".format(num_found, self.VOCAB_SIZE))


        for i in range(len(self.FILTERS)):
            conv = nn.Conv1d(
                self.IN_CHANNEL, self.FILTER_NUM[i], self.WORD_DIM * self.FILTERS[i], stride=self.WORD_DIM)
            setattr(self, 'conv_{}'.format(i), conv)

        self.fc = nn.Linear(sum(self.FILTER_NUM), self.CLASS_SIZE)
        self.softmax = nn.Softmax()
        self.dropout_embed = nn.Dropout(self.DROPOUT_EMBED_PROB)
        self.dropout = nn.Dropout(self.DROPOUT_MODEL_PROB)

        # if self.params["CUDA"]:
            # self.cuda()

    def forward(self, inp):
        # inp = (25 x 59) - (mini_batch_size x sentence_length)
        x = self.embed(inp).view(-1, 1, self.WORD_DIM * self.MAX_SENT_LEN)
        x = self.dropout_embed(x)
        # x = (25 x 1 x 17700) - mini_batch_size x embedding_for_each_sentence

        conv_results = [
            F.max_pool1d(F.relu(self.get_conv(i)(x)),
                         self.MAX_SENT_LEN - self.FILTERS[i] + 1).view(-1, self.FILTER_NUM[i])
            for i in range(len(self.FILTERS))]
        # Take a max for each filter - each filter result is 25 x 100 x 57

        # Each conv_result is (25 x 100)  - one max value for each application of each filter type, across each sentence
        x = torch.cat(conv_results, 1)
        # x = (25 x 300) - concatenate all the filter results
        x = self.dropout(x)
        x = self.fc(x)

        return x

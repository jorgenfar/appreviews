import torch
from torch import nn
from sklearn.utils import shuffle

from data import read_and_tokenize, get_review_dataset, pad_reviews
from utils.utils import compute_test_split, batchify
from config import opt
from models.cnn import CNN

tokenized_reviews, vocabulary, word_to_index, index_to_word, index_to_vector = read_and_tokenize()
features, targets = get_review_dataset(tokenized_reviews)

opt.vocab_size = len(vocabulary)
opt.vocabulary = vocabulary
opt.word_to_index = word_to_index
opt.index_to_word = index_to_word
opt.index_to_vector = index_to_vector
opt.num_classes = 5
opt.filter_sizes = [3, 4, 5]
opt.filter_numbers = [100, 100, 100]
opt.max_sentence_length = min(50, max([len(feature) for feature in features]))

features = pad_reviews(features, opt.vocab_size, opt.max_sentence_length)

model = CNN()

train_features, train_targets, test_features, test_targets = compute_test_split(features, targets)
optimizer = torch.optim.Adadelta(model.parameters(), 0.1)
criterion = torch.nn.CrossEntropyLoss()

epochs = 50

def evaluate():
    model.eval()
    r0 = 0
    r1 = 0
    r2 = 0
    for j, (minibatch_features, minibatch_targets) in enumerate(batchify(test_features, test_targets)):
        minibatch_features = torch.LongTensor(minibatch_features)
        minibatch_targets = torch.LongTensor(minibatch_targets)

        predictions = model(minibatch_features)
        logit = torch.nn.functional.log_softmax(predictions, dim=1)

        r0 += (torch.max(logit, 1)[1].view(minibatch_targets.size()).data == minibatch_targets.data).sum()
        r1 += ((torch.max(logit, 1)[1].view(minibatch_targets.size()) - minibatch_targets).abs() <= 1).sum()
        r2 += ((torch.max(logit, 1)[1].view(minibatch_targets.size()) - minibatch_targets).abs() <= 2).sum()

    size = len(test_features)

    r0 = 100.0 * r0 / size
    r1 = 100.0 * r1 / size
    r2 = 100.0 * r2 / size

    print("\n\n *** EVALUATION ***")
    print("R0: {}".format(r0))
    print("R1: {}".format(r1))
    print("R2: {}".format(r2))
    print("****")


for e in range(epochs):
    model.train()
    train_features, train_targets = shuffle(train_features, train_targets)
    for j, (minibatch_features, minibatch_targets) in enumerate(batchify(train_features, train_targets)):

        minibatch_features = torch.LongTensor(minibatch_features)
        minibatch_targets = torch.LongTensor(minibatch_targets)

        predictions = model(minibatch_features)

        optimizer.zero_grad()
        loss = criterion(predictions, minibatch_targets)
        loss.backward()
        optimizer.step()
        print("Batch loss {}".format(loss.item()), end='\r')
    evaluate()

import torch
from pytorch_pretrained_bert import BertTokenizer, BertModel
from pytorch_pretrained_bert.modeling import BertForSequenceClassification
from sklearn.utils import shuffle
from data import get_textual_reviews
from models.linear import LinearBERT

from utils.utils import batchify, compute_test_split

tokenizer = BertTokenizer.from_pretrained('bert-base-multilingual-cased')
model = BertForSequenceClassification.from_pretrained('bert-base-multilingual-cased', 5)
classifier = LinearBERT(768, 5)
encoder = BertModel.from_pretrained('bert-base-multilingual-cased')
encoder.eval()
textual_reviews = get_textual_reviews()

# We are only interested in the actual review
reviews = ["[CLS] " + review[11] + " [SEP]" for review in textual_reviews]
stars = [review[9] - 1 for review in textual_reviews]

tokenized_reviews = [tokenizer.tokenize(review) for review in reviews]
tokenized_reviews = [tokenizer.convert_tokens_to_ids(tokens) for tokens in tokenized_reviews]
max_length = max([len(tokens) for tokens in tokenized_reviews])

optimizer = torch.optim.Adadelta(classifier.parameters(), 0.01)
criterion = torch.nn.CrossEntropyLoss()

train_features, train_targets, test_features, test_targets = compute_test_split([tokenized_reviews, stars])
train_features, train_targets = shuffle(train_features, train_targets)
for j, (minibatch_features, minibatch_targets) in enumerate(batchify([train_features, train_targets])):

    max_length = max([len(tokens) for tokens in minibatch_features])
    minibatch_masks = [ [1] * len(tokens) + [0] * (max_length - len(tokens)) for tokens in minibatch_features]
    minibatch_features = [tokens + [0] * (max_length - len(tokens)) for tokens in minibatch_features]

    minibatch_features = torch.tensor(minibatch_features)
    minibatch_targets = torch.tensor(minibatch_targets)
    minibatch_masks = torch.tensor(minibatch_masks)

    representations, _ = encoder(minibatch_features, token_type_ids=None, attention_mask=minibatch_masks)
    # We want the representations from the final transformer
    representations = representations[-1]
    # We want to classify the representation of the first token in each sentence
    representations = representations.narrow(1, 0, 1).squeeze()

    predictions = classifier(representations)

    optimizer.zero_grad()
    loss = criterion(predictions, minibatch_targets)
    loss.backward()
    optimizer.step()

    print("Batch loss {}".format(loss.item()))

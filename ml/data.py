import glob
import pandas
import json
from pandas import notna
from config import opt
import numpy as np

def get_textual_reviews():
    all_reviews = read_all_reviews()
    textual_reviews = list(filter(lambda x: review_has_text(x), all_reviews))
    return textual_reviews

def read_and_tokenize():
    all_reviews = read_all_reviews()
    reviews_with_response = list(filter(lambda x: review_has_text_and_response(x), all_reviews))
    print(reviews_with_response[0][11])
    print("{} reviews".format(len(reviews_with_response)))

    for review in reviews_with_response:
        review[11] = string_to_array(review[11])
        review[14] = string_to_array(review[14])

    print("Average review length before stopword removal: {}".format(calculate_avg_length(reviews_with_response)))
    reviews_with_response = remove_stopwords(reviews_with_response)
    print("Average review length after stopword removal: {}".format(calculate_avg_length(reviews_with_response)))

    vocabulary, word_to_index, index_to_word, index_to_vector = generate_vocabulary(reviews_with_response)
    tokenized_reviews = tokenize(reviews_with_response, word_to_index)

    return tokenized_reviews, vocabulary, word_to_index, index_to_word, index_to_vector

def calculate_avg_length(reviews):
    total = 0
    for review in reviews:
        total += len(review[11])
    return total / len(reviews)

def remove_stopwords(reviews):
    stopwords = []
    with open('stopwords.txt') as f:
        for line in f:
            stopwords.append(line.replace("\n", ""))

        for review in reviews:
            review[11] = [word for word in review[11] if word not in stopwords]

    return reviews

def get_review_dataset(tokenized_reviews):
    features = [review[11] for review in tokenized_reviews]
    targets = [review[9] - 1 for review in tokenized_reviews]
    return features, targets


def read_all_reviews():
    path = r'/Users/jorgenwilhelmsen/Developer/appreviews/ml/data' # use your path
    all_files = glob.glob(path + "/*.csv")

    li = []
    for filename in all_files:
        df = pandas.read_csv(filename, index_col=None, header=0, encoding='utf-16')
        li.append(df)

    frame = pandas.concat(li, axis=0, ignore_index=True)
    # print(frame)

    all_reviews = frame.values.tolist()
    return all_reviews

def pad_reviews(indexed_reviews, padding_index, max_length):
    indices = []
    for review in indexed_reviews:
        if len(review) > max_length:
            padded_review = review[: max_length]
        else :
            padded_review = review + [padding_index] * (max_length - len(review))
        indices.append(padded_review)
    return indices


def tokenize(reviews, word_to_index):
    tokenized_reviews = []
    for review in reviews:
        review[11] = [word_to_index[word] for word in review[11]]
        review[14] = [word_to_index[word] for word in review[14]]
        tokenized_reviews.append(review)
    return tokenized_reviews


def generate_vocabulary(array):
    all_words = []

    for review in array:
        words = review[11] + review[14]
        all_words = all_words + words
    vocabulary = sorted(list(set(all_words)))
    word_to_index = {word: index for index, word in enumerate(vocabulary)}
    index_to_word = {index: word for index, word in enumerate(vocabulary)}

    index_to_vector = read_word_vectors(word_to_index)

    return vocabulary, word_to_index, index_to_word, index_to_vector

def review_has_text_and_response(review):
    return notna(review[11]) and notna(review[14])

def review_has_text(review):
    return notna(review[11])

def string_to_array(string):
    return string.split(" ")

def read_word_vectors(word_to_index):
    index_to_vector = {}

    print("Reading vectors")
    with open(f'/Users/jorgenwilhelmsen/Downloads/79/model.txt', 'rb') as f:
        next(f)
        for l in f:
            line = l.decode().split()
            word = line[0]
            if word in word_to_index:
                vect = np.array(line[1:]).astype(np.float)
                index = word_to_index[word]
                index_to_vector[index] = vect
    return index_to_vector

import glob
import os

import numpy as np
import pandas as pd
import transformers

tokenizer = transformers.XLMRobertaTokenizer.from_pretrained('xlm-roberta-large')


def regular_encode(texts, tokenizer, maxlen=512):
    enc_di = tokenizer.batch_encode_plus(
        texts,
        return_attention_masks=False,
        return_token_type_ids=False,
        pad_to_max_length=True,
        max_length=maxlen
    )

    return np.array(enc_di['input_ids'])


path = "./data/"
all_files = glob.glob(os.path.join(path, "*.csv"))

all_reviews = pd.concat((pd.read_csv(f, usecols=["Star Rating", "Review Text"], encoding="utf-16") for f in all_files),
                        ignore_index=True) \
    .fillna("none")

reviews_with_text = all_reviews[(all_reviews["Review Text"] != "none")].reset_index(drop=True)

mask = np.random.rand(len(reviews_with_text)) < 0.8
dataframe_train = reviews_with_text[mask]
dataframe_test = reviews_with_text[~mask]

x_train = regular_encode(dataframe_train["Review Text"].values, tokenizer, maxlen=192)
y_train = dataframe_train["Star Rating"].values
y_train = [y - 1 for y in y_train]

x_valid = regular_encode(dataframe_test["Review Text"].values, tokenizer, maxlen=192)
y_valid = dataframe_test["Star Rating"].values
y_valid = [y - 1 for y in y_valid]

np.save('./tokenized_data/x_train', x_train)
np.save('./tokenized_data/x_valid', x_valid)
np.save('./tokenized_data/y_train', y_train)
np.save('./tokenized_data/y_valid', y_valid)

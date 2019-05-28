from sklearn.utils import shuffle

# def compute_test_split(features, targets, split=0.9):
#
#     features, targets = shuffle(features, targets)
#
#     split_index = int(len(features) * 0.9)
#
#     train_features, train_targets = features[:split_index], targets[:split_index]
#     test_features, test_targets = features[split_index:], targets[split_index:]
#
#     return train_features, train_targets, test_features, test_targets

def compute_test_split(lists, split=0.9):

    shuffled_lists = shuffle(*lists)

    split_index = int(len(lists[0]) * 0.9)

    train_lists = [list[:split_index] for list in lists]
    test_lists = [list[split_index:] for list in lists]
    return train_lists + test_lists
    # test_features, test_targets = features[split_index:], targets[split_index:]

    # return train_features, train_targets, test_features, test_targets




def batchify(features, targets, batch_size=32):
    for i in range(0, len(features), batch_size):
        batch_range = min(batch_size, len(features) - i)
        yield features[i: i + batch_range], targets[i: i + batch_range]


def batchify(lists, batch_size=32):
    for i in range(0, len(lists[0]), batch_size):
        batch_range = min(batch_size, len(lists[0]) - i)
        yield [list[i: i + batch_range] for list in lists]

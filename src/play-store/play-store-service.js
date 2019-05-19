const { getPlayStoreReviews } = require('./play-store-adapter');
const { ReviewBuffer } = require('../review-buffer');

const buffer = new ReviewBuffer('play_store', 500);

const getPlayStoreReviewsToPublish = async () => {
  const reviews = await getPlayStoreReviews();
  const filteredReviews = reviews.filter(review => !buffer.contains(review.id));
  filteredReviews.forEach(review => buffer.add(review.id));

  return filteredReviews;
};

module.exports = {
  getPlayStoreReviewsToPublish
};

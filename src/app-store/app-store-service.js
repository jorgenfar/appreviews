const { getAppStoreReviews } = require('./app-store-adapter');
const { ReviewBuffer } = require('../review-buffer');

const buffer = new ReviewBuffer('app_store', 500);

const getAppStoreReviewsToPublish = async () => {
  const reviews = await getAppStoreReviews();
  const filteredReviews = reviews.filter(review => !buffer.contains(review.id));
  filteredReviews.forEach(review => buffer.add(review.id));

  return filteredReviews;
};

module.exports = {
  getAppStoreReviewsToPublish
};

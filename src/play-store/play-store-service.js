const { getReviews, putReviews, TableNames } = require('../db/dynamo-service');
const { getPlayStoreReviews } = require('./play-store-adapter');

const getPlayStoreReviewsToPublish = async () => {
  const registeredReviews = await getReviews(TableNames.ANDROID);
  const registeredReviewsIds = registeredReviews.map(review => review.id);

  const playStoreReviews = await getPlayStoreReviews();
  const filteredReviews = playStoreReviews.filter(
    review => !registeredReviewsIds.includes(review.id)
  );

  await putReviews(TableNames.ANDROID, filteredReviews);

  return filteredReviews;
};

module.exports = {
  getPlayStoreReviewsToPublish
};

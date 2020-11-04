const { getReviews, putReviews, TableNames } = require('../db/dynamo-service');
const { getAppStoreReviews } = require('./app-store-adapter');

const getAppStoreReviewsToPublish = async () => {
  const registeredReviews = await getReviews(TableNames.IOS);
  const registeredReviewsIds = registeredReviews.map(review => review.id);

  const appStoreReviews = await getAppStoreReviews();
  const filteredReviews = appStoreReviews.filter(
    review => !registeredReviewsIds.includes(review.id)
  );

  await putReviews(TableNames.IOS, filteredReviews);

  return filteredReviews;
};

module.exports = {
  getAppStoreReviewsToPublish
};

const flatten = require('lodash.flatten');
const { isProduction } = require('./utils/env-utils');
const { postReview } = require('./slack/slack-adapter');

const {
  getAppStoreReviewsToPublish
} = require('./app-store/app-store-service');
const {
  getPlayStoreReviewsToPublish
} = require('./play-store/play-store-service');

const getAndPublishReviews = async (event, context) => {
  const reviewsToPublish = await Promise.all([
    getAppStoreReviewsToPublish(),
    getPlayStoreReviewsToPublish()
  ])
    .then(flatten)
    .catch(console.error);

  try {
    if (reviewsToPublish) {
      if (isProduction()) {
        console.log(`Publishing ${reviewsToPublish.length} reviews`);
        reviewsToPublish.forEach(postReview);
      } else {
        console.log(`Would have published ${reviewsToPublish.length} reviews`);
      }
    }
  } catch (e) {
    console.error(e);
  }
};

if (!isProduction()) getAndPublishReviews();

module.exports = {
  getAndPublishReviews
};
